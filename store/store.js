import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
// import storage from "redux-persist/lib/storage"
import authReducer from "./reducer/authReducer";
import storage from "redux-persist/es/storage";
import cartReducer  from "./reducer/cartReducer";

const rootReducer = combineReducers({
  authStore: authReducer,
  cartStore: cartReducer, 
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(store);
