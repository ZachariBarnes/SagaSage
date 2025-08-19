//React Imports
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
//Material UI Imports
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, TextField } from "@material-ui/core";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import { CircularProgress } from "@material-ui/core";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

//Component Imports
import defaultPalette from "../../theme/palette";
import StatsContainer from "./Children/StatsContainer";
//State Imports
import * as characterState from "../../../Store/Slices/SavedCharacterSlice";
import * as authState from "../../../Store/Slices/AuthSlice";
import {
  hasAttacks,
  getAttacks,
  getFeatLabel,
  hasAbilities,
  getFeats,
  getSpellLabel
} from "../../../tools/utils.js";
import GoalsAndQuirks from "./Children/GoalsandQuirks.jsx";
import ImageComponent from "./Children/ImageComponent.jsx";
import SpellList from "./Children/SpellList.jsx";
import SkillsList from "./Children/Skills.jsx";
import InventoryList from "./Children/InventoryList.jsx";
import ShopDetails from "./Children/ShopDetails.jsx";
import { Warnings } from "../../../models/Warnings.ts";

const debug = process.env.NODE_ENV === "development";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: theme.spacing(2)
  },
  characterSheet: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    marginBottom: theme.spacing(2)
  },
  section2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "left",
    justifyContent: "center",
    marginRight: "2vw",
    minWidth: "15vw",
    borderStyle: "solid",
    borderWidth: "1px",
    textAlign: "center",
    paddingLeft: "5px",
    paddingRight: "5px",
    whiteSpace: "pre-wrap"
  },
  section: {
    textAlign: "center",
    marginLeft: "1vw",
    marginRight: "1vw",
    marginBottom: theme.spacing(2)
  },
  editButton: {
    marginBottom: theme.spacing(2),
    backgroundColor: `#007bff`,
    color: `#fff`,
    cursor: `pointer`,
    border: `none`,
    borderRadius: `2rem`,
    fontSize: `16px`,
    fontWeight: `bold`,
    padding: `10px 25px`,
    transition: `all 0.2s ease-in-out`
  },
  palette: defaultPalette
}));

