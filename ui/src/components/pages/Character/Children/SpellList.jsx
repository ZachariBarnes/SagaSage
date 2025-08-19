// StatComponent.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import "../CharacterStyles.css";
import PropTypes from "prop-types";
import * as characterState from "../../../../Store/Slices/SavedCharacterSlice";
import SpellCard from "./SpellCard";

const SpellList = ({spellLabel, editMode }) => {
  const dispatch = useDispatch();
  const spells = useSelector(characterState.selectSpells)

  const setSpells = (newArray) => {
    dispatch(characterState.setSpells(newArray));
  }

  const handleUpdate = (value, index) => {
    const updatedValues = [...spells];
    updatedValues[index] = value;
    setSpells(updatedValues);
  };

  const handleDeleteSpell = (index) => {
    const updatedValues = [...spells];
    updatedValues.splice(index, 1);
    setSpells(updatedValues);
  };

  const handleNewSpell = () => {
    let array = [...spells];
    if (!array || !array.length) {
      array = [];
    }
    const updatedValues = [...array, {}];
    setSpells(updatedValues);
  };

  const getItemsAsList = (list) => {
    if (!list || !list.length) {
      return ''
    }
    const cards = list.map((item, index) => (
      <SpellCard key={`spell-card-${index}`}
        spell={item} index={index} editMode={editMode}
        remove={handleDeleteSpell}
        add={handleNewSpell}
        update={handleUpdate}
      />
    ));

    return cards;
  };

  return (
    <div>
      <div className="grid-header">
        <Typography variant="h5">
          {spells?.length || editMode ? <b>{spellLabel}</b> : ""}
        </Typography>
      </div>
      {editMode ? (
        <button className="list-button" style={{ marginBottom: '15px' }} onClick={() => handleNewSpell(spells)}>
          <AddIcon />
        </button>) : ''
        }
      <Grid
        container
        className="spellListTable"
        columnSpacing={2}
        rowSpacing={2}
        direction="row">
        {getItemsAsList(spells)}
      </Grid>
      <br />
    </div>
  );
};

SpellList.propTypes = {
  spellLabel: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
};

export default SpellList;
