// StatComponent.js
import React from "react";
import { Typography, Grid, TextField } from "@mui/material";
import "../CharacterStyles.css";
import PropTypes from "prop-types";

const AttributeComponent5e = ({ statName, statValue, onChange, editMode }) => {

  const getModifier = (statValue) => {
    const mod = Math.floor((statValue - 10) / 2);
    let modString = mod >= 0 ? `+${mod}` : `${mod}`;
    return modString;
  };

  return (
    <Grid container className="statGrid" direction="column">
      <Grid item xs={3}>
        <Typography variant="body1"><b>{statName}</b></Typography>
      </Grid>
      <Grid item xs={3}>
        {editMode ? (
          <div >
          <TextField
            type="number"
            value={statValue}
            inputProps={{min: 0, style: { textAlign: 'center', width: '50px' }}}
            onChange={(e) => onChange(statName, e.target.value)}
            variant="outlined"
            size="small"
            />
            <Typography variant="body1" className="statBox">({getModifier(statValue)})</Typography>
          </div>
        ) : (
            <Typography variant="body1" className="statBox">{statValue} <b>({getModifier(statValue)})</b></Typography>
        )}
      </Grid>
    </Grid>
  );
};

AttributeComponent5e.propTypes = {
  statName: PropTypes.string,
  statValue: PropTypes.number,
  editMode: PropTypes.bool.isRequired
};


export default AttributeComponent5e;
