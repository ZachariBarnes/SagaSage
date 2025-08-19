// StatComponent.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import { CircularProgress, Tooltip } from "@material-ui/core";
import {getImgSrc } from "../../../../tools/utils.js";
import ScienceIcon from '@mui/icons-material/Science';
import "../CharacterStyles.css";
import PropTypes from "prop-types";
import { Warnings } from "../../../../models/Warnings.ts"
import * as characterState from "../../../../Store/Slices/SavedCharacterSlice";
import EditDialog from "../../../modules/Dialog/EditDialog";

const ImageComponent = ({ character, imageLoading, imageResult, editMode }) => {
  const dispatch = useDispatch();
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const setPrompt=(value) =>{
    dispatch(characterState.setPortraitPrompt(value));
  };

  const regenerateImage = () => {
    dispatch(characterState.generateAndSetImage(false));
    setIsHovering(false);
  };
  const generateExpermentalImage = () => {
    const experimental = true;
    dispatch(characterState.generateAndSetImage(experimental));
    setIsHovering(false);
  };

  const getImage = () => {
    return (
      <div>
      { imageLoading ?
            (<CircularProgress className="image"/>) : (
              <img
                src={imageResult ? getImgSrc(imageResult) : character?.imageUrl}
                alt="Character Portrait"
                className="image"
              />
            )
        }
    </div>)
  }

  const HoverableDiv = ({ handleMouseOver, handleMouseOut }) => {
    return (
      <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        {!editMode || !isHovering ? (
        <div>
            {getImage()}
        </div>
        ) : (
          <HoverComponent />
        )}
      </div>
    );
  };

  const HoverComponent = () => {
    return (
      <div className="image">
        <div className="imageDetails">
          {editMode ? (
            <EditImageComponent />
          ) : (
           <Typography>{character.portraitPrompt}</Typography>
          )}
        </div>
      </div>
    );
  };

 const getImageButtons = () => {
    return (
      <div className="buttonRow">
        {/* <button className='image-button' onClick={() => { }>
          Upload
        </button> */}

        <button className='image-button' onClick={regenerateImage}>
          Regenerate Image
        </button>

        <Tooltip title="Try our experimental Image Generator" placement="top">
          <button className='image-button' onClick={generateExpermentalImage}>
            <ScienceIcon/>
        </button>
        </Tooltip>

      </div>
    )
  }

  const EditImageComponent = () => {
    return (
      <div>

        <Typography>{character.portraitPrompt}</Typography>
        <EditDialog buttonText={'Edit Prompt'} fieldName='Portrait Prompt' formField={character.portraitPrompt} setField={setPrompt}
          showWarning={true} warningText={Warnings.PRIVATE_EDIT}/>
        {getImageButtons()}
        
      </div>
    );
  };


  return (
    <div>
      {/* Hover over this div to hide/show <HoverText /> */}
      <HoverableDiv
        handleMouseOver={handleMouseOver}
        handleMouseOut={handleMouseOut}
      />
    </div>
  );
};

ImageComponent.propTypes = {
  character: PropTypes.object,
  imageLoading: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
};

export default ImageComponent;
