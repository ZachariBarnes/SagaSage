import { createSlice } from "@reduxjs/toolkit";
//const debug = process.env.NODE_ENV === "development";

export const characterList = createSlice({
  name: "characterList",
  initialState: {
    isLoading: false,
    displayError: false,
    displaySnackbar: false,
    list: undefined,
    showAll: null
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setShowAll: (state, action) => {
      state.showAll = action.payload;
      state.list = undefined;
    },
    setCharacterList: (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
    },
    clearList: (state) => {
      state = characterList.initialState;
    },
    setDisplayError: (state, action) => {
      const { displayError, message } = action.payload;
      state.displayError = displayError;
      state.error = message;
    },
    setDisplaySnackbar: (state, action) => {
      const { displaySnackbar, message } = action.payload;
      state.displaySnackbar = displaySnackbar;
      state.message = message;
    }
  }
});

export const {
  setIsLoading,
  setCharacterList,
  clearList,
  setDisplayError,
  setDisplaySnackbar,
  setShowAll
} = characterList.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCharacterList = (state) => state.characterList.list;
export const selectShowAll = (state) => state.characterList.showAll;
export const selectIsLoading = (state) => state.characterList.isLoading;
export const selectDisplayError = (state) => state.characterList.displayError;
export const selectDisplaySnackbar = (state) => state.characterList.displaySnackbar;
export const selectMessage = (state) => state.characterList.message;
export const selectError = (state) => state.characterList.error;

export default characterList.reducer;
