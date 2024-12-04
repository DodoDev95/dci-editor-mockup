// floor.ts

import { Sensor } from './sensor';
import { Path } from 'three'; // Import Path from Three.js

export interface Floor {
id: Number;        // Unique identifier for the floor
  sensors: Sensor[];      // Array of sensors on the floor
  floors: Floor[];        // Sub-floors or nested floors
  asset: any;             // Asset associated with the floor (type 'any' as placeholder)
  areas: Path[];          // Array of THREE.Path instances representing areas
}
