// SensorClass.ts

import { Floor } from './FloorClass';

export class Sensor {
  id: string;
  x: number;
  y: number;
  label: string;

  constructor(id: string, x: number, y: number, label: string) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.label = label;
  }

  // Optionally, you can have methods for the Sensor class here
}
