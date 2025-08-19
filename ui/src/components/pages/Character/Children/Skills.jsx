//React Imports
import React from "react";
import {useDispatch } from "react-redux";
import PropTypes from "prop-types";
//State Imports
import * as characterState from "../../../../Store/Slices/SavedCharacterSlice";
//Material UI Imports
import { Typography, TextField } from "@material-ui/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

const SkillsList = ({ skills, editMode }) => {
  const dispatch = useDispatch();

  const setNewValues = (newArray) => {
    dispatch(characterState.setSkills(newArray));
  };

  const handleUpdate = (index, value) => {
    const updatedValues = [...skills];
    updatedValues[index] = value;
    setNewValues(updatedValues);
  };

  const handleDeleteValue = (index) => {
    const updatedValues = [...skills];
    updatedValues.splice(index, 1);
    setNewValues(updatedValues);
  };

  const handleNewSkill = () => {
    const array = skills || [];
    const updatedValues = [...array, { name: "", bonus: "" }];
    setNewValues(updatedValues);
  };

  const getAddButton = () => {
    return (
      <div className="centered">
        <button className="compact-list-button" onClick={() => handleNewSkill()}>
          <AddIcon />
        </button>
      </div>
    );
  };

  const getItemsAsList = () => {
    console.log("Skills", skills);
    return skills.map((item, index) => (
      <Typography key={`skill-` + index}>
        {item.name}:{item.bonus}
      </Typography>
    ));
  };

  const getItemsAsEditableList = () => {
    return skills.map((item, index) => (
      <div key={`skill-${index}`} className="editableList">
        <TextField
          InputProps={{
            className: "edit-field-skill"
          }}
          value={item.name}
          onChange={(e) => handleUpdate(index, e.target.value, "name")}
        />
        <TextField
          InputProps={{
            className: "edit-field-number-container",
            inputProps: {
              className: "edit-field-number"
            }
          }}
          value={item.bonus}
          onChange={(e) => handleUpdate(index, e.target.value, "bonus")}
        />
        <button
          className="compact-list-button"
          onClick={() => handleDeleteValue(index)}>
          <DeleteForeverIcon />
        </button>
      </div>
    ));
  };

  return (
    <div className="skills-container">
      <div className="skillBox">
        <Typography variant="h6" className="centered">
          <b>Skills</b>
        </Typography>
        {!editMode ? <br /> : getAddButton()}
        {!editMode ? getItemsAsList() : getItemsAsEditableList()}
      </div>
    </div>
  );
};

SkillsList.propTypes = {
  skills: PropTypes.array,
  editMode: PropTypes.bool.isRequired
};

export default SkillsList;