const CharacterSheet = (props) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(characterState.selectIsLoading);
  const character = useSelector(characterState.selectCharacter);
  const imageLoading = useSelector(characterState.selectImageLoading);
  const imageResult = useSelector(characterState.selectImageResult);
  const profileLoaded = useSelector(authState.selectProfileLoaded);
  const profile = useSelector(authState.selectProfile);
  const params = useParams();
  useEffect(() => {
    if (!isLoading) {
      if (!character || character.characterId !== params.id) {
        if (
          !isInvalidCharacter(character) ||
          character?.characterId !== params.id
        ) {
          console.log("Loading Character");
          props.getCharacter();
        }
      }
    }
  }, [props, character, isLoading, params]);

  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);

  const isInvalidCharacter = (character) => {
    const invalid = character?.invalid === true;
    console.log("isInvalidCharacter:", invalid);
    return invalid;
  };

  const setAppearance = (value) => {
    dispatch(characterState.setAppearance(value));
  };

  const setDescription = (value) => {
    dispatch(characterState.setDescription(value));
  };

  const setBackground = (value) => {
    dispatch(characterState.setBackground(value));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    // Save the edited data
    setEditMode(false);
  };

  const handleToggle = async (event) => {
    const newValue = true;
    dispatch(characterState.setPrivate(newValue));
  };

  const showToggle = () => {
    return editMode ? (
      <div className="inventory-grid">
        <Tooltip title={Warnings.PRIVATE_TOOLTIP} placement="top">
          <label>Private</label>
        </Tooltip>

        <Switch
          checked={character.isPrivate}
          disabled={character.isPrivate}
          onChange={handleToggle}
          inputProps={{ "aria-label": "Mark Character as Private" }}
        />
      </div>
    ) : (
      ""
    );
  };

  const characterEditable = () => {
    if (profileLoaded) {
      return profile.userId === character.userId;
    }
    return false;
  };

  if (isInvalidCharacter(character)) {
    return (
      <div className="characterResult">
        <Typography>Character not found</Typography>
      </div>
    );
  } else {
    if (debug) {
      console.log("CharacterSheet:", character);
    }

    return (
      <div className={classes.root}>
        {isLoading || !character ? (
          <div className="characterResult">
            <p>Loading...</p>
            <CircularProgress color="secondary" />
          </div>
        ) : (
          <div>
            <header>
              <title>Character Builder</title>
            </header>
            <div style={{ height: "100%" }}>
              <div className={classes.characterSheet}>
                <div className="section1">
                  <ImageComponent
                    character={character}
                    imageLoading={imageLoading}
                    imageResult={imageResult}
                    editMode={editMode}
                  />
                  <div className="centered">
                    <Typography className="title" variant="h3">
                      {character.name}
                    </Typography>
                    <br />
                    {character.stats?.classes?.length && (
                      <>
                        {character.stats?.classes?.map((prof) => (
                          <Typography key={`class-${prof.name}`}>
                            Level {prof.level} {prof.name}
                          </Typography>
                        ))}
                      </>
                    )}
                    {character.stats && (
                      <StatsContainer
                        stats={character.stats}
                        editMode={editMode}
                      />
                    )}
                    <br />
                  </div>
                </div>
              </div>
              {character.stats && (
                <div className={classes.section2}>
                  <SkillsList
                    skills={character.stats.skills}
                    editMode={editMode}
                  />
                  <div className={classes.actions}>
                    {/*Attacks and Spells*/}
                    {hasAttacks(character.stats) && (
                      <div className={classes.section}>
                        <div className="skillBox">
                          <Typography variant="h6" className="centered">
                            <b>Attacks</b>
                          </Typography>
                          <br />
                          {editMode ? (
                            <TextField
                              multiline
                              InputProps={{
                                style: {
                                  minWidth: `15vw`
                                }
                              }}
                              value={getAttacks(
                                character.stats,
                                character.ruleset
                              )}
                              // onChange={(e) => setAppearance(e.target.value)}
                            />
                          ) : (
                            <Typography>
                              {getAttacks(character.stats, character.ruleset)}
                            </Typography>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={classes.actions}>
                    {" "}
                    {/*Feats and Abilities*/}
                    {hasAbilities(character.stats) && (
                      <div className={classes.section}>
                        <div className="skillBox">
                          <Typography variant="h6" className="centered">
                            <b>
                              {getFeatLabel(character.ruleset)}
                              /Abilities
                            </b>
                          </Typography>
                          <br />
                          {editMode ? (
                            <TextField
                              multiline
                              InputProps={{
                                style: { minWidth: `58vw` }
                              }}
                              value={getFeats(
                                character.stats,
                                character.ruleset
                              )}
                              // onChange={(e) => setAppearance(e.target.value)}
                            />
                          ) : (
                            <Typography>
                              {getFeats(character.stats, character.ruleset)}
                            </Typography>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div>
                {character.stats && (
                  <SpellList
                    spellLabel={getSpellLabel(character.stats)}
                    editMode={editMode}
                  />
                )}
              </div>
              <div>
                <InventoryList
                  loot={character.loot}
                  personalItems={character.personalItems}
                  editMode={editMode}
                />
              </div>
              <hr />
              <ShopDetails shop={character.shop} editMode={editMode} />
              <hr />
              <div>
                <br />
                <Typography variant="h5">
                  <b>Character Details</b>
                </Typography>
                {character.stats && (
                  <Typography variant="subtitle1">
                    Ruleset: {character.ruleset}
                  </Typography>
                )}
                {character.world ? (
                  <Typography variant="subtitle1">
                    World: {character.world}
                  </Typography>
                ) : (
                  ""
                )}
                <br />
              </div>
              <div className={classes.section}>
                <Typography variant="h6">
                  <b>Appearance</b>
                </Typography>
                {editMode ? (
                  <TextField
                    multiline
                    fullWidth
                    value={character.appearance}
                    onChange={(e) => setAppearance(e.target.value)}
                  />
                ) : (
                  <Typography>{character.appearance}</Typography>
                )}
              </div>

              <div className={classes.section}>
                <Typography variant="h6">
                  <b>Description</b>
                </Typography>
                {editMode ? (
                  <TextField
                    multiline
                    fullWidth
                    value={character.description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                ) : (
                  <Typography>{character.description}</Typography>
                )}
              </div>

              <div className={classes.section}>
                <Typography variant="h6">
                  <b>Background</b>
                </Typography>
                {editMode ? (
                  <TextField
                    multiline
                    fullWidth
                    value={character.background}
                    onChange={(e) => setBackground(e.target.value)}
                  />
                ) : (
                  <Typography>{character.background}</Typography>
                )}
              </div>

              <GoalsAndQuirks
                goals={character.goals}
                quirks={character.quirks}
                editMode={editMode}
              />

              {showToggle()}

              {/*EditButton */}
              {characterEditable() ? (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.editButton}
                  onClick={editMode ? handleSave : handleEdit}>
                  {editMode ? "Save" : "Edit"}
                </Button>
              ) : (
                ""
              )}
            </div>
            <div className="footnote-container">
              <div className="footnote">
                <Typography>
                  <WarningAmberIcon />
                  This page is current a Work In Progress and may not be fully
                  functional yet
                  <WarningAmberIcon />
                  <br />
                  This page can only be edited by its original creator. If you
                  are the original creator please make sure you are logged in.
                  If you see anything inappropriate on this page please report
                  this page and we will review and follow up with the creator.
                  Thanks for using Saga Sage!
                </Typography>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

CharacterSheet.propTypes = {
  getCharacter: PropTypes.func.isRequired
};

export default CharacterSheet;
