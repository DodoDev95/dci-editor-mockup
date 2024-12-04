// store.ts

import { createStore, combineReducers } from 'redux';
import { floorReducer } from './floorReducer';

const rootReducer = combineReducers({
  floorState: floorReducer,
  // Add other reducers here if necessary
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer);
