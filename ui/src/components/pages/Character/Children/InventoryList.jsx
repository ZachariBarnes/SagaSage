//React Imports
import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
//State Imports
import * as characterState from "../../../../Store/Slices/SavedCharacterSlice";
//Material UI Imports
import { Typography, TextField, Grid } from "@material-ui/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

const InventoryList = ({ loot, personalItems, editMode }) => {
  const dispatch = useDispatch();

  const setNewValues = (newArray, type) => {
    if (type === "loot") {
      dispatch(characterState.setLoot(newArray));
    } else {
      dispatch(characterState.setPersonalItems(newArray));
    }
  };

  const handleUpdate = (array, index, value, type) => {
    const updatedValues = [...array];
    updatedValues[index] = value;
    setNewValues(updatedValues, type);
  };

  const handleDeleteValue = (array, index, type) => {
    const updatedValues = [...array];
    updatedValues.splice(index, 1);
    setNewValues(updatedValues, type);
  };

  const handleNewItem = (type) => {
    const array = type === "loot" ? loot || [] : personalItems || [];
    const updatedValues = [...array, ""];
    setNewValues(updatedValues, type);
  };

  const hasInventory = () => {
    if (editMode) {
      return true;
    }
    else {
      return ((loot && loot.length) || (personalItems && personalItems.length));
    }
  }

  const getAddButton = (type) => {
    return (
      <div className="centered">
        <button
          className="compact-list-button"
          onClick={() => handleNewItem(type)}>
          <AddIcon />
        </button>
      </div>
    );
  };

  const getItemsAsList = (itemList, type) => {
    return itemList.map((item, index) => (
      <Typography key={`${type}-${index}`}>{item}</Typography>
    ));
  };

  const getItemsAsEditableList = (itemList, type) => {
    const list = itemList && itemList.length ? itemList : [];
    return list.map((item, index) => (
      <div key={`${type}-${index}`} className="editableList">
        <TextField
          InputProps={{
            className: "edit-field-item-container"
          }}
          value={item}
          onChange={(e) => handleUpdate(itemList, index, e.target.value, type)}
        />
        <button
          className="compact-list-button"
          onClick={() => handleDeleteValue(itemList, index, type)}>
          <DeleteForeverIcon />
        </button>
      </div>
    ));
  };

  return (
    <div className="inventory-container">
      {hasInventory() && (
        <div className="itemBox">
          <div>
            <Typography variant="h6" className="centered">
              <b>Inventory</b>
            </Typography>
          </div>
          <Grid container direction="row" className="inventory-grid">
            <Grid className="item-grid-item">
              <Typography variant="subtitle1" className="centered">
                <b>Loot</b>
              </Typography>
              {!editMode ? <br /> : getAddButton("loot")}
              {!editMode
                ? getItemsAsList(loot, "loot")
                : getItemsAsEditableList(loot, "loot")}
            </Grid>
            <hr />
            <Grid className="item-grid-item">
              <Typography variant="subtitle1" className="centered">
                <b>Personal Items</b>
              </Typography>
              {!editMode ? <br /> : getAddButton("personalItems")}
              {!editMode
                ? getItemsAsList(personalItems, "personalItems")
                : getItemsAsEditableList(personalItems, "personalItems")}
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

InventoryList.propTypes = {
  loot: PropTypes.array,
  personalItems: PropTypes.array,
  editMode: PropTypes.bool.isRequired
};

export default InventoryList;
