import React from "react";
import "./Results.css";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { CircularProgress} from "@material-ui/core";
import CharacterResult from "./children/CharacterResult";
import defaultPalette from "../../theme/palette.js";
import { useSelector } from "react-redux";
import {
  selectIsLoading,
  selectCharacter,
  selectImageResult,
  selectCharacterRuleset,
} from "../../../Store/Slices/CharacterResultSlice";

const theme = createTheme({
  palette: defaultPalette,
});

function CharacterContainer(props) {
  // Context
  // const { imgResult, generationResult} = useStateContext();
  const imageResult = useSelector(selectImageResult);
  const isLoading = useSelector(selectIsLoading);
  const character = useSelector(selectCharacter);
  const ruleset = useSelector(selectCharacterRuleset);

  return (
    <ThemeProvider theme={theme}>
      <div className="characterResult">
        {isLoading ? (
          <div>
            <p>
              We are generating a new unique character for you, please be
              patient, this can take a minute
            </p>
            <CircularProgress color="secondary" />
          </div>
        ) : character?.name ? (<div>
            <CharacterResult
              imgResult={imageResult}
              imgSrc={character.imageUrl}
              character={character}
              ruleset={ruleset}
            />
        </div>) : (
          ""
        )}
      </div>
    </ThemeProvider>
  )
}

export default CharacterContainer;
