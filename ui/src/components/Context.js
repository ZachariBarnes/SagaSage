import React, { createContext, useContext, useState } from "react";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [profile, setProfile] = useState({});
  const [credentials, setCredentials] = useState({});
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [generationResult, setGenerationResult] = useState(false);
  const [imgResult, setImgResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  return (
    <Context.Provider
      value={{
        profile,
        setProfile,
        credentials,
        setCredentials,
        profileLoaded,
        setProfileLoaded,
        isLoading,
        setIsLoading,
        generationResult,
        setGenerationResult,
        imgResult,
        setImgResult
      }}
    >
      {children}
    </Context.Provider>
  );
};
export const useStateContext = () => useContext(Context);
