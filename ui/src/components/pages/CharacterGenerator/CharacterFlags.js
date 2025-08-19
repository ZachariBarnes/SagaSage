import React from "react";
import "./CharacterGenerator.scss";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import * as promptState from "../../../Store/Slices/PromptSlice";

const useStyles = makeStyles({
  label: {
    fontWeight: "bold",
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#1481BA",
    },
  },
});

function CharacterFlags({ onCheckboxUpdate }) {
  const dispatch = useDispatch();
  const checkboxState = useSelector(promptState.selectCheckboxState);

  const classes = useStyles();

  const updateCheckboxState = async (newState) => {
    const updatedState = { ...checkboxState, ...newState };
    dispatch(promptState.setCheckboxState(updatedState));
  };

  const handleIncludeDescriptionChange = (event) => {
    updateCheckboxState({ includeDescription: event.target.checked });
  };

  const handleIncludeBackgroundChange = (event) => {
    updateCheckboxState({ includeBackground: event.target.checked });
  };

  const handleIncludeStatsChange = (event) => {
    updateCheckboxState({
      includeStats: event.target.checked,
      includeLoot: event.target.checked,
    });
  };

  const handleIncludeLootChange = (event) => {
    updateCheckboxState({ includeLoot: event.target.checked });
  };

  const handleShopkeeperChange = (event) => {
    updateCheckboxState({ shopkeeper: event.target.checked });
  };

  return (
    <div className="checkbox-row">
      <ThemeProvider theme={theme}>
        <FormControlLabel
          classes={{ label: classes.label }}
          control={
            <Checkbox
              checked={checkboxState?.includeDescription}
              onChange={handleIncludeDescriptionChange}
              name="includeDescription"
              color="primary"
            />
          }
          label="Description"
        />

        <FormControlLabel
          classes={{ label: classes.label }}
          control={
            <Checkbox
              checked={checkboxState?.includeBackground}
              onChange={handleIncludeBackgroundChange}
              name="includeBackground"
              color="primary"
            />
          }
          label="Background"
        />

        <FormControlLabel
          classes={{ label: classes.label }}
          control={
            <Checkbox
              checked={checkboxState?.includeStats}
              onChange={handleIncludeStatsChange}
              name="includeStats"
              color="primary"
            />
          }
          label="Stats"
        />

        <FormControlLabel
          classes={{ label: classes.label }}
          control={
            <Checkbox
              checked={checkboxState?.includeLoot}
              onChange={handleIncludeLootChange}
              name="includeLoot"
              color="primary"
            />
          }
          label="Loot"
        />

        <FormControlLabel
          classes={{ label: classes.label }}
          control={
            <Checkbox
              checked={checkboxState?.shopkeeper}
              onChange={handleShopkeeperChange}
              name="shopkeeper"
              color="primary"
            />
          }
          label="Shopkeeper"
        />
      </ThemeProvider>
    </div>
  );
}

export default CharacterFlags;
