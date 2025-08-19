/* eslint-disable react-hooks/rules-of-hooks */

import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import section1Styles from "./section1.module.scss";
import section2Styles from "./section2.module.scss";
import section3Styles from "./section3.module.scss";
import styles from "./CharacterResults.module.scss";
import { CircularProgress, Tooltip } from "@material-ui/core";
import {
  getLootList,
  getShopInventory,
  getImgSrc,
} from "../../../../tools/utils.js";
import { useDispatch, useSelector } from "react-redux";
import {
  selectImageLoading,
  generateAndSetImage,
} from "../../../../Store/Slices/CharacterResultSlice";
import PrimaryStats from "../../../modules/StatBlocks/PrimaryStats.jsx";
import Abilities from "../../../modules/StatBlocks/Abilities";
import experimentalIcon from "../../../../images/experimental.png";
import { saveCharacter } from "../../../../tools/utils";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import * as characterState from "../../../../Store/Slices/CharacterResultSlice";
import { green } from '@mui/material/colors';

const SAVE_ERROR = `Error saving character, please try again. \nIf the problem persists please contact us.`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function renderSection1(props) {
  const dispatch = useDispatch();
  const imageLoading = useSelector(selectImageLoading);
  const savePending = useSelector(characterState.selectSavePending);
  const characterSaved = useSelector(characterState.selectCharacterSaved);

  const regenerateImage = () => {
    dispatch(generateAndSetImage(false));
  };
  const generateExpermentalImage = () => {
    const experimental = true;
    dispatch(generateAndSetImage(false, experimental));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    dispatch(characterState.setSavePending(true));
    try {

      const saveResult = await saveCharacter(props.character, props.imgResult, props.ruleset);
      if (saveResult.status !== 200) {
        dispatch(characterState.setSavePending(false));
        dispatch(characterState.setDisplayError({ displayError: true, message: saveResult.error.message }));
      }
      else {
        dispatch(characterState.setSavePending(false));
        dispatch(characterState.setDisplaySaved({ displaySaved: true, message: "Character Saved Successfully" }));
      }
    }
    catch (error) {
      dispatch(characterState.setSavePending(false));
      dispatch(characterState.setDisplaySaved({ displaySaved: false }));
      console.log("Error saving character:", error);
      dispatch(characterState.setDisplayError({ displayError: true, message: SAVE_ERROR }));
    }
  }

  const getSaveComponent = (loading, saving) => {
    if(props.imgSrc) return '';
    return saving ?
      <div className="centeredItem">
      <CircularProgress color="secondary" />
      </div> : loading ? '' :
      <div className="centeredItem">
      <Tooltip title={"Save your character for future use, sharing or editing." }>
        {/*"Save this character for Editing or later use"*/}
        <button
          className={section1Styles.saveBtn}
          onClick={handleSave}
        >
              Save Character
        </button>
      </Tooltip>
        {
          characterSaved ?
            (<CheckRoundedIcon
              fontSize="large"
              style={{ color: green[500], verticalAlign: "bottom", paddingLeft: 10, paddingBottom: 10 }}
            />)
          : ''
        }
    </div>
  }

  const getImageButtons = () => {
    if(props.imgSrc) return '';
    return (
      <div>
        <button className={section1Styles.imageBtn} onClick={regenerateImage}>
          Regenerate Image
        </button>
        <Tooltip title="Try our experimental Image Generator" placement="top">
        <button className={section1Styles.iconBtn}  onClick={generateExpermentalImage}>
            <img src={experimentalIcon} alt="Experimental" />
        </button>
        </Tooltip>
      </div>
    )
  }

  return (
    <section className={section1Styles.section1}>
      <div className={section1Styles.section1__cell}>
        {getSaveComponent(imageLoading, savePending)}
        {imageLoading ? (
          <div className={section1Styles.image}>
            <p>
              We are generating a new unique character for you, please be
              patient, this can take a minute
            </p>
            <CircularProgress color="secondary" />
          </div>
        ) : (
          <img
            src={props.imgSrc ? props.imgSrc : getImgSrc(props.imgResult)}
            alt={props.character.portraitPrompt}
            className={section1Styles.image}
          />
        )}
        {getImageButtons()}
      </div>
      <div className={section1Styles.section1__spacer} />
      <div className={section1Styles.section1__cell1}>
        <div className={section1Styles.flex_column}>
          <div className={section1Styles.flex_column__cell}>
            <h1 className={section1Styles.title}>
              {/* <div contentEditable='true'
              onSubmit={e => editCharacter('name', e.currentTarget.textContent)}> */}
              {props.character?.name}
          {/* </div> */}
        </h1>
          </div>
          <div className={section1Styles.flex_column__cell}>
            <h5 className={section1Styles.highlights}>
              {props.character?.appearance}
            </h5>
          </div>
          <div className={section1Styles.flex_column__cell}>
            <h5 className={section1Styles.highlights}>
              {props.character?.description}
            </h5>
          </div>
          <div className={section1Styles.flex_column__cell}>
            <h5 className={section1Styles.highlights}>
              {props.character?.goals?.length
                ? `Goals: ${props.character.goals.join("\n")}`
                : ""}
              <br />
              <br />
              {props.character?.quirks?.length
                ? `Quirks: ${props.character.quirks.join("\n")}`
                : ""}
            </h5>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderSection2(props) {
  return (
    <section className={section2Styles.section2}>
      {props.character?.stats ? (
        <div className={section2Styles.section2__cell}>
          <PrimaryStats character={props.character} ruleset={props.ruleset} />
        </div>
      ) : (
        ""
      )}
      <div className={section2Styles.section2__cell1}>
        <h5 className={section2Styles.highlights1}>
          {props.character?.background}
        </h5>
      </div>
    </section>
  );
}

function renderSection3(props) {
  return (
    <section className={section3Styles.section3}>
      {props.character?.stats ? (
        <Abilities stats={props.character.stats} ruleset={props.ruleset} />
      ) : (
        ""
      )}
      {props.character?.loot?.length ||
      props.character?.personalItems?.length ? (
        <div>
          <h3 className={section3Styles.sectionHeader}>Loot/Personal Items:</h3>
          <h5 className={section3Styles.highlights}>
            {getLootList(props.character.loot, props.character?.personalItems)}
          </h5>
        </div>
      ) : (
        ""
      )}
      <br />

      <h3>{props.character?.shop?.name}</h3>
      <h5 className={section3Styles.highlights1}>
        <br />
        {getShopInventory(props.character?.shop)}
      </h5>
    </section>
  );
}

function CharacterResult(props) {
  const dispatch = useDispatch();
  const displayError = useSelector(characterState.selectDisplayError);
  const errorMessage = useSelector(characterState.selectCharacterError);
  const closeError = () => {
    dispatch(characterState.setDisplayError({ displayError: false }));
  };

  return (
    <main className={cn(styles.main, "character-result-page")}>
      <div className={styles.main__cell}>{renderSection1(props)}</div>
      <div className={styles.main__cell}>{renderSection2(props)}</div>
      <div className={styles.main__cell}>{renderSection3(props)}</div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={displayError}
        onClose={closeError}
        key="errorPopup"
        autoHideDuration={6000}
      >
        <Alert onClose={closeError} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}

CharacterResult.propTypes = {
  imgResult: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  character: PropTypes.object.isRequired,
  ruleset: PropTypes.string.isRequired,
};
export default CharacterResult;
