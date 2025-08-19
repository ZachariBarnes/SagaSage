//React Imports
import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
//State Imports
import * as characterState from "../../../../Store/Slices/SavedCharacterSlice";
//Material UI Imports
import {
  Typography,
  TextField,
  Grid,
  Card,
  CardContent
} from "@material-ui/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

const ShopDetails = ({ shop, editMode }) => {
  const dispatch = useDispatch();

  const setNewShop = (newShop) => {
    dispatch(characterState.setShop(newShop));
  };

  const setNewShopInventory = (inventory) => {
    dispatch(characterState.setShopInventory(inventory));
  };

  const handleShopUpdate = (value, type) => {
    const newShop = {
      ...shop,
      [type]: value
    };
    setNewShop(newShop);
  };
  
  const handleShopInventoryUpdate = (value, index, property) => {
    const newItem = {
      ...shop.inventory[index],
      [property]:value
    }
    const inventory = [...shop.inventory];
    inventory.splice(index, 1, newItem)
    setNewShopInventory(inventory);
  }

  const handleDeleteItem = (index) => {
    const updatedValues = [...shop.inventory];
    updatedValues.splice(index, 1);
    setNewShopInventory(updatedValues);
  };

  const handleNewItem = () => {
    const array = shop.inventory?.length ? [...shop.inventory] : [];
    const updatedValues = [...array, ""];
    setNewShopInventory(updatedValues);
  };

  const getAddButton = (type) => {
    return (
      <div className="centered">
        <button
          className="list-button"
          onClick={() => handleNewItem()}>
          <AddIcon />
        </button>
      </div>
    );
  };

  const getItemsAsList = (itemList, type) => {
    return itemList.map((item, index) => (
      <div className="shop-item" key={`shop-inventory-${index}`}>
        <Typography key={`${type}-${index}`}>
          <b>{item.name}</b> - Price: {item.price}
        </Typography>
        <Typography key={`${type}-${index}-effect`}>{item.effect}</Typography>
        <br/>
      </div>
    ));
  };

  const getItemsAsEditableList = (itemList) => {
    return itemList.map((item, index) => (
      <Grid
        item
        xs={12}
        sm={6}
        className="item-card"
        key={`'shop-inventory-${index}-container`}>
        <Card raised key={`'shop-inventory-${index}-card`}>
          <CardContent key={`'shop-inventory-${index}-card-content`}>
            <div key={`'shop-inventory-${index}`}>
              <TextField
                InputProps={{
                  className: "edit-field-item-container"
                }}
                label="Item Name"
                value={item.name}
                onChange={(e) =>
                  handleShopInventoryUpdate(e.target.value, index, "name")
                }
              />
              <TextField
                InputProps={{
                  className: "edit-field-large-number-container",
                  inputProps: {
                    className: "edit-field-number"
                  }
                }}
                label="Price"
                value={item.price}
                onChange={(e) =>
                  handleShopInventoryUpdate(e.target.value, index, "price")
                }
              />
            </div>
            <div>
              <TextField
                InputProps={{
                  className: "edit-field-item-container"
                }}
                fullWidth
                multiline
                label="Effect"
                value={item.effect}
                onChange={(e) =>
                  handleShopInventoryUpdate(e.target.value, index, "effect")
                }
              />
            </div>
            <br />
            <button
              className="list-button"
              onClick={() => handleDeleteItem(index)}>
              <DeleteForeverIcon />
            </button>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  const getShopNameComponent = () => {
    if(!editMode && shop.name) {
      return (<Typography variant="h6" className="centered">
        <b>{shop?.name || ""}</b>
      </Typography>);
    }
    else if (editMode) {
      return (
        <TextField
          InputProps={{
            className: "edit-field-item-container",
            inputProps: {
              className: "edit-field-number"
            }
          }}
          label="Shop name"
          value={shop.name || ""}
          onChange={(e) => handleShopUpdate(e.target.value, "name")}
        />
      );
    }
  }

  const getAddShopComponent = () => {
    return getAddButton("inventory") //TODO Add Shop Component Button
  }


  const getShopComponent = () => {
    if ((!shop || Object.entries(shop).length <= 0) && editMode) {
      return getAddShopComponent();
    }
    return (
      <div className="inventory-container">
        <div className="itemBox">
          <div>
            <Typography variant="subtitle1" className="centered">
              <b>Shop Details</b>
            </Typography>
            <br />
            {getShopNameComponent()}
          </div>
              <Typography variant="subtitle1" className="centered">
                <b>Inventory</b>
              </Typography>
              {!editMode ? "" : getAddButton("inventory")}
              {!editMode ? (
                getItemsAsList(shop.inventory, "inventory")
              ) : (
                <Grid
                  container
                  direction="row"
                  className="spellListTable"
                  columnspacing={2}
                  rowspacing={2}>
                  {getItemsAsEditableList(shop.inventory)}
                </Grid>
              )}
        </div>
      </div>
    );
  }

  return getShopComponent(); 
};

ShopDetails.propTypes = {
  shop: PropTypes.object,
  editMode: PropTypes.bool.isRequired
};

export default ShopDetails;
