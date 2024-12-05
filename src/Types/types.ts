// sensor.ts

import { Mesh, Path } from "three";

export interface Floor {
  name: string;      // Name of the floor
  parent: number;     // ID of the parent floor (if any)
  parentArea?: Path;
    id: Number;        // Unique identifier for the floor
      sensors: Sensor[];      // Array of sensors on the floor
      subFloors: Floor[];        // Sub-floors or nested floors
      asset: any;             // Asset associated with the floor (type 'any' as placeholder)

    
}

// canvasTypes.ts
export interface CanvasState {
  isDrawingMode: boolean;
  parentFloorId: number | null;           // ID of the parent floor (if drawing a subfloor)
}

    
export interface Sensor {
    id: number;
  x: number;
  y: number;
  label: string;
  asset: any; // Asset associated with the sensor (type 'any' as placeholder)
}
// actionTypes.ts

export const CREATE_FLOOR = 'CREATE_FLOOR';
export const ADD_SENSOR = 'ADD_SENSOR';
export const ADD_AREA = 'ADD_AREA';
export const ADD_SUBFLOOR = 'ADD_SUBFLOOR';
export const SET_CURRENT_FLOOR = 'SET_CURRENT_FLOOR';
// actions.ts


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
export type Area = {
    mesh: Mesh;
    path: Path;
  };
interface AddAreaAction {
  type: typeof ADD_AREA;
  payload: {
    area: Array<Area>;
  };
}

interface AddSubFloorAction {
  type: typeof ADD_SUBFLOOR;
  payload: {
    parentFloorId: string;
    subFloor: Floor;
  };
}
interface setCurrentFloor {
  type: typeof SET_CURRENT_FLOOR;
  payload: {
currentFloor: Floor;
  };
}

export type FloorActionTypes = CreateFloorAction | AddSensorAction | AddAreaAction | AddSubFloorAction | setCurrentFloor;

