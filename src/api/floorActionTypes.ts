// floorActionTypes.ts

import { Floor, Sensor } from '@types';

export const CREATE_FLOOR = 'CREATE_FLOOR';
export const ADD_SENSOR = 'ADD_SENSOR';
export const ADD_AREA = 'ADD_AREA';
export const ADD_SUBFLOOR = 'ADD_SUBFLOOR';
export const SET_CURRENT_FLOOR = 'SET_CURRENT_FLOOR';
// floorActions.ts



export const createFloor = (floor: Floor) => ({
  type: CREATE_FLOOR,
  payload: { floor },
});

export const addSensor = (sensor: Sensor) => ({
  type: ADD_SENSOR,
  payload: { sensor },
});

export const addSubFloor = (parentFloorId: number, subFloor: Floor) => ({
  type: ADD_SUBFLOOR,
  payload: { parentFloorId, subFloor },
});

export const setCurrentFloor = (currentFloor: Floor) => ({
  type: SET_CURRENT_FLOOR,
  payload: { currentFloor },
});
interface CreateFloorAction {
  type: typeof CREATE_FLOOR;
  payload: {
    floor: Floor;
  };
}

interface AddSensorAction {
  type: typeof ADD_SENSOR;
  payload: {
    sensor: Sensor;
  };
}

interface AddSubFloorAction {
  type: typeof ADD_SUBFLOOR;
  payload: {
    parentFloorId: number;
    subFloor: Floor;
  };
}

interface SetCurrentFloorAction {
  type: typeof SET_CURRENT_FLOOR;
  payload: {
    currentFloor: Floor;
  };
}

export type FloorActionTypes =
  | CreateFloorAction
  | AddSensorAction
  | AddSubFloorAction
  | SetCurrentFloorAction;