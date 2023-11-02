import {
  configureStore,
  combineReducers,
  PayloadAction,
  CombinedState,
  Reducer,
} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import loginReducer, { AdminState } from './loginSlice';
import userReducer, { UserState } from './UserSlice';
import inventoryReducer, { InventoryState } from './InventorySlice'
import logger from 'redux-logger';

const persistConfig = {
  key: 'root',
  storage,
};

const reducers = combineReducers({
  admin: loginReducer,
  users: userReducer,
  inventory: inventoryReducer,
});

const rootReducer = (
  state: CombinedState<
    { admin: AdminState; users: UserState; inventory: InventoryState } | never | undefined
  >,
  act: PayloadAction<unknown>,
) => {
  if (act.type === 'admin/signOut') {
    state = undefined;
  }
  return reducers(state, act);
};

const persistedReducer = persistReducer<RootState>(
  persistConfig,
  rootReducer as Reducer,
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof rootReducer>;
