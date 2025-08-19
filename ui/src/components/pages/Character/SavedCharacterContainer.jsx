//import Styles
import "./CharacterStyles.css";
//React Imports
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
//Material UI Imports
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
// My Component/Tool Imports
import { postToAPI } from "../../../tools/requestHandler";
import defaultPalette from "../../theme/palette"
import CharacterSheet from "./Character";
//State Imports
import * as characterState from "../../../Store/Slices/SavedCharacterSlice";

const theme = createTheme({
  palette: defaultPalette,
});

  const url = `${process.env.REACT_APP_GET_CHARACTERS_API_URL}/character`;
  const body = {
    auth: process.env.REACT_APP_AUTH_KEY
  };

function SavedCharacterContainer() {
  const dispatch = useDispatch();
  const params = useParams();
  
  const getCharacter = async (credentials, sortOrder, sortBy) => {
    try {
      dispatch(characterState.setIsLoading(true));
      body.characterId = params.id;
      const response = await postToAPI(url, body, credentials);
      if (response.status !== 200) {
        throw response.error;
      }
      dispatch(characterState.setCharacter(response));
      dispatch(characterState.setIsLoading(false));
      return response;
    } catch (error) {
      console.log("getCharacter error:", error);
      dispatch(characterState.setCharacterInvalid({characterId: params.id}));
      dispatch(characterState.setIsLoading(false));
      return { error: error, message: "Error getting character list." };
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CharacterSheet getCharacter={getCharacter} />
    </ThemeProvider>
  );
}

export default SavedCharacterContainer;
