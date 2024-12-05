import * as THREE from "three";
import AreaClickable from "./AreaClass";
import ClippingManipulation from "./ClippingManipulation";
import { setCurrentFloor } from "@api/floorActionTypes";
import { TURN_OFF_DRAWING_MODE } from "@api/canvasActionTypes";
import { store } from "@store";
import { addSubFloor, createFloor } from "@api/floorActionTypes";
import { dxNavigator } from "./DxNavigator";
import { DxfViewer } from "dxf-viewer";



export class MainViewerUtils {
  static viewer: DxfViewer | null = null;
  static camera: THREE.Camera | null = null;
  static scene: THREE.Scene | null = null;
  static renderer: THREE.WebGLRenderer | null = null;

  static initialize(viewerRef: any) {
    const viewer = viewerRef.current as Viewer;
    if (!viewer) {
      console.error("Viewer not found!");
      return null;
    }

    MainViewerUtils.viewer = viewer;
    MainViewerUtils.renderer = viewer.GetRenderer();
    MainViewerUtils.camera = viewer.GetCamera();
    MainViewerUtils.scene = viewer.GetScene();
  }

  static getClickedMesh(event: any, state: any, dispatch: any) {

console.log(state)
    if (state.canvasState.isDrawingMode) {
      const temp = AreaClickable.drawLine(event);
      console.log("dsadplpsda", temp);
      if (temp) {
        const floor = { ...state.canvasState.floor, parentArea: temp };

        dispatch({ type: TURN_OFF_DRAWING_MODE, payload: { floor } });
        dispatch(addSubFloor(0, floor));
        dispatch(createFloor(floor));

        return temp;
      }
      return null;
    }
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
      dxNavigator.navigateTo(state.floorState.floors[clickedObject.id]);
    }

    return clickedObject;
  }

  static droppedZone(event: any, dispatch: any, floorState: any) {
    event.preventDefault();
    event.stopPropagation();

    const { scene, renderer, camera } = MainViewerUtils;

    if (!renderer || !camera || !scene) {
      console.error("Renderer, camera, or scene not found!");
      return;
    }

    // Get mouse position in normalized device coordinates (-1 to +1)
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(x, y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Intersect with clickable objects (areas)
    const intersects = raycaster.intersectObjects(
      AreaClickable.array.map((item: any) => item.mesh),
      true
    );

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const clickedMesh = intersect.object;

      // Find the area that was clicked
      const clickableObject = AreaClickable.array.find((item: any) => item.mesh === clickedMesh);
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