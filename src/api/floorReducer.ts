// floorReducer.ts

import { FloorsState, FloorActionTypes, CREATE_FLOOR, ADD_SENSOR, ADD_AREA, ADD_SUBFLOOR } from '@Types';

const initialState: FloorsState = {
  floors: {},
  sensors: {},
  areas: {},
};

export function floorReducer(
  state = initialState,
  action: FloorActionTypes
): FloorsState {
  switch (action.type) {
    case CREATE_FLOOR: {
      const { floor } = action.payload;
      return {
        ...state,
        floors: {
          ...state.floors,
          [floor.id]: {
            ...floor,
            sensors: [],
            areas: [],
            subFloors: [],
          },
        },
      };
    }
    case ADD_SENSOR: {
      const { sensor } = action.payload;
      const floor = state.floors[sensor.floorId];
      if (!floor) {
        console.error(`Floor ${sensor.floorId} not found`);
        return state;
      }
      return {
        ...state,
        sensors: {
          ...state.sensors,
          [sensor.id]: sensor,
        },
        floors: {
          ...state.floors,
          [sensor.floorId]: {
            ...floor,
            sensors: [...floor.sensors, sensor.id],
          },
        },
      };
    }
    case ADD_AREA: {
      const { area } = action.payload;
      const floor = state.floors[area.floorId];
      if (!floor) {
        console.error(`Floor ${area.floorId} not found`);
        return state;
      }
      return {
        ...state,
        areas: {
          ...state.areas,
          [area.id]: area,
        },
        floors: {
          ...state.floors,
          [area.floorId]: {
            ...floor,
            areas: [...floor.areas, area.id],
          },
        },
      };
    }
    case ADD_SUBFLOOR: {
      const { parentFloorId, subFloor } = action.payload;
      const parentFloor = state.floors[parentFloorId];
      if (!parentFloor) {
        console.error(`Parent floor ${parentFloorId} not found`);
        return state;
      }
      return {
        ...state,
        floors: {
          ...state.floors,
          [subFloor.id]: {
            ...subFloor,
            sensors: [],
            areas: [],
            subFloors: [],
          },
          [parentFloorId]: {
            ...parentFloor,
            subFloors: [...parentFloor.subFloors, subFloor.id],
          },
        },
      };
    }
    default:
      return state;
  }
}
