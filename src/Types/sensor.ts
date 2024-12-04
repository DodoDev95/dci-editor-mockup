// sensor.ts

import { Floor } from './floor'; // Import Floor if a sensor references its floor

export interface Sensor {
    id: number;
  x: number;
  y: number;
  label: string;
  asset: any; // Asset associated with the sensor (type 'any' as placeholder)
}
