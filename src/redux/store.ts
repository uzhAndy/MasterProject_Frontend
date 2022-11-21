import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH, PAUSE,
  PERSIST, persistReducer, persistStore, PURGE,
  REGISTER, REHYDRATE
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import clientReducer from "./reducers/clientReducers";
import consultReducer from './reducers/consultReducer';
import userReducer from './reducers/userReducers';

const persistConfig = {
  key: 'user',
  storage,
}
 
const persistedReducer = persistReducer(persistConfig, userReducer)
const persistedReducerClient = persistReducer(persistConfig, clientReducer)
const persistentReducerConsult = persistReducer(persistConfig, consultReducer)

export const store = configureStore({
  reducer: {
    users: persistedReducer,
    client: persistedReducerClient,
    consult: persistentReducerConsult
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch