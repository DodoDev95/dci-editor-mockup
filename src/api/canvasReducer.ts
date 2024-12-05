// canvasReducer.ts



import {
  TURN_ON_DRAWING_MODE,
  TURN_OFF_DRAWING_MODE,
  SET_CURRENT_FLOOR,
  CanvasActionTypes,
} from './canvasActionTypes';


/**
 * Initial state for the canvas reducer
 */
const initialState: CanvasState = {
  isDrawingMode: false,
  floor: null,
  parentFloorId: null,
  currentFloor: null,
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
      console.log("TURN_OFF_DRAWING_MODE",action);
      return {
        ...state,
        isDrawingMode: true,
        floor: action.payload.floor,
        parentFloorId: action.payload.parentFloorId,
      };
    case TURN_OFF_DRAWING_MODE:
      console.log("TURN_OFF_DRAWING_MODE",action);
      return {
        ...state,
        isDrawingMode: false,
        currentFloor: action.payload.addingFloor, // Assign 'addingFloor' to 'currentFloor'
        floor: null,
        parentFloorId: null,
      };
    default:
      return state;
  }
};
