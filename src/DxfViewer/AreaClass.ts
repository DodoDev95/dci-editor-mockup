import RBush from "rbush";
import * as THREE from "three";
import { Area } from "@types";
import {MainViewerUtils} from "./MainViewerUtils";
import { FloorBuilder } from "./FloorClass";
//import { turnOffDrawingMode } from "@api/canvasReducer";
import { store} from "@api/store";

class AreaClickable {
  static array: Area[] = [];
  static AreaBuffer: THREE.Vector3[] = []; // Static array to store clicked points
  static lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Material for the lines
  static shapeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    opacity: 0.5,
    transparent: true,
  }); // Material for the filled shape
  static linesGroup = new THREE.Group(); // Group to hold lines
  static isDrawing = false; // Flag to indicate if drawing is in progress

  /**
   * Initialize the AreaClickable class with a reference to the scene.
   * Call this method before using drawLine.
   * @param {THREE.Scene} scene - The Three.js scene.
   */
  static initialize(scene: THREE.Scene) {
    AreaClickable.scene = scene;
    // Add the linesGroup to the scene
    AreaClickable.scene.add(AreaClickable.linesGroup);
  }
  static clearAreas() {
    AreaClickable.array.forEach((area) => {
      MainViewerUtils.scene.remove(area.mesh);
    }, MainViewerUtils.scene);
    AreaClickable.array = [];
  }

  static addClickableObject(obj: Area) {
    // The object should have mesh and path properties
    AreaClickable.array.push({
      mesh: obj.mesh,
      path: obj.path,
    });
    const { scene, renderer,camera } = MainViewerUtils;
    if (!scene) {
      console.error("AreaClickable: Scene is not initialized.");
      return;
    }
    scene.add(obj.mesh);
    
  }
  static getCurrentFloorAreas(): Area[] {
    const curStore=store.getState();
    const floor = curStore.floorState.currentFloor;
    const selectedFloor=curStore.floorState.floors[floor.id];
    console.log(selectedFloor);
    const updatedSubfloors = selectedFloor.subFloors.map(subfloor => {
      if (curStore.floorState.floors[subfloor].parentArea) {
        return {area:curStore.floorState.floors[subfloor].parentArea,id:subfloor};
      }

    });
    return updatedSubfloors;


  }
  static getClickedObject(
    x: number,
    y: number,
    camera: THREE.Camera
  ): Area | null {
    // Perform precise intersection test
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(x, y);
    raycaster.setFromCamera(mouse, camera);

    for (const result of AreaClickable.getCurrentFloorAreas()) {
      const intersects = raycaster.intersectObject(result.area.mesh, true);
      if (intersects.length > 0) {
        console.log("Clicked object:", result);
        return result;
      }
    }

    return null;
  }

  /**
   * Handles drawing lines based on user clicks.
   * @param {MouseEvent} event - The mouse event from the click.
   * @param {THREE.WebGLRenderer} renderer - The Three.js renderer.
   * @param {THREE.Camera} camera - The camera used in the scene.
   */
  static drawLine(
    event: MouseEvent,
  ) {
    const { scene, renderer,camera } = MainViewerUtils;
    if (!scene) {
      console.error("AreaClickable: Scene is not initialized.");
      return;
    }

    // Get mouse position in normalized device coordinates (-1 to +1)
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Create a raycaster and set it from the camera and mouse position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    // Intersect with the plane at z = 0
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, intersectionPoint);

    // If this is the first point, start drawing
    if (!AreaClickable.isDrawing) {
      AreaClickable.isDrawing = true;
      AreaClickable.AreaBuffer = []; // Reset the buffer
      AreaClickable.linesGroup.clear(); // Remove previous lines
    }

    // Add the point to AreaBuffer
    AreaClickable.AreaBuffer.push(intersectionPoint.clone());

    // If there's more than one point, draw a line between the last two points
    if (AreaClickable.AreaBuffer.length > 1) {
      const points = [
        AreaClickable.AreaBuffer[AreaClickable.AreaBuffer.length - 2],
        AreaClickable.AreaBuffer[AreaClickable.AreaBuffer.length - 1],
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, AreaClickable.lineMaterial);

      // Add the line to the linesGroup
      AreaClickable.linesGroup.add(line);
    }

    // Check if the current point is close to the first point to close the path
    if (AreaClickable.AreaBuffer.length > 2) {
      const firstPoint = AreaClickable.AreaBuffer[0];
      const lastPoint =
        AreaClickable.AreaBuffer[AreaClickable.AreaBuffer.length - 1];
      const distance = firstPoint.distanceTo(lastPoint);

      if (distance < 80.5) {
        console.log("Closing the shape.");
        // Remove the last point (close to the first point)
        AreaClickable.AreaBuffer.pop();

        // Close the path and create a shape
        const shapePoints = AreaClickable.AreaBuffer.map((vec) =>
          new THREE.Vector2(vec.x, vec.y)
        );
        const shape = new THREE.Shape(shapePoints);

        // Create geometry and mesh
        const geometry = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geometry, AreaClickable.shapeMaterial);
        

        // Add the mesh to the scene
        scene.add(mesh);

        // Optionally, add the shape to AreaClickable.array if you want it to be clickable
        AreaClickable.addClickableObject({
          mesh: mesh,
          path: shape,
        });

        // Clear the drawing state
        AreaClickable.isDrawing = false;
        AreaClickable.AreaBuffer = [];
        AreaClickable.linesGroup.clear();

        console.log("Shape closed and filled.");
        //store.dispatch(turnOffDrawingMode());
        scene.add(AreaClickable.linesGroup);
        renderer.render(scene, camera);
        return { mesh, path: shape };
        

      }
      scene.add(AreaClickable.linesGroup);
      renderer.render(scene, camera);
    }
  }
}

export default AreaClickable;
