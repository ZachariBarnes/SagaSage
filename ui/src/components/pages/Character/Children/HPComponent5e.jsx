// StatComponent.js
import React from "react";
import { useDispatch } from "react-redux";
import { Typography, Grid, TextField } from "@mui/material";
import "../CharacterStyles.css";
import PropTypes from "prop-types";
import * as characterState from "../../../../Store/Slices/SavedCharacterSlice";

const HPComponent5e = ({ hp, ac, initiative, dex, onChange, editMode }) => {
  const dispatch = useDispatch();

  const handleHPStatChange = (statName, value) => {
    const defensiveStats = { hp, ac, initiative: (initiative || getModifier(dex)) };
      dispatch(characterState.setDefensiveStats({ ...defensiveStats, [statName]: value }));
  };
  

  const getModifier = (statValue) => {
    const mod = Math.floor((statValue - 10) / 2);
    let modString = mod >= 0 ? `+${mod}` : `${mod}`;
    return modString;
  };

  return (
    
  <Grid container direction="row" className='centered'>
      <Grid item key='hp'>
        {/* HP Grid */}
        <Grid container className="statGrid" direction="column">
          <Grid item xs={3}>
            <Typography variant="body1"><b>HP</b></Typography>
          </Grid>
          <Grid item xs={3}>
            {editMode ? (
              <div >
              <TextField
                type="number"
                value={hp}
                inputProps={{min: 0, style: { textAlign: 'center', width: '55px' }}}
                onChange={(e) => handleHPStatChange('hp', e.target.value)}
                variant="outlined"
                size="small"
                />

              </div>
            ) : (
                <Typography variant="body1" className="statBox"><b>{hp}</b> </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item key='ac'>
        {/* AC Grid */}
        <Grid container className="statGrid" direction="column">
          <Grid item xs={3}>
            <Typography variant="body1"><b>AC</b></Typography>
          </Grid>
          <Grid item xs={3}>
            {editMode ? (
              <div >
              <TextField
                type="number"
                value={ac}
                inputProps={{min: 0, style: { textAlign: 'center', width: '35px' }}}
                onChange={(e) => handleHPStatChange('ac', e.target.value)}
                variant="outlined"
                size="small"
                />

              </div>
            ) : (
                <Typography variant="body1" className="statBox"><b>{ac}</b> </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item key='initiative'>
        {/* Initaitve Grid */}
        <Grid container className="statGrid" direction="column">
          <Grid item xs={3}>
            <Typography variant="body1"><b>Initiative</b></Typography>
          </Grid>
          <Grid item xs={3}>
            {editMode ? (
              <div >
              <TextField
                type="number"
                value={initiative || parseInt(getModifier(dex))}
                inputProps={{min: 0, style: { textAlign: 'center', width: '35px' }}}
                onChange={(e) => handleHPStatChange('initiative', e.target.value)}
                variant="outlined"
                size="small"
                />

              </div>
            ) : (
                <Typography variant="body1" className="statBox"><b>{initiative || getModifier(dex)}</b> </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );
};

HPComponent5e.propTypes = {
  hp: PropTypes.number,
  ac: PropTypes.number,
  initiative: PropTypes.number,
  dex: PropTypes.number,
  editMode: PropTypes.bool.isRequired
};


export default HPComponent5e;
