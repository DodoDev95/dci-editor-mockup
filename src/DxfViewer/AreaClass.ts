import RBush from "rbush";
import * as THREE from "three";
import { Area } from "@types";

class AreaClickable {
  static array: Area[] = [];

  static addClickableObject(obj: Area) {
    // The object should have mesh and path properties
    AreaClickable.array.push({
      mesh: obj.mesh,
      path: obj.path,
    });
  }

  static getClickedObject(x: number, y: number, camera: THREE.Camera): Area | null {
    // Perform precise intersection test
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(x, y);
    raycaster.setFromCamera(mouse, camera);

    for (const result of AreaClickable.array) {
      const intersects = raycaster.intersectObject(result.mesh, true);
      if (intersects.length > 0) {
        return result;
      }
    }

    return null;
  }
}

export default AreaClickable;