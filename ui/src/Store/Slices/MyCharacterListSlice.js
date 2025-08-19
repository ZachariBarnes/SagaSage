import { createSlice } from "@reduxjs/toolkit";
//const debug = process.env.NODE_ENV === "development";

export const myCharacterList = createSlice({
  name: "myCharacterList",
  initialState: {
    isLoading: false,
    displayError: false,
    displaySnackbar: false,
    list: undefined,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCharacterList: (state, action) => {
      state.list = action.payload;
      state.isLoading = false;
    },
    clearList: (state) => {
      state = myCharacterList.initialState;
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
    },
  },
});

export const {
  setIsLoading,
  setCharacterList,
  clearList,
  setDisplayError,
  setDisplaySnackbar,
} = myCharacterList.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCharacterList = (state) => state.myCharacterList.list;
export const selectIsLoading = (state) => state.myCharacterList.isLoading;
export const selectDisplayError = (state) => state.myCharacterList.displayError;
export const selectDisplaySnackbar = (state) => state.myCharacterList.displaySnackbar;
export const selectMessage = (state) => state.myCharacterList.message;
export const selectError = (state) => state.myCharacterList.error;

export default myCharacterList.reducer;
