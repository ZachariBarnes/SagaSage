import { createSlice } from "@reduxjs/toolkit";
import { generatePortrait} from "../../tools/utils.js";

//const debug = process.env.NODE_ENV === "development";

export const savedCharacter = createSlice({
  name: "savedCharacter",
  initialState: {
    isLoading: false,
    imageLoading: false,
    character: undefined,
    imageResult: "",
    ruleSet: "",
    displayError: false,
    displaySnackbar: false,
    savePending: false,
    saved: false
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCharacter: (state, action) => {
      const charJson = action.payload;
      let data = charJson;
      if (typeof charJson === "string") {
        data = JSON.parse(charJson);
      }
      const {
        generation_id,
        character_name,
        appearance,
        description,
        backstory,
        stat_block,
        items,
        shop,
        portrait_prompt,
        goals,
        quirks,
        likes,
        dislikes,
        reports,
        user_id,
        image_url,
        ruleset,
        world,
        is_private
      } = data;

      const char = {
        generationId: generation_id,
        name: character_name,
        appearance,
        description,
        background: backstory,
        stats: stat_block,
        loot: items.loot,
        personalItems: items.personalItems,
        shop,
        portraitPrompt: portrait_prompt,
        goals: goals.goals,
        quirks: quirks.quirks,
        userId: user_id,
        likes,
        dislikes,
        reports,
        imageUrl: image_url,
        ruleset,
        world,
        characterId: data.id,
        isPrivate: is_private || false
      };
      state.character = char;
      state.isLoading = false;
      state.saved = false;
      if (!state.character) {
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
    setAppearance: (state, action) => {
      state.character = {
        ...state.character,
        appearance: action.payload
      };
    },
    setDescription: (state, action) => {
      state.character = {
        ...state.character,
        description: action.payload
      };
    },
    setBackground: (state, action) => {
      state.character = {
        ...state.character,
        background: action.payload
      };
    },
    setName: (state, action) => {
      state.character = {
        ...state.character,
        name: action.payload
      };
    },
    setStats: (state, action) => {
      state.character = {
        ...state.character,
        stats: action.payload
      };
    },
    setAttributes: (state, action) => {
      state.character = {
        ...state.character,
        stats: {
          ...state.character.stats,
          attributes: action.payload
        }
      };
    },
    setSaves: (state, action) => {
      state.character = {
        ...state.character,
        stats: {
          ...state.character.stats,
          saves: action.payload
        }
      };
    },
    setDefensiveStats: (state, action) => {
      state.character = {
        ...state.character,
        stats: {
          ...state.character.stats,
          hp: action.payload.hp,
          ac: action.payload.ac,
          initiative: action.payload.initiative
        }
      };
    },
    setPortraitPrompt: (state, action) => {
      state.character.portraitPrompt = action.payload;
      state.character.isPrivate = true;
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
      state = savedCharacter.initialState;
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
    setCharacterInvalid(state, action) {
      state.character = {
        characterId: action.payload.characterId,
        invalid: true
      };
    },
    setGoals: (state, action) => {
      state.character.goals = action.payload;
    },
    setQuirks: (state, action) => {
      state.character.quirks = action.payload;
    },
    setSpells: (state, action) => {
      state.character.stats.spells = [...action.payload];
    },
    setSkills: (state, action) => {
      state.character.stats.skills = [...action.payload];
    },
    setLoot: (state, action) => {
      state.character.loot = [...action.payload];
    },
    setPersonalItems: (state, action) => {
      state.character.personalItems = [...action.payload];
    },
    setPrivate: (state, action) => {
      state.character.isPrivate = action.payload;
    },
    setShop: (state, action) => {
      state.character.shop = action.payload;
    },
    setShopInventory: (state, action) => {
      state.character.shop.inventory = action.payload;
    },
  }
});

export const {
  ruleSet,
  setIsLoading,
  setCharacter,
  setCharacterRuleset,
  setAppearance,
  setDescription,
  setBackground,
  setName,
  setImageResult,
  setPortraitPrompt,
  clearCharacter,
  setImageLoading,
  setDisplayError,
  setSavePending,
  setDisplaySaved,
  setCharacterInvalid,
  setStats,
  setAttributes,
  setSaves,
  setDefensiveStats,
  setGoals,
  setQuirks,
  setSpells,
  setSkills,
  setLoot,
  setPersonalItems,
  setPrivate,
  setShop,
  setShopInventory,
} = savedCharacter.actions;

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
export const generateAndSetImage = (experimental=false) => {
  // the inside "thunk function"

  return async (dispatch, getState) => {
    const character = getState().savedCharacter.character;
    const credentials = getState().auth.credentials;
    try {
      dispatch(setImageLoading(true));
      // make an async call in the thunk
      const result = await generatePortrait(
        character.portraitPrompt,
        character,
        false,
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

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCharacter = (state) => state.savedCharacter.character;
export const selectImageResult = (state) => state.savedCharacter.imageResult;
export const selectIsLoading = (state) => state.savedCharacter.isLoading;
export const selectImageLoading = (state) => state.savedCharacter.imageLoading;
export const selectCharacterRuleset = (state) => state.savedCharacter.ruleSet;
export const selectDisplayError = (state) => state.savedCharacter.displayError;
export const selectCharacterError = (state) => state.savedCharacter.error;
export const selectSavePending = (state) => state.savedCharacter.savePending;
export const selectDisplaySaved = (state) => state.savedCharacter.displaySaved;
export const selectCharacterSaved = (state) => state.savedCharacter.saved;
export const selectStats = (state) => state.savedCharacter.character.stats;
export const selectAttributes = (state) => state.savedCharacter.character.stats.attributes;
export const selectSpells = (state) => state.savedCharacter.character.stats.spells;
export default savedCharacter.reducer;
