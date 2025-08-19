/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect} from "react";
import { googleLogout } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import "../Navbar/Navbar.scss";
import * as authState from "../../../Store/Slices/AuthSlice";
import { useSelector, useDispatch } from "react-redux";
import { signInWithGoogle, auth } from "./firebase";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { postToAPI } from "../../../tools/requestHandler";

const debug = process.env.NODE_ENV === "development";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Auth = () => {
  useEffect(() => {
    const allCookies = document.cookie;
    const cookie = allCookies.split(';').find((cookie) => cookie.includes('sagasage'));
    if (cookie) {
      updateLoginWithCookieData(cookie);
    }
    //checkCookie();
  },[]);
  const dispatch = useDispatch();
  const displayError = useSelector(authState.selectDisplayError);
  const profile = useSelector(authState.selectProfile);
  const profileLoaded = useSelector(authState.selectProfileLoaded);
  //const cookie = useSelector(authState.selectCookie);
  useEffect(() => {
  }, [profileLoaded, displayError]);

  const closeError = () => {
    dispatch(authState.setDisplayError(false));
  };

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    document.cookie = "sagasage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(authState.setProfileLoaded(false));
    dispatch(authState.setProfile(null));
  };

  function fail(error) {
    dispatch(authState.setProfileLoaded(false));
    dispatch(authState.setDisplayError(true));
  }

  function updateLoginWithCookieData(cookie) {
    const token = cookie.split('=')[1];
      //console.log("Decoding Cookie String: ", debug ? token : "<Hidden Due to Log level>");
      const decoded = JSON.parse(atob(token));
      if(debug) console.log("Decoded Cookie String: ", decoded);

      const { email, username, picture, userId } = decoded;
      const profile = {
        email,
        username,
        picture,
        userId
      };
      dispatch(authState.setProfile(profile));
      dispatch(authState.setProfileLoaded(true));
  }

  async function handleFirebaseLogin() { 
    try {
      const response = await signInWithGoogle();
    
      if (response?.user) {
        const { user } = response;
        const { displayName, email, photoURL } = user;
        const profile = {
          email,
          username: displayName || email.split("@")[0],
          picture: photoURL,
        }
        const credentials = await auth.currentUser.getIdToken()
        dispatch(authState.setCredentials(credentials));
        dispatch(authState.setProfile(profile));
        dispatch(authState.setProfileLoaded(true));
        const data = await postToAPI(`${process.env.REACT_APP_LOGIN_URL}/signIn`, null, credentials)
        if (data.cookie) {
          updateLoginWithCookieData(data.cookie);
        }
      }
      else {
        throw response;
      }
    }
    catch (error) {
      console.log(error.message);
      dispatch(authState.setProfileLoaded(false));
      dispatch(authState.setDisplayError(true));
    }
  }


  async function getUser(googleResponse) {
    if (googleResponse?.credential) {
      const token = googleResponse.credential;
      dispatch(authState.setCredentials(token));
      const decoded = jwt_decode(token);
      const { email, name, picture } = decoded;
      const profile = {
        email,
        username: name || email.split("@")[0],
        picture
      };
      dispatch(authState.setProfile(profile));
      dispatch(authState.setProfileLoaded(true));
      const data = await postToAPI(`${process.env.REACT_APP_LOGIN_URL}/signIn`, null, token)
      if (data.cookie) {
          updateLoginWithCookieData(data.cookie);
        }
    }
  }

  return (
    <div className="login">
      <div className="google-button">
        {profileLoaded ? (
          <img
            className="profile-image"
            src={profile.picture}
            referrerPolicy="no-referrer"
            alt="profile icon"
          />
        ) : (
            <GoogleLogin
              type="standard"
              shape="pill"
              data-text="Sign in with Google"
              data-context="Sign in with Google"
              data-itp_support="false"
              onSuccess={(codeResponse) => getUser(codeResponse)}
              onError={() => fail("Login Failed")}
            >Sign in with Google</GoogleLogin>

            // <button className="google-login-btn" onClick={handleFirebaseLogin} >
            //   <img
            //     className="google-logo"
            //     src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            //     alt="Sign in with Google" />
            //   Sign in with Google
            // </button>

        )}
      </div>
      {(!profileLoaded && debug)? (
        <button className="logout-button" onClick={handleFirebaseLogin}>
          Sign in with Firebase
        </button>
      ) : ''}
      {profileLoaded ? (
        <div className="profile-icon"> {profile.username}
          <br />
        <button className="logout-button" onClick={logOut}>
          Log out
          </button>
        </div>
      ) : (
        <></>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={displayError}
        onClose={closeError}
        key="errorPopup"
        autoHideDuration={6000}
      >
      <Alert onClose={closeError} severity="error" sx={{ width: '100%' }}>
        Error logging in
      </Alert>
      </Snackbar>
    </div>
  );
};

export default Auth;
