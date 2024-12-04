import React, { useRef, useEffect } from "react";
import { DxfViewer } from "dxf-viewer";
import * as THREE from "three";
import dxfFloor from "../assets/models/dxf/Izvedeno za DCI 25-11-2024.dxf";
import { MainViewerUtils } from "./MainViewerUtils";
import AreaClickable from "./AreaClass";
import ClippingManipulation from "./ClippingManipulation";
import { FloorBuilder } from "./FloorClass"; // Import FloorBuilder

const DxfViewerComponent = ({ width, height }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.error("Container element not found!");
      return;
    }

    if (container.querySelector("canvas")) {
      console.log("Canvas already exists in the container. Skipping initialization.");
      return;
    }

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
      .then(() => {
        // Initialize MainViewerUtils
        MainViewerUtils.initialize(viewerRef);

        const scene = viewer.GetScene();

        // Create the first floor through FloorBuilder
        const floor = FloorBuilder.createFloor("floor-1", null, scene);

        // Add areas to the floor
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 2; j++) {
            // Create a path to represent the rectangle
            const path = new THREE.Path();
            path.moveTo(-i * 9000 - 4500, +j * 6000 - 3500);
            path.lineTo(-i * 9000 + 4500, +j * 6000 - 3500);
            path.lineTo(-i * 9000 + 4500, +j * 6000 + 3500);
            path.lineTo(-i * 9000 - 4500, +j * 6000 + 3500);
            path.lineTo(-i * 9000 - 4500, +j * 6000 - 3500);

            // Add the area to the floor
            floor.addArea(path);
          }
        }

        // Create Clipping Plane after floor and areas are set up
        ClippingManipulation.CreateClippingPlane(viewer.GetBounds(), viewer.origin);
      })
      .catch((err) => {
        console.error("Error loading DXF:", err);
      });

    const canvas = viewer.GetCanvas();
    if (canvas) {
      canvas.addEventListener("mousedown", (e) => {
        console.log("drag");
        e.preventDefault();
        e.stopPropagation();
      });
      canvas.addEventListener("dragend", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("dragend");
      });
      canvas.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      canvas.addEventListener("dragenter", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      canvas.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("drop", FloorBuilder);
        MainViewerUtils.droppedZone(e);
      });
      canvas.addEventListener("click", MainViewerUtils.getClickedMesh);
    }
  }, []); // Empty dependency array to run once on mount

  // Handle width and height changes
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.SetSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    }
  }, [width, height]);

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
