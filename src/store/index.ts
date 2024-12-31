import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./modules/counterStore";
import tabReducer from "./modules/tabStore";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // 使用 localStorage

const persistConfig = {
  key: "root",
  storage,
};

// 创建一个根 reducer
const rootReducer = combineReducers({
  counter: counterReducer,
  tabManager: tabReducer,
});

// 创建持久化的 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建 Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 创建持久化存储
const persistor = persistStore(store);

// 导出 store 和 persistor
export { store, persistor };

// Infer the RootState type from the store
export type RootState = ReturnType<typeof store.getState>;
