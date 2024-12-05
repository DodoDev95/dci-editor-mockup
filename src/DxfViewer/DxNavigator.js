// dxNavigator.js

import { store } from "@store";
import { SET_CURRENT_FLOOR } from "@api/floorActionTypes.ts";
import { MainViewerUtils } from "./MainViewerUtils";
import ClippingManipulation from "./ClippingManipulation";
import AreaClickable from "./AreaClass";
import * as THREE from "three";
//Robine zapamti morat ces clipPlane zakacit da skalira sa zatvaranjem puta
//Ovo ne ucitava clickabilne povrsine in case da dinamicno postoji
export class dxNavigator {
  static navigateTo(floor) {
    store.dispatch({ type: "SET_CURRENT_FLOOR", payload: { currentFloor: floor } });
    if (floor.asset == null) {
      if (floor.parentArea == null) {
        console.log("Floor has no asset");
      }
      const state = store.getState();
      // NAVIGATING WHEN
      const renderer = MainViewerUtils.renderer;
      const camera = MainViewerUtils.camera;
      const scene = MainViewerUtils.scene;
      console.log(AreaClickable.array);
      AreaClickable.clearAreas();
      if (floor.subFloors.length > 0) {
        floor.subFloors.forEach((subFloor) => {
          console.log(
            state.floorState.floors[subFloor].parentArea.mesh,
            state.floorState.floors[subFloor].parentArea.path
          );
          AreaClickable.addClickableObject({
            mesh: state.floorState.floors[subFloor].parentArea.mesh,
            path: state.floorState.floors[subFloor].parentArea.path,
          });
        });
      }
      if (!renderer || !camera || !scene) {
        console.error("Renderer, camera, or scene not found!");
        return null;
      }

      if (MainViewerUtils.viewer && !floor.parentArea && floor.asset == null) {
        //separirati pngeve i dxf ovde
        const bigMesh = ClippingManipulation.CreateClippingPlane(
          MainViewerUtils.viewer.GetBounds(),
          MainViewerUtils.viewer.origin
        );
        const centerPoint = dxNavigator.getCenterPoint(bigMesh);
        const meshSize = dxNavigator.getMeshSize(bigMesh);
        MainViewerUtils.viewer.SetView(centerPoint, meshSize);
      } else {
        //AreaClickable.clearAreas();
        ClippingManipulation.ClippingPlaneClick(floor.parentArea.mesh, floor.parentArea.path);

        // Get the center point of the mesh
        const centerPoint = dxNavigator.getCenterPoint(floor.parentArea.mesh);

        // Get the maximum width of the mesh
        const meshSize = dxNavigator.getMeshSize(floor.parentArea.mesh);

        // Set the view to focus on the mesh
        MainViewerUtils.viewer.SetView(centerPoint, meshSize);
      }
      renderer.render(scene, camera);

      console.log("Floor has no asset");
    } else {
      console.log("Floor has asset");
    }
  }

  static getCenterPoint(mesh) {
    const geometry = mesh.geometry;
    geometry.computeBoundingBox();
    const middle = new THREE.Vector3();
    middle.addVectors(geometry.boundingBox.min, geometry.boundingBox.max).multiplyScalar(0.5);
    mesh.localToWorld(middle);
    return middle;
  }

  static getMeshSize(mesh) {
    const geometry = mesh.geometry;
    geometry.computeBoundingBox();
    const size = new THREE.Vector3();
    size.subVectors(geometry.boundingBox.max, geometry.boundingBox.min);
    const maxSize = Math.max(size.x, size.y, size.z);
    return maxSize;
  }

  // Additional methods...
}
