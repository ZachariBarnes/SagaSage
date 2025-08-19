import React from "react";
import "./CharacterGenerator.scss";
import CharacterFlags from "./CharacterFlags.js";
import { makeStyles } from "@material-ui/core/styles";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Rulesets from "../../../models/RulesetsList";
import mockCharacterResponse from "../../../mockData/mockCharacterResponseDND5E.js";
import {
  TextField,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import * as promptState from "../../../Store/Slices/PromptSlice";
import * as characterState from "../../../Store/Slices/CharacterResultSlice";
import * as authState from "../../../Store/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { generatePortrait, buildPromptModifier } from "../../../tools/utils";
import { postToAPI } from "../../../tools/requestHandler.js";
import defaultPalette from "../../theme/palette.js";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import AdComponent from "../../modules/Ads/AdComponent.js";
import { Warnings } from "../../../models/Warnings.ts";
const target_api_url = process.env.REACT_APP_API_URL;
const debug = process.env.NODE_ENV === "development";
const mockResponse = JSON.parse(JSON.stringify(mockCharacterResponse));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles({
  label: {
    fontWeight: "bold",
  },
  heading: {
    textAlign: "center",
    "justify-content": "center",
    margin: "0px",
  },
});

const theme = createTheme({
  palette: defaultPalette,
});

function CharacterGenerator() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Context
  const credentials = useSelector(authState.selectCredentials);
  const profileLoaded = useSelector(authState.selectProfileLoaded);
  const prompt = useSelector(promptState.selectPrompt);
  const setting = useSelector(promptState.selectSetting);
  const ruleset = useSelector(promptState.selectRuleset);
  const checkboxState = useSelector(promptState.selectCheckboxState);
  const activeModifiers = useSelector(promptState.selectActiveModifiers);
  const otherRuleset = useSelector(promptState.selectOtherRuleset);
  const isLoading = useSelector(characterState.selectIsLoading);
  const mockData = useSelector(promptState.selectMockData);
  const gpt4Enabled = useSelector(promptState.selectGpt4Enabled);
  const displayError = useSelector(characterState.selectDisplayError);
  const errorMessage = useSelector(characterState.selectCharacterError);

  const handleMockDataChange = (event) => {
    dispatch(promptState.setMockData(event.target.checked));
  };

  const handleModelChange = (event) => {
    dispatch(promptState.setGpt4Enabled(event.target.checked));
  };

  const closeError = () => {
    dispatch(characterState.setDisplayError({ displayError: false }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let response = mockResponse;
    const requestbody = buildRequestBody();
    let characterRuleset;
    if (mockData) {
      const generatedResponse = response?.response
        ? response.response
        : response;
      const char = generatedResponse;
      const characterRuleset = response?.ruleset;

      dispatch(characterState.setCharacterRuleset(characterRuleset));
      dispatch(characterState.setCharacter(char));
      navigate("/results", { replace: true });
      const image = await generatePortrait(
        char.portraitPrompt,
        char,
        mockData,
        null
      );
      dispatch(characterState.setImageResult(image));
      return;
    }

    if (!prompt) {
      dispatch(characterState.setCharacter(null));
      return;
    }

    dispatch(characterState.setIsLoading(true));
    // Simple POST request with a JSON body using fetch
    try {
      const data = await postToAPI(
        `${target_api_url}/character`,
        requestbody,
        credentials
      );
      characterRuleset = data.ruleset;
      response = data.response;
      if (
        typeof response === "string" &&
        response.indexOf("generationId") === -1
      ) {
        const generationId = data.usage.id;
        response = response.replace("{", `{"generationId":"${generationId}", `);
      }
    } catch (error) {
      console.log("error generating character:", error);
      dispatch(characterState.setIsLoading(false));
      dispatch(
        characterState.setDisplayError({
          displayError: true,
          message: Warnings.GENERATION_ERROR
        })
      );
    }
    //const generatedResponse = response?.response ? response.response : response;
    const char = response;
    if (!characterRuleset) {
      characterRuleset = ruleset; // Unable to detect ruleset in response - use dropdown value instead
    }
    dispatch(characterState.setCharacterRuleset(characterRuleset));
    dispatch(characterState.setCharacter(char));
    navigate("/results", { replace: true });
    await dispatch(characterState.generateAndSetImage(mockData));
  };

  const buildRequestBody = () => {
    handleCheckboxUpdate(checkboxState);

    const fullPrompt = `${prompt}\n${activeModifiers}`;

    return {
      prompt: fullPrompt,
      auth: process.env.REACT_APP_AUTH_KEY,
      includeSetting: setting ? true : false,
      setting,
      ruleset,
      useGold: gpt4Enabled,
      characterOptions: checkboxState,
    };
  };

  const handleCheckboxUpdate = (checkboxState) => {
    dispatch(promptState.setCheckboxState(checkboxState));
    const promptModifier = buildPromptModifier(checkboxState);
    dispatch(promptState.setActiveModifiers(promptModifier));
  };

  const getTooltipText = () => {
    let tooltip =
      "Provide a prompt and click to 'Generate' to create a new character!";
    if (mockData) {
      return tooltip;
    }
    if (!profileLoaded) {
      tooltip = "Please sign in with Google to generate a character.";
    } else if (!prompt) {
      tooltip = "Please enter a prompt to generate a character.";
    }
    return tooltip;
  };

  return (
    <ThemeProvider theme={theme}>
      <header className="App-header">
        <title>AI Character Generator</title>
      </header>
      <div>
        <div className="ad-layout">
          <div className="CharacterGenerator">
            <Typography component={"span"} align="center">
              <h2>AI Character Generator</h2>
              <p>
                Welcome to our AI character generator.
                <br/> Here you can quickly
                create create new characters for your table top rpg, including generated
                combat stats, character art generation, shop inventories and
                much more! We find this tool especially useful as an NPC generator.
                However, you can completely edit these characters after saving if you want to use it to build your player character as well.
                <br />
                Give it a try!
              </p>
              <p>
                <b>How to use</b>
              </p>
              <p>
                <b> Setting: </b>Provide a description of your world and
                elements of it may present themselves in the details of your new
                character. Or leave setting blank and the AI will proceed
                without it.
                <br />
                <b> Prompt: </b> Use the Prompt box to explain the type of
                character you want to create, for example if a prompt of: "A
                city guard whom is diligently guarding the city gate with his
                men." will generate a Guard type character, and a prompt of: "A
                simple tavern keeper in a small town who is down on his luck."
                will yeild a result of a downtrodden barkeep who is struggling
                to make ends meet.
                <br />
                <b> Ruleset: </b>The Ruleset dropdown allows you to specify
                which game system you are using, and the AI will generate a
                character for that game system to the best of its ability.
                <br />
                <b> Options: </b>The checkboxes in the below form will allow us
                to generate additional details about your character such as
                their backstory, combat stats, and inventory.
              </p>
            </Typography>
            <form className="form" onSubmit={handleSubmit}>
              <table className="formTable">
                <tbody>
                  <tr>
                    <td>
                      <Tooltip title="(Optional) Input details about the world this character exists in So that aspects of your world building can appear in the character's backstory">
                        <label htmlFor="setting">Setting</label>
                      </Tooltip>
                    </td>
                    <td className="input-cell">
                      <FormControl className="large-text-box">
                        <InputLabel
                          style={{ textAlign: "center", marginTop: "12px" }}
                          htmlFor="setting">
                          {setting ? "" : "In a galaxy far, far away..."}
                        </InputLabel>
                        <TextField
                          multiline
                          minrows={3}
                          maxRows={4}
                          id="setting"
                          value={setting}
                          onChange={(e) =>
                            dispatch(promptState.setSetting(e.target.value))
                          }
                          InputProps={{ disableUnderline: true }}
                          style={{ padding: "20px 0px 20px 10px" }}
                        />
                      </FormControl>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Tooltip title="(Required) Specify the type of character you want to create. Example: 'A wandering a Bazaar merchant who also tames elephants.'">
                        <label htmlFor="prompt">Prompt</label>
                      </Tooltip>
                    </td>
                    <td className="input-cell">
                      <FormControl className="large-text-box">
                        <InputLabel
                          style={{ textAlign: "center", marginTop: "12px" }}
                          htmlFor="prompt">
                          {prompt
                            ? ""
                            : "A young Jedi Knight, just begining his training..."}
                        </InputLabel>
                        <TextField
                          multiline
                          minrows={3}
                          maxRows={4}
                          id="prompt"
                          value={prompt}
                          onChange={(e) =>
                            dispatch(promptState.setPrompt(e.target.value))
                          }
                          InputProps={{ disableUnderline: true }}
                          style={{ padding: "20px 0px 20px 10px" }}
                        />
                      </FormControl>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="ruleset">Ruleset</label>
                    </td>
                    <td className="input-cell">
                      <select
                        id="ruleset"
                        value={ruleset}
                        onChange={(e) =>
                          dispatch(promptState.setRuleset(e.target.value))
                        }>
                        {Rulesets.map((ruleset) => (
                          <option value={ruleset} key={ruleset}>
                            {ruleset}
                          </option>
                        ))}
                        {otherRuleset ? (
                          <option value={otherRuleset}>{otherRuleset}</option>
                        ) : null}
                        <option value="Other">Other</option>
                      </select>
                      {ruleset === "Other" ? (
                        <div className="other-rulesets">
                          <FormControl className="other-text-box" size="small">
                            <InputLabel
                              style={{
                                textAlign: "center"
                              }}
                              htmlFor="otherRuleset">
                              {otherRuleset ? "" : "Legend of the 5 Rings"}
                            </InputLabel>
                            <TextField
                              id="ruleset-input"
                              multiline
                              value={otherRuleset}
                              onChange={(e) =>
                                dispatch(
                                  promptState.setOtherRuleset(e.target.value)
                                )
                              }
                              InputProps={{
                                disableUnderline: true
                              }}
                              inputProps={{
                                min: 0,
                                style: {
                                  textAlign: "center",
                                  padding: "5px 0px 5px 0px"
                                }
                              }}
                            />
                          </FormControl>
                          <button
                            className="setRulesetBtn"
                            onClick={(e) => {
                              dispatch(promptState.setRuleset(otherRuleset));
                            }}>
                            Set
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <CharacterFlags onCheckboxUpdate={handleCheckboxUpdate} />
                    </td>
                  </tr>
                  <tr className="centeredRow">
                    <td colSpan="2">
                      <div className="centeredRow">
                        <Tooltip title={getTooltipText()}>
                          <input
                            type="submit"
                            value="Generate"
                            disabled={!profileLoaded && !mockData}
                          />
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                  {debug ? (
                    <tr>
                      <td colSpan="2">
                        <FormControlLabel
                          classes={{ label: classes.label }}
                          control={
                            <Checkbox
                              checked={mockData}
                              onChange={handleMockDataChange}
                              name="mockData"
                              color="secondary"
                            />
                          }
                          label="Mock Data"
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex"
                          }}
                        />
                      </td>
                    </tr>
                  ) : null}
                  {debug ? (
                    <tr>
                      <td colSpan="2">
                        <Tooltip title="gpt4 ~ 10-20x more expensive and takes 2-5x as long">
                          <FormControlLabel
                            classes={{ label: classes.label }}
                            control={
                              <Checkbox
                                checked={gpt4Enabled}
                                onChange={handleModelChange}
                                name="gpt4"
                                color="secondary"
                              />
                            }
                            label="Use GPT 4"
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex"
                            }}
                          />
                        </Tooltip>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </form>
          </div>
        </div>
        {!profileLoaded ? (
          <div>
            <br />
            <b>{getTooltipText()}</b>
          </div>
        ) : isLoading ? (
          <div>
            <p>Loading, please be patient, this can take a minute</p>
            <CircularProgress color="secondary" />
            <br />
            <button
              className="cancelBtn"
              onClick={(e) => {
                dispatch(characterState.setIsLoading(false));
              }}>
              Cancel
            </button>
          </div>
        ) : (
          ""
        )}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={displayError}
          onClose={closeError}
          key="errorPopup"
          autoHideDuration={6000}>
          <Alert onClose={closeError} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        {/* Multiplex-Ad */}
        <AdComponent dataAdSlot="1533505109" />
      </div>
    </ThemeProvider>
  );
}

export default CharacterGenerator;
