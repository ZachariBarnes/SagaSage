// StatsContainer.js
import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Grid, Typography } from '@mui/material';
import AttributeComponent5e from './AttributeComponent5e';
import SavesComponent5e from './SavesComponent5e';
import HPComponent5e from './HPComponent5e';
import PropTypes from "prop-types";
import * as characterState from "../../../../Store/Slices/SavedCharacterSlice";
const StatsContainer = (props) => {
  const dispatch = useDispatch();
  const stats = useSelector(characterState.selectStats);
   
  const handleAttributeChange = (statName, value) => {
      dispatch(characterState.setAttributes({ ...stats.attributes, [statName]: value }));
  };

    const handleSavesChange = (statName, value) => {
        const newSave = { name: statName, bonus: `+${value}` }
        const saveIdx = stats.saves.findIndex((save) => save.name === statName)
        let saves = [...stats.saves];
        saves.splice(saveIdx, 1, newSave);
      dispatch(characterState.setSaves([ ...saves]));
  };

    
  return (
    // <Paper elevation={3} style={{ padding: '10px' }}>
    <div >
      <Typography variant="h7" gutterBottom>
        <b>Stats</b>
      </Typography>

      <HPComponent5e
        hp={parseInt(props.stats.hp)}
        ac={parseInt(props.stats.ac)}
        initiative={props.stats.initiative}
        dex={parseInt(props.stats.attributes.DEX)}
        editMode={props.editMode}
      />

      <Grid container direction="row" className="centered">
        {Object.entries(props.stats.attributes).map(([statName, statValue]) => (
          <Grid item key={statName}>
            <AttributeComponent5e
              statName={statName}
              statValue={parseInt(statValue)}
              editMode={props.editMode}
              onChange={handleAttributeChange}
            />
          </Grid>
        ))}
      </Grid>
      <br />
      <Typography variant="h7" gutterBottom>
        <b>Saves</b>
      </Typography>
      <Grid container direction="row" className="centered">
        {props.stats.saves.map((save) => (
          <Grid item key={save.name + "Save"}>
            <SavesComponent5e
              statName={save.name}
              statValue={parseInt(save.bonus.replace("+", ""))}
              editMode={props.editMode}
              onChange={handleSavesChange}
            />
          </Grid>
        ))}
      </Grid>

      {/* </Paper> */}
    </div>
  );
};

StatsContainer.propTypes = {
    stats: PropTypes.object,
    editMode: PropTypes.bool.isRequired
};

export default StatsContainer;