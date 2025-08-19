import React from "react";
import "./App.css";
import Homepage from "./pages/Homepage/Homepage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./modules/Navbar/Navbar";
import CharacterGenerator from "./pages/CharacterGenerator/CharacterGenerator";
import AdsTxtComponent from "./pages/AdsTxt/AdsTxtComponent";
import CharacterResult from "./pages/Results/CharacterContainer";
import PrivacyPolicy from "./pages/Policies/PrivacyPolicy";
import CookiePolicy from "./pages/Policies/CookiePolicy";
import TermsAndConditions from "./pages/Policies/TermsAndConditions";
import CharacterListContainer from "./pages/CharacterList/CharacterListContainer";
import MyCharacterListContainer from "./pages/CharacterList/MyCharacterListContainer";
import CharacterSheet from "./pages/Character/SavedCharacterContainer";
import { StateContext } from "./Context";
import { Provider } from "react-redux";
import store from "../Store/store";
import { Link } from "react-router-dom";
import AdComponent from "./modules/Ads/AdComponent";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <StateContext>
          {/* Enable Auto-Ad placement */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6176227606947398"
            crossOrigin="anonymous"
          ></script>
          {/* Enable Ad Blocker Messgae */}
          <script
            async
            src="https://fundingchoicesmessages.google.com/i/pub-6176227606947398?ers=1"
            nonce="jz-jo89-Plh9xSLjwCgKyg"
          ></script>
          <script nonce="jz-jo89-Plh9xSLjwCgKyg">
            {signalGooglefcPresent()};
          </script>
          {/* */}
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/generator" element={<CharacterGenerator />} />
              <Route path="/results" element={<CharacterResult />} />
              <Route path="/ads.txt" element={<AdsTxtComponent />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route
                path="/character-list"
                element={<CharacterListContainer />}
              />
              <Route
                path="/my-characters"
                element={<MyCharacterListContainer />}
              />
              <Route path="/character/:id" element={<CharacterSheet />} />
            </Routes>

            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6176227606947398"
              crossOrigin="anonymous"
            ></script>
            {/*-- Banner-Ad --> */}
            <AdComponent dataAdSlot="6235167447" />

            <footer className="footer">
              <p>&copy;2023 Saga Sage</p>
              <p>
                Please direct feedback to{" "}
                <a className="support" href="mailto:thrasosoft@gmail.com">
                  Thrasosoft@gmail.com
                </a>
                <br />
                <Link className="policy-link" to="/terms">
                  Terms and Conditions
                </Link>{" "}
                |{" "}
                <Link className="policy-link" to="/privacy">
                  Privacy Policy
                </Link>{" "}
                |{" "}
                <Link className="policy-link" to="/cookies">
                  Cookie Policy
                </Link>
              </p>
            </footer>
          </div>
        </StateContext>
      </BrowserRouter>
    </Provider>
  );
}

function signalGooglefcPresent() {
  if (!window.frames["googlefcPresent"]) {
    if (document.body) {
      const iframe = document.createElement("iframe");
      iframe.style =
        "width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;";
      iframe.style.display = "none";
      iframe.name = "googlefcPresent";
      document.body.appendChild(iframe);
    } else {
      setTimeout(signalGooglefcPresent, 0);
    }
  }
}

export default App;
