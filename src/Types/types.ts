// sensor.ts

import { Mesh, Path } from "three";

export interface Floor {
    id: Number;        // Unique identifier for the floor
      sensors: Sensor[];      // Array of sensors on the floor
      floors: Floor[];        // Sub-floors or nested floors
      asset: any;             // Asset associated with the floor (type 'any' as placeholder)
      areas: Path[];          // Array of THREE.Path instances representing areas
    
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

export type FloorActionTypes = CreateFloorAction | AddSensorAction | AddAreaAction | AddSubFloorAction;

