import React from "react";
import "./CharacterListStyles.css";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Switch from "@mui/material/Switch";
import { useSelector, useDispatch } from "react-redux";
import { postToAPI } from "../../../tools/requestHandler";
import * as characterListState from "../../../Store/Slices/CharacterListSlice";
import CharacterList from "./CharacterList/CharacterList";
import defaultPalette from "../../theme/palette.js";

const debug = process.env.NODE_ENV === "development";

const theme = createTheme({
  palette: defaultPalette,
});

function CharacterListContainer(props) {
  const dispatch = useDispatch();
  const showAll = useSelector(characterListState.selectShowAll);
  const isLoading = useSelector(characterListState.selectIsLoading);
  const characterList = useSelector(characterListState.selectCharacterList);
  //const displayError = useSelector(characterListState.selectDisplayError);
  //const error = useSelector(characterListState.selectError);

  const getCharacterList = async (credentials, sortOrder, sortBy) => {
    try {
      dispatch(characterListState.setIsLoading(true));
      const url = `${process.env.REACT_APP_GET_CHARACTERS_API_URL}/list`;
      const body = {
        sort: sortOrder,
        sortBy: sortBy || "modified_date",
        debug:debug && showAll,
      };
      const response = await postToAPI(url, body, credentials);
      dispatch(characterListState.setCharacterList(response));
      dispatch(characterListState.setIsLoading(false));
      return response;
    } catch (error) {
      console.log("getCharacterList error:", error);
      return { error: error, message: "Error getting character list." };
    }
  };

  const handleToggle = async (event) => {
      const newValue = !showAll
      dispatch(characterListState.setShowAll(newValue));
    };

  const showToggle = () => {
    return (
      <Switch
        checked={showAll}
        onChange={handleToggle}
        inputProps={{ "aria-label": "Show Hidden Characters" }}
      />
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <header>
        <title>Generated Characters</title>
        <h2>Character Generations</h2>
        <h4 className="page-description">The following characters were all created using our AI Character Generator by our users.
          When you create a character you can save them for editing or use later on and choose to display them here.
          Perfect for when your player revist beloved locations or people in your world.
          These characters are also fully editable by their creators so your generated characters can grow and change as your game progresses!</h4>
      </header>
      {debug && showToggle()}
      <CharacterList characterList={characterList} isLoading={isLoading} getCharacterList={getCharacterList} showAll={showAll } />
    </ThemeProvider>
  );
}

export default CharacterListContainer;
