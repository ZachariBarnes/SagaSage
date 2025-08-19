import React, { useEffect} from "react";
import "../CharacterListStyles.css";
import { CircularProgress } from "@material-ui/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import { Grid } from "@mui/material";

//const debug = process.env.NODE_ENV === "development";

function CharacterList(props) {
  useEffect(() => {
    if (!props.characterList && !props.isLoading) {
      console.log("Loading Character List");
      props.getCharacterList()
    }
  }, [props]);
     
  function getCharacterRows() {
    if (props.characterList.length === 0) return (
      <div className="centered">
        You do not have any Saved Characters yet.
        <br />Check out our <Link to="/generator">Character Generator</Link> to create a new character.
      </div>
    );
    const characterRows= props.characterList.map((character) => {
      return (
        <Grid item className="characterGridItem"  key={`${character.id}-row`}>
          <Link className="centered" to={`/character/${character.id}`}>
            <img className="portrait" src={character.image_url} alt={character.portrait_prompt} />
          </Link>
           <Link className="centered" to={`/character/${character.id}`}>
            <div className="characterName">{character.character_name}</div>
          </Link>
          </Grid>
        )
    })
    return (<Grid container className="characterListTable" direction="row">
      {characterRows}
      </Grid>);
  };


  return (
      <div className="characterResult">
        {props.isLoading || !props.characterList ? (
          <div>
            <p>
              Loading...
            </p>
            <CircularProgress color="secondary" />
          </div>
      ) : (
          <div>
              {getCharacterRows()}
            </div>
        )}
      </div>
  );
}

CharacterList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  characterList: PropTypes.array,
  getCharacterList: PropTypes.func.isRequired,
};
export default CharacterList;
