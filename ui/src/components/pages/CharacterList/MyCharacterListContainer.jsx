import React from "react";
import "./CharacterListStyles.css";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { postToAPI } from "../../../tools/requestHandler";
import * as myCharacterListState from "../../../Store/Slices/MyCharacterListSlice";
import * as authState from "../../../Store/Slices/AuthSlice";
import CharacterList from "./CharacterList/CharacterList";
import defaultPalette from "../../theme/palette.js";

const debug = process.env.NODE_ENV === "development";

const theme = createTheme({
  palette: defaultPalette,
});

function MyCharacterListContainer(props) {
  const dispatch = useDispatch();
  const isLoading = useSelector(myCharacterListState.selectIsLoading);
  const characterList = useSelector(myCharacterListState.selectCharacterList);
  const credentials = useSelector(authState.selectCredentials);

  //const displayError = useSelector(myCharacterListState.selectDisplayError);
  //const error = useSelector(myCharacterListState.selectError);
  
  const getCharacterList = async (sortOrder, sortBy) => {
    try {
      dispatch(myCharacterListState.setIsLoading(true));
      const url = `${process.env.REACT_APP_GET_CHARACTERS_API_URL}/my-characters`;
      const body = {
        sort: sortOrder,
        sortBy: sortBy || "modified_date",
        debug,
      };
      const response = await postToAPI(url, body, credentials);
      dispatch(myCharacterListState.setCharacterList(response));
      dispatch(myCharacterListState.setIsLoading(false));
      return response;
    } catch (error) {
      console.log("getCharacterList error:", error);
      return { error: error, message: "Error getting character list." };
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CharacterList characterList={characterList} isLoading={isLoading} getCharacterList={getCharacterList}/>
    </ThemeProvider>
  );
}

export default MyCharacterListContainer;
