// store.ts

import { createStore, combineReducers } from 'redux';
import { floorReducer } from './floorReducer';
import { canvasReducer } from './canvasReducer';

// Define the root state type
export interface RootState {
  floorState: ReturnType<typeof floorReducer>;
  canvasState: ReturnType<typeof canvasReducer>;
}

// Combine the reducers
const rootReducer = combineReducers<RootState>({
  floorState: floorReducer,
  canvasState: canvasReducer,
  // Add other reducers here if necessary
});

// Export the AppState type
export type AppState = ReturnType<typeof rootReducer>;

// Create and export the store
export const store = createStore(rootReducer);