// FloorClass.ts

import AreaClickable from './AreaClass';
import { Sensor } from './SensorClass';
import * as THREE from 'three';

export class Floor {
  id: string;
  sensors: Sensor[];
  floors: Floor[];
  asset: any;
  areas: THREE.Path[];
  scene: THREE.Scene; // Reference to the Three.js scene

  constructor(id: string, asset: any, scene: THREE.Scene) {
    this.id = id;
    this.sensors = [];
    this.floors = [];
    this.asset = asset;
    this.areas = [];
    this.scene = scene;
  }

  addArea(area: THREE.Path): void {
    this.areas.push(area);
    this.createAreaMesh(area);
  }

  private createAreaMesh(area: THREE.Path): void {
    // Create a shape from the path
    const shape = new THREE.Shape(area.getPoints());

    // Create geometry from the shape
    const geometry = new THREE.ShapeGeometry(shape);

    // Create the material
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true,
    });

    // Create a mesh from the geometry and material
    const shapeMesh = new THREE.Mesh(geometry, material);

    // Add the mesh to the scene
    //this.scene.add(shapeMesh);

    // Make it clickable
     AreaClickable.addClickableObject({
      mesh: shapeMesh,
      path: area,
    });
  }

  addSensor(sensor: Sensor): void {
    if (!this.sensors.includes(sensor)) {
      this.sensors.push(sensor);
    }
  }

  addSubFloor(floor: Floor): void {
    this.floors.push(floor);
  }
}

export class FloorBuilder {
  static floors: Floor[] = [];

  static createFloor(id: string, asset: any, scene: THREE.Scene): Floor {
    const floor = new Floor(id, asset, scene);
    FloorBuilder.floors.push(floor);
    return floor;
  }

  static getFloorById(id: string): Floor | undefined {
    return FloorBuilder.floors.find((floor) => floor.id === id);
  }
}
