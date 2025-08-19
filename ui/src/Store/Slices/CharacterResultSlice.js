import { createSlice } from "@reduxjs/toolkit";
import { generatePortrait, isJSON, sanitize } from "../../tools/utils.js";
//const debug = process.env.NODE_ENV === "development";

export const characterResult = createSlice({
  name: "characterResult",
  initialState: {
    isLoading: false,
    imageLoading: false,
    character: {},
    imageResult: "",
    ruleSet: "",
    displayError: false,
    displaySnackbar: false,
    savePending: false,
    saved: false,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCharacter: (state, action) => {
      const charJson = sanitize(action.payload);
      let jsonStats;
      if (isJSON(charJson)) {
        const data = JSON.parse(charJson);
        const {
          generationId,
          name,
          appearance,
          description,
          background,
          stats,
          loot,
          personalItems,
          shop,
          portraitPrompt,
          goals,
          quirks,
        } = data;
        if (typeof stats === "string") {
          jsonStats = sanitize(stats);
        } else {
          jsonStats = stats;
        }

        const char = {
          generationId,
          name,
          appearance,
          description,
          background,
          stats: jsonStats,
          loot,
          personalItems,
          shop,
          portraitPrompt,
          goals,
          quirks,
        };
        state.character = char;
        state.isLoading = false;
        state.saved = false;
      } else {
        console.error(
          "Invalid character data, creating Empty character",
          action.payload
        );
        state.character = {};
      }
    },
    setCharacterRuleset: (state, action) => {
      state.ruleSet = action.payload;
    },
    updateCharacter: (state, action) => {
      const { prop } = action.payload;
      state.character = {
        ...state.character,
        [prop]: action.payload.value,
      };
    },
    setImageResult: (state, action) => {
      state.imageResult = action.payload;
    },
    setImageLoading: (state, action) => {
      state.imageLoading = action.payload;
    },
    clearImageResult: (state, action) => {
      state.imageResult = "";
    },
    clearCharacter: (state) => {
      state = characterResult.initialState;
    },
    setDisplayError: (state, action) => {
      const { displayError, message } = action.payload;
      state.displayError = displayError;
      state.error = message;
    },
    setSavePending: (state, action) => {
      state.savePending = action.payload;
    },
    setDisplaySaved: (state, action) => {
      const { displaySaved, message } = action.payload;
      state.saved = displaySaved;
      state.displaySnackbar = displaySaved;
      state.message = message;
    },
  },
});

export const {
  ruleSet,
  setIsLoading,
  setCharacter,
  setCharacterRuleset,
  updateCharacter,
  setImageResult,
  clearCharacter,
  setImageLoading,
  setDisplayError,
  setSavePending,
  setDisplaySaved,
} = characterResult.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const setCharacterAsync = (value) => (dispatch) => {
  setTimeout(() => {
    dispatch(setCharacter(value));
  }, 1000);
};


//the outside "thunk creator" function
export const generateAndSetImage = (mockData, experimental=false) => {
  // the inside "thunk function"

  if(!mockData) {
    return async (dispatch, getState) => {
      const character = getState().characterResult.character;
      const credentials = getState().auth.credentials;
      try {
        dispatch(setImageLoading(true));
        // make an async call in the thunk
        const result = await generatePortrait(
          character.portraitPrompt,
          character,
          mockData,
          credentials,
          experimental
        );
        // dispatch an action when we get the response back
        dispatch(setImageResult(result));
        dispatch(setImageLoading(false));

      } catch (err) {
        // If something went wrong, handle it here
        dispatch(setIsLoading(false));
        dispatch(setImageLoading(false));

      }
    }
  };
};
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCharacter = (state) => state.characterResult.character;
export const selectImageResult = (state) => state.characterResult.imageResult;
export const selectIsLoading = (state) => state.characterResult.isLoading;
export const selectImageLoading = (state) => state.characterResult.imageLoading;
export const selectCharacterRuleset = (state) => state.characterResult.ruleSet;
export const selectDisplayError = (state) => state.characterResult.displayError;
export const selectCharacterError = (state) => state.characterResult.error;
export const selectSavePending = (state) => state.characterResult.savePending;
export const selectDisplaySaved = (state) => state.characterResult.displaySaved;
export const selectCharacterSaved = (state) => state.characterResult.saved;
export default characterResult.reducer;
