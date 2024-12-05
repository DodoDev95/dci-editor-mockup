// floorReducer.ts

import { Floor } from '@types';
import { FloorActionTypes, CREATE_FLOOR, ADD_SUBFLOOR, SET_CURRENT_FLOOR } from './floorActionTypes';

const initialState: any = {
  floors: {},
  currentFloor: null,
};

export function floorReducer(
  state = initialState,
  action: FloorActionTypes
): any {
  switch (action.type) {
    case CREATE_FLOOR: {
      const { floor } = action.payload;
      return {
        ...state,
        floors: {
          ...state.floors,
          [floor.id]: { ...floor, subFloors: [] },
        },
      };
    }
    
    case ADD_SUBFLOOR: {
      console.log("ADDING SUBFLOOR", action);
      const { parentFloorId, subFloor } = action.payload;
      const parentFloor = state.floors[state.currentFloor.id];
      if (!parentFloor) {
        console.error(`Parent floor ${parentFloorId} not found`);
        return state;
      }
      const updatedParentFloor = {
        ...parentFloor,
        subFloors: [...parentFloor.subFloors, subFloor.id],
      };
      return {
        ...state,
        floors: {
          ...state.floors,
          [state.currentFloor.id]: updatedParentFloor,
          [subFloor.id]: { ...subFloor, subFloors: [] },
        },
      };
    }
    
    case SET_CURRENT_FLOOR: {
      console.log(action.payload);
      const { currentFloor } = action.payload;
      return {
        ...state,
        currentFloor,
      };
    }
    
    default:
      return state;
  }
}