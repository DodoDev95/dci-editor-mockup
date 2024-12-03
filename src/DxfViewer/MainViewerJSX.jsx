import React, { useRef, useEffect } from "react";
import { DxfViewer } from "dxf-viewer";
import * as THREE from "three";
import dxfFloor from "../assets/models/dxf/Izvedeno za DCI 25-11-2024.dxf"; // Adjust the path as needed
import { MainViewerUtils } from "./MainViewerUtils";
import AreaClickable from "./AreaClass";

const DxfViewerComponent = ({ width, height }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const ondrop = (e, v) => {
    e.preventDefault();
    renderImage(1920, 1080);

    console.log(e, v);
  };
  //function to render the image from canvas with the given width and height

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.error("Container element not found!");
      return;
    }
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
      alpha: true,
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
      .then(() => {})
      .catch((err) => {
        console.error("Error loading DXF:", err);
      });
    const scene = viewer.GetScene();
    camera = viewer.GetCamera();
    MainViewerUtils.initialize(viewerRef);

    //mainViewerUtils.screenshot(1920, 1080);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        // Create a path to represent the rectangle
        const path = new THREE.Path();
        path.moveTo(-i * 9000 - 4500, +j * 6000 - 3500);
        path.lineTo(-i * 9000 + 4500, +j * 6000 - 3500);
        path.lineTo(-i * 9000 + 4500, +j * 6000 + 3500);
        path.lineTo(-i * 9000 - 4500, +j * 6000 + 3500);
        path.lineTo(-i * 9000 - 4500, +j * 6000 - 3500);

        // Create a shape from the path
        const shape = new THREE.Shape(path.getPoints());

        // Create geometry from the shape
        const geometry = new THREE.ShapeGeometry(shape);

        // Create the material
        const material = new THREE.MeshBasicMaterial({
          color: 0xffff00,
          side: THREE.DoubleSide,
          opacity: 0.5,
          transparent: true,
        });

        // Create a mesh from the geometry and material
        const shapeMesh = new THREE.Mesh(geometry, material);

        // Add the mesh to the scene
        scene.add(shapeMesh);

        // Make it clickable
        AreaClickable.addClickableObject({
          mesh: shapeMesh,
          path: path,
        });
      }
    }
    const canvas = viewer.GetCanvas();
    if (canvas) {
      canvas.addEventListener("click", MainViewerUtils.getClickedMesh);
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
      onDragOver={(e) => e.preventDefault()}
      onDrop={ondrop}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#D3D3D3",
      }}
    />
  );
};

export default DxfViewerComponent;
