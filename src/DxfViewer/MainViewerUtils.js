import * as THREE from "three";
import AreaClickable from "./AreaClass";
import ClippingManipulation from "./ClippingManipulation";

export class MainViewerUtils {
  static viewer = null;
  static camera = null;
  static scene = null;
  static renderer = null;

  static initialize(viewerRef) {
    const viewer = viewerRef.current;
    if (!viewer) {
      console.error("Viewer not found!");
      return null;
    }

    MainViewerUtils.viewer = viewer;
    MainViewerUtils.renderer = viewer.GetRenderer();
    MainViewerUtils.camera = viewer.GetCamera();
    MainViewerUtils.scene = viewer.GetScene();
  }

  static getClickedMesh(event) {
    const renderer = MainViewerUtils.renderer;
    const camera = MainViewerUtils.camera;
    const scene = MainViewerUtils.scene;
    if (!renderer || !camera || !scene) {
      console.error("Renderer, camera, or scene not found!");
      return null;
    }

    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(x, y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const clickedObject = AreaClickable.getClickedObject(x, y, camera);

    if (clickedObject) {
      ClippingManipulation.CreateClippingPlane(MainViewerUtils.viewer.GetBounds(), MainViewerUtils.viewer.origin);
      ClippingManipulation.ClippingPlaneClick(clickedObject.mesh, clickedObject.path);
    }

    return clickedObject;
  }
}
