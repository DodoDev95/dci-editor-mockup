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
  static droppedZone(event, dispatch, floorState) {
    event.preventDefault();
    event.stopPropagation();

    const { scene, renderer, camera } = MainViewerUtils;

    // Get mouse position in normalized device coordinates (-1 to +1)
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(x, y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Intersect with clickable objects (areas)
    const intersects = raycaster.intersectObjects(
      AreaClickable.array.map((item) => item.mesh),
      true
    );

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const clickedMesh = intersect.object;

      // Find the area that was clicked
      const clickableObject = AreaClickable.array.find((item) => item.mesh === clickedMesh);
      if (clickableObject) {
        const areaId = clickableObject.areaId;
        const area = floorState.areas[areaId];
        const floorId = area.floorId;

        // Get the intersection point
        const point = intersect.point;

        // Create a new sensor at the drop location
        const sensorId = `sensor-${Date.now()}`;
        const sensor = {
          id: sensorId,
          x: point.x,
          y: point.y,
          label: "Dropped Sensor",
          floorId: floorId,
        };

        // Dispatch action to add the sensor
        dispatch({ type: ADD_SENSOR, payload: { sensor } });

        // Optionally, add visual representation of the sensor
        const sensorGeometry = new THREE.SphereGeometry(100, 16, 16);
        const sensorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const sensorMesh = new THREE.Mesh(sensorGeometry, sensorMaterial);
        sensorMesh.position.copy(point);
        scene.add(sensorMesh);

        console.log(`Sensor ${sensorId} added at (${point.x}, ${point.y})`);
      }
    } else {
      console.log("No intersection with areas.");
    }
  }
}
