// sensor.ts

import { Path } from "three";

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
