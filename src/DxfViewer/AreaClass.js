import RBush from "rbush";
import * as THREE from "three";

class AreaClickable {
  static array = new Array();

  static addClickableObject(obj) {
    // The object should have minX, minY, maxX, maxY properties and a mesh
    AreaClickable.array.push({
      mesh: obj.mesh,
      path: obj.path,
    });
  }

  static getClickedObject(x, y, camera) {
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
