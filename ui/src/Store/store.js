import { configureStore } from "@reduxjs/toolkit";
import promptReducer from "./Slices/PromptSlice";
import characterResultReducer from "./Slices/CharacterResultSlice";
import authReducer from "./Slices/AuthSlice";
import CharacaterListReducer from "./Slices/CharacterListSlice";
import MyCharacterListSlice from "./Slices/MyCharacterListSlice";
import SavedCharacterSlice from "./Slices/SavedCharacterSlice";
const debug = process.env.NODE_ENV === "development";

export default configureStore({
  reducer: {
    characterPrompt: promptReducer,
    characterResult: characterResultReducer,
    auth: authReducer,
    characterList: CharacaterListReducer,
    myCharacterList: MyCharacterListSlice,
    savedCharacter: SavedCharacterSlice,
  },
  devTools: debug,
});
