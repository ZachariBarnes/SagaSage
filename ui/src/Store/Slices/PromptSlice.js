import { createSlice } from "@reduxjs/toolkit";
import Rulesets from "../../models/RulesetsList";
import { buildPromptModifier } from "../../tools/utils";

const debug = process.env.NODE_ENV === "development";

export const promptSlice = createSlice({
  name: "characterPrompt",
  initialState: {
    prompt: "",
    setting: "",
    ruleset: Rulesets[0],
    otherRuleset: "",
    checkboxState: {
      includeDescription: true,
      includeBackground: false,
      includeStats: false,
      includeLoot: false,
      shopkeeper: false,
    },
    activeModifiers: "Include a physical description for this character.",
    mockData: debug,
    gpt4Enabled:false,
  },
  reducers: {
    setPrompt: (state, action) => {
      state.prompt = action.payload;
    },
    setSetting: (state, action) => {
      state.setting = action.payload;
    },
    setRuleset: (state, action) => {
      state.ruleset = action.payload;
    },
    setOtherRuleset: (state, action) => {
      state.otherRuleset = action.payload;
    },
    setCheckboxState: (state, action) => {
      state.checkboxState = action.payload;
      state.activeModifiers = buildPromptModifier(action.payload);
    },
    setActiveModifiers: (state, action) => {
      state.activeModifiers = action.payload;
    },
    setMockData: (state, action) => {
      state.mockData = action.payload;
    },
    setGpt4Enabled: (state, action) => {
      state.gpt4Enabled = action.payload;
    },
    clearPrompt: (state) => {
      state = this.initialState;
    },
  },
});

export const {
  setPrompt,
  setSetting,
  setRuleset,
  setOtherRuleset,
  setCheckboxState,
  setActiveModifiers,
  setMockData,
  setGpt4Enabled,
  clear,
} = promptSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const setPromptAsync = (value) => (dispatch) => {
  setTimeout(() => {
    dispatch(setPrompt(value));
  }, 1000);
};


// the outside "thunk creator" function
// const fetchUserById = userId => {
//   // the inside "thunk function"
//   return async (dispatch, getState) => {
//     try {
//       // make an async call in the thunk
//       const user = await userAPI.fetchById(userId)
//       // dispatch an action when we get the response back
//       dispatch(userLoaded(user))
//     } catch (err) {
//       // If something went wrong, handle it here
//     }
//   }
// }
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectPrompt = (state) => state.characterPrompt.prompt;
export const selectSetting = (state) => state.characterPrompt.setting;
export const selectRuleset = (state) => state.characterPrompt.ruleset;
export const selectOtherRuleset = (state) => state.characterPrompt.otherRuleset;
export const selectCheckboxState = (state) => state.characterPrompt.checkboxState;
export const selectActiveModifiers = (state) => state.characterPrompt.activeModifiers;
export const selectMockData = (state) => state.characterPrompt.mockData;
export const selectGpt4Enabled = (state) => state.characterPrompt.gpt4Enabled;

export default promptSlice.reducer;
