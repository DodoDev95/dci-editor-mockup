// Import necessary modules
import { DxfViewer } from "dxf-viewer";
import * as THREE from "three";
import dxfFloor from "../assets/models/dxf/Izvedeno za DCI 25-11-2024.dxf"; // Adjust the path as needed

// Create container for viewer
const container = document.getElementById("MainDxfViewerContainerDntDuplicate");
console.log("DASDMOASDMOASDOMASDMOADS");
if (!container) {
  console.error("Container element not found!");
} else {
  // Declare variables to be accessible in the click handler
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  let plane;
  let camera;
  const clickableObjects = []; // Array of objects that can be clicked

  // Configure viewer options
  const options = {
    clearColor: new THREE.Color("#555555"),
    colorCorrection: true,
  };

  // Initialize DxfViewer
  const viewer = new DxfViewer(container, options);
  viewer.SetSize(container.clientWidth, container.clientHeight);

  // Load DXF file with the required parameters
  viewer
    .Load({
      url: dxfFloor,
      fonts: null, // Specify fonts if needed
      progressCbk: (phase, size, totalSize) => {
        let progressText = "";
        switch (phase) {
          case "font":
            progressText = "Fetching fonts...";
            break;
          case "fetch":
            progressText = "Fetching file...";
            break;
          case "parse":
            progressText = "Parsing file...";
            break;
          case "prepare":
            progressText = "Preparing rendering data...";
            break;
          default:
            progressText = "Unknown phase...";
        }
        console.log(progressText);
        let progress = totalSize ? (size / totalSize) * 100 : -1;
        console.log(`Progress: ${progress}%`);
      },
      workerFactory: null, // Provide a worker factory if required
    })
    .then(() => {
      console.log(viewer.GetBounds());
      viewer.SetView(new THREE.Vector3(-9000, 3000, 0), 30000); // Corrected syntax
      console.log("DXF loaded successfully");
    })
    .catch((err) => {
      console.error("Error loading DXF:", err);
    });

  const scene = viewer.GetScene();
  camera = viewer.GetCamera(); // Get the camera from the viewer
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      // Add yellow rectangle (plane) to the scene
      const geometry = new THREE.PlaneGeometry(6000, 6000);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true,
      });

      plane = new THREE.Mesh(geometry, material);
      plane.position.x -= 3000 + i * 8500;
      plane.position.y -= 200 - j * 7000;
      scene.add(plane);

      // Add the plane to clickable objects
      clickableObjects.push(plane);
    }
  }
  // Click event handler
  const onMouseClick = (event) => {
    if (!camera || clickableObjects.length === 0) return;

    // Calculate mouse position in normalized device coordinates
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check intersections with clickable objects
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
      console.log("Clicked on:", intersects[0].object);

      if (plane.visible) {
        plane.visible = false;
        const position = intersects[0].object.position;
        clickableObjects.forEach((obj) => (obj.visible = false));

        viewer.SetView(new THREE.Vector3(position.x, position.y, position.z), 6000); // Correctounding box:", boundingbox);
      }
    }
  };

  // Add event listener for mouse clicks
  container.addEventListener("click", onMouseClick, false);

  //add event listener for right click
  container.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    clickableObjects.forEach((obj) => (obj.visible = true));
    viewer.SetView(new THREE.Vector3(-9000, 3000, 0), 30000); // Corrected syntax
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    viewer.SetSize(container.clientWidth, container.clientHeight);
    console.log("Viewer resized");
  });
}
