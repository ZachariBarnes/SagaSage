// StatComponent.js
import React from "react";
import { Typography, Grid, TextField } from "@mui/material";
import "../CharacterStyles.css";
import PropTypes from "prop-types";

const SavesComponent5e = ({ statName, statValue, onChange, editMode }) => {


  return (
    <Grid container className="statGrid" direction="column">
      <Grid item xs={3}>
        <Typography variant="body1"><b>{statName}</b></Typography>
      </Grid>
      <Grid item xs={3}>
        {editMode ? (
          <div >
          <b className="modifier">+</b><TextField
            type="number"
            value={statValue}
            inputProps={{min: 0, style: { textAlign: 'center', width: '35px' }}}
            onChange={(e) => onChange(statName, e.target.value)}
            variant="outlined"
            size="small"
            />

          </div>
        ) : (
            <Typography variant="body1" className="statBox">{ statValue >= 0 ? '+' : '' }{statValue} </Typography>
        )}
      </Grid>
    </Grid>
  );
};

SavesComponent5e.propTypes = {
  statName: PropTypes.string,
  statValue: PropTypes.number,
  editMode: PropTypes.bool.isRequired
};


export default SavesComponent5e;
