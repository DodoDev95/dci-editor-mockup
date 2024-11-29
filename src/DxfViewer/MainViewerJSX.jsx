import React, { useRef, useEffect } from "react";
import { DxfViewer } from "dxf-viewer";
import * as THREE from "three";
import dxfFloor from "../assets/models/dxf/Izvedeno za DCI 25-11-2024.dxf"; // Adjust the path as needed

const DxfViewerComponent = ({ width, height }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.error("Container element not found!");
      return;
    }

    // Remove the canvas existence check or adjust it as needed
    // if (container.querySelector("canvas")) {
    //   console.log("Canvas already exists in the container. Skipping initialization.");
    //   return;
    // }

    // Declare variables
    if (container.querySelector("canvas")) {
      console.log("Canvas already exists in the container. Skipping initialization.");
      return;
    }
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let camera;
    const clickableObjects = [];

    // Configure viewer options
    const options = {
      clearColor: new THREE.Color("#D3D3D3"),
      colorCorrection: true,
    };

    // Initialize DxfViewer
    const viewer = new DxfViewer(container, options);
    viewerRef.current = viewer;
    viewer.SetSize(container.clientWidth, container.clientHeight);

    // Load DXF file
    viewer
      .Load({
        url: dxfFloor,
        fonts: null,
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
          const progress = totalSize ? (size / totalSize) * 100 : -1;
          console.log(`Progress: ${progress}%`);
        },
        workerFactory: null,
      })
      .then(() => {
        console.log(viewer.GetBounds());
        viewer.SetView(new THREE.Vector3(-9000, 3000, 0), 30000);
        console.log("DXF loaded successfully");

        // Attach event listeners after viewer is ready
        const canvas = container.querySelector("canvas");
        if (canvas) {
          canvas.addEventListener("click", onMouseClick);
          canvas.addEventListener("contextmenu", onContextMenu);
        }

        // Click event handler
        function onMouseClick(event) {
          try {
            if (!camera || clickableObjects.length === 0) return;

            // Calculate mouse position in normalized device coordinates
            const rect = container.getBoundingClientRect();

            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Update raycaster with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Check intersections with clickable objects
            const intersects = raycaster.intersectObjects(clickableObjects);
            console.log("Intersects:", intersects);

            if (intersects.length > 0) {
              console.log("Clicked on:", intersects[0].object);

              const clickedPlane = intersects[0].object;
              if (clickedPlane.visible) {
                clickedPlane.visible = false;
                const position = clickedPlane.position;
                clickableObjects.forEach((obj) => (obj.visible = false));

                viewer.SetView(new THREE.Vector3(position.x, position.y, position.z), 6000);
              }
            }
          } catch (error) {
            console.error("Error in onMouseClick:", error);
          }
        }

        // Right-click event handler
        function onContextMenu(event) {
          event.preventDefault();
          clickableObjects.forEach((obj) => (obj.visible = true));
          viewer.SetView(new THREE.Vector3(-9000, 3000, 0), 30000);
        }

        // Resize event handler
        function onWindowResize() {
          viewer.SetSize(container.clientWidth, container.clientHeight);
          console.log("Viewer resized");
        }

        // Add resize event listener
        window.addEventListener("resize", onWindowResize);

        // Cleanup function
        return () => {
          if (canvas) {
            canvas.removeEventListener("click", onMouseClick);
            canvas.removeEventListener("contextmenu", onContextMenu);
          }
          window.removeEventListener("resize", onWindowResize);

          // Dispose viewer resources if necessary
          if (viewerRef.current && viewerRef.current.Dispose) {
            viewerRef.current.Dispose();
          }
        };
      })
      .catch((err) => {
        console.error("Error loading DXF:", err);
      });

    const scene = viewer.GetScene();
    camera = viewer.GetCamera();

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

        const plane = new THREE.Mesh(geometry, material);
        plane.position.x -= 3000 + i * 8500;
        plane.position.y -= 200 - j * 7000;
        scene.add(plane);

        // Add the plane to clickable objects
        clickableObjects.push(plane);
      }
    }
  }, []); // Empty dependency array to run once on mount

  // Handle width and height changes
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.SetSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    }
  }, [width, height, containerRef.current]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#D3D3D3",
      }}
    />
  );
};

export default DxfViewerComponent;
