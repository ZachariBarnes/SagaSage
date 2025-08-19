import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PropTypes from "prop-types";

const SpellCard = ({ spell, index, editMode, remove, update }) => {
  const {
    name,
    duration,
    effect,
    range,
    spellLevel,
    damage,
    damageType,
    saveDC
  } = spell;

  const setSpell = (value, key) => {
    const newSpell = { ...spell, [key]: value };
    update(newSpell, index);
  };

  return (
    <Grid item xs={12} sm={6}>
      <Card raised>
        <CardContent>
          {!editMode ? (
            <Typography variant="h6" gutterBottom>
              {name} - Level {spellLevel}
            </Typography>
          ) : (
            <div className="edit-field-container">
              <div className="text-field-container">
                <TextField
                  InputProps={{
                    className: "edit-field-name-container"
                  }}
                  value={name}
                  onChange={(e) => setSpell(e.target.value, "name")}
                  size="small"
                  variant="outlined"
                  label="Spell Name"
                  type="text"
                />
              </div>
              <div className="text-field-container">
                <TextField
                  InputProps={{
                    className: "edit-field-number-container",
                    inputProps: {
                      className: "edit-field-number"
                    }
                  }}
                  value={spellLevel}
                  onChange={(e) => setSpell(e.target.value, "spellLevel")}
                  size="small"
                  variant="outlined"
                  label="Lvl"
                  type="text"
                />
              </div>
            </div>
          )}
          <Grid container spacing={2} className="edit-field-container">
            {!editMode && (duration || range) ? (
              <Grid item xs={12}>
                <Typography>
                  <b>Duration:</b> {duration} | <b>Range:</b> {range || "N/A"}
                </Typography>
              </Grid>
            ) : (
              <div className="edit-field-container">
                <div className="text-field-container">
                  <TextField
                    InputProps={{
                      className: "edit-field-name-container"
                    }}
                    value={duration}
                    onChange={(e) => setSpell(e.target.value, "duration")}
                    size="small"
                    variant="outlined"
                    label="Duration"
                    type="text"
                  />
                </div>
                <div className="text-field-container">
                  <TextField
                    InputProps={{
                      className: "edit-field-short-text"
                    }}
                    value={range}
                    onChange={(e) => setSpell(e.target.value, "range")}
                    size="small"
                    variant="outlined"
                    label="Range"
                    type="text"
                  />
                </div>
              </div>
            )}
          </Grid>
          <Grid container spacing={2} className="edit-field-container">
            {!editMode ? (effect ? (
              <Grid item xs={12} className="edit-field-container">
                <Typography align="center">
                  <b>Effect:</b> {effect}
                </Typography>
              </Grid>
            ):'') : (
              <Grid item xs={12} className="edit-field-container">
                <div className="effect-field-container">
                  <TextField
                    multiline
                    fullWidth
                    value={effect}
                    onChange={(e) => setSpell(e.target.value, "effect")}
                    label="Effect"
                    type="text"
                  />
                </div>
              </Grid>
            )}
            {!editMode ? ((saveDC || damage) ? (
              <Grid item xs={12}>
                <Typography align="center">
                  <b>Save DC:</b> {saveDC || "N/A"} | <b>Damage:</b> {damage || 'N/A'}{" "}
                  {damageType}
                </Typography>
              </Grid>
            ): '') : (
              <div className="edit-field-container">
                <div className="text-field-container">
                  <TextField
                    InputProps={{
                      className: "edit-field-number-container",
                      inputProps: {
                        className: "edit-field-number"
                      }
                    }}
                    value={saveDC || " "}
                    onChange={(e) => setSpell(e.target.value, "saveDC")}
                    size="small"
                    variant="outlined"
                    label="SaveDC"
                    type="text"
                  />
                </div>
                <div className="text-field-container">
                  <TextField
                    InputProps={{
                      className: "edit-field-short-text"
                    }}
                    value={damage || " "}
                    onChange={(e) => setSpell(e.target.value, "damage")}
                    size="small"
                    variant="outlined"
                    label="Damage"
                    type="text"
                  />
                </div>
                <div className="text-field-container">
                  <TextField
                    InputProps={{
                      className: "edit-field-short-text"
                    }}
                    value={damageType || " "}
                    onChange={(e) => setSpell(e.target.value, "damageType")}
                    size="small"
                    variant="outlined"
                    label="Damage Type"
                    type="text"
                  />
                </div>
              </div>
            )}
          </Grid>
          {editMode && (
            <button className="list-button" onClick={() => remove(index)}>
              <DeleteForeverIcon />
            </button>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

SpellCard.propTypes = {
  spell: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default SpellCard;
