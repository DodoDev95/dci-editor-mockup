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
    console.log(x, y);

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
  static droppedZone(event) {
    // Prevent the default behavior (Prevent the browser from handling the drop)
    event.preventDefault();

    const droppedZone = ClippingManipulation.clippingPlane;
    const { scene, renderer, camera } = MainViewerUtils;

    // Get mouse position in normalized device coordinates (-1 to +1)
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    console.log(event);

    const mouse = new THREE.Vector2(x, y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Intersect with the clipping plane
    MainViewerUtils.renderer.render(scene, camera);
    const intersects = raycaster.intersectObject(droppedZone, true);
    console.log(droppedZone);

    if (intersects.length > 0) {
      // Get the intersection point
      const point = intersects[0].point;

      // Create a red circle geometry
      const circleRadius = 300; // Radius of the circle
      const circleSegments = 32; // Number of segments to make it smooth
      const circleGeometry = new THREE.CircleGeometry(circleRadius, circleSegments);

      // Create a material for the circle
      const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Red color
        side: THREE.DoubleSide, // Make it visible from both sides
      });

      // Create the mesh
      const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);

      // Position the circle at the intersection point
      circleMesh.position.copy(point);

      // Align the circle to the clipping plane's orientation
      circleMesh.lookAt(circleMesh.position.clone().add(droppedZone.getWorldDirection(new THREE.Vector3())));

      // Add the circle to the scene
      scene.add(circleMesh);
      MainViewerUtils.renderer.render(scene, camera);
    } else {
      console.log("No intersection with the clipping plane.");
    }
  }
}
