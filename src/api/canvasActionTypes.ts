// canvasReducer.ts


import { SET_CURRENT_FLOOR } from '@types';
export const TURN_ON_DRAWING_MODE = 'TURN_ON_DRAWING_MODE';
export const TURN_OFF_DRAWING_MODE = 'TURN_OFF_DRAWING_MODE';
/**
 * Initial state for the canvas reducer
 */
const initialState: CanvasState = {
  isDrawingMode: false,
};

/**
 * Canvas reducer to handle drawing mode and current floor state
 */
export const canvasReducer = (
  state = initialState,
  action: CanvasActionTypes
): CanvasState => {
  switch (action.type) {
    case TURN_ON_DRAWING_MODE:

    return {
        ...state,
        isDrawingMode: true,
        floor: action.payload.floor,
        parentFloorId: action.payload.parentFloorId,
      };
    case TURN_OFF_DRAWING_MODE:

      return {
        ...state,
        isDrawingMode: false,
        currentFloor: action.payload.addingFloor, // Assign 'addingFloor' to 'currentFloor'
        floor: null,
        parentFloorId: null,
      };
    case SET_CURRENT_FLOOR:
      return {
        ...state,
        currentFloor: action.payload.currentFloor,
      };
    default:
      return state;
  }
};
