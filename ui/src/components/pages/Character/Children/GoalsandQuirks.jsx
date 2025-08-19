// StatComponent.js
import React from "react";
import { useDispatch } from "react-redux";
import { Typography, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import "../CharacterStyles.css";
import PropTypes from "prop-types";
import * as characterState from "../../../../Store/Slices/SavedCharacterSlice";

const GoalsAndQuirks = ({ goals, quirks, editMode }) => {
  const dispatch = useDispatch();

  const setNewValues = (oldArray, newArray, newArrayType=null) => {
    const goalUpdate = oldArray === goals || newArrayType==='goals';
    if (goalUpdate) {
      dispatch(characterState.setGoals(newArray));
    }
    else {
      dispatch(characterState.setQuirks(newArray));
    }
  }

  const handleUpdate = (index, value, array) => {
    const updatedValues = [...array];
    updatedValues[index] = value;
    setNewValues(array, updatedValues);
  };

  const handleDeleteValue = (index, array) => {
    const updatedValues = [...array];
    updatedValues.splice(index, 1);
    setNewValues(array, updatedValues);
  };

  const handleNewQuirkOrGoal = (array, type=null) => {
    if (!array || !array.length) {
      array = [];
    }
    const updatedValues = [...array, ''];
    setNewValues(array, updatedValues, type);
  };

  const getItemsAsList = (list, type) => {
    if (!list || !list.length) {
      return ''
    }
    return list.map((item, index) => (
      <div key={`${type}-${index}`} className="editableList">
        {editMode ? (
          <>
            <TextField
              InputProps={{
                style: { minWidth: `70vw` },
              }}
              multiline
              value={item}
              onChange={(e) => handleUpdate(index, e.target.value, list)}
            />
            <button
              className="list-button"
              onClick={() => handleDeleteValue(index, list)}
            >
              <DeleteForeverIcon/>
              </button>
          </>
        ) : (
          <Typography>{item}</Typography>
        )}
      </div>
    ));
  };

  return (
    <div>
      <div className="centered">
        <Typography variant="h5">
          {goals?.length || editMode ? (<b>Goals</b>) : ''}
        </Typography>
        {getItemsAsList(goals, "goals")}
        {editMode && (
          <>
            <button
              className="list-button"
              onClick={()=>handleNewQuirkOrGoal(goals, 'goals')}
            >
              <AddIcon />
            </button>
          </>
        )}
        <br />
      </div>

      <div className="centered">
        <Typography variant="h5">
           {quirks?.length || editMode ? (<b>Quirks & Flaws</b>) : ''}
        </Typography>
        {getItemsAsList(quirks, "quirks")}
        {editMode && (
          <>
            <button
            className="list-button"
            onClick={()=>handleNewQuirkOrGoal(quirks, 'quirks')}>
              <AddIcon />
            </button>
          </>
        )}
        <br />
      </div>

      <br/>
    </div>
  );
};

GoalsAndQuirks.propTypes = {
  goals: PropTypes.array,
  quirks: PropTypes.array,
  editMode: PropTypes.bool.isRequired,
};

export default GoalsAndQuirks;
