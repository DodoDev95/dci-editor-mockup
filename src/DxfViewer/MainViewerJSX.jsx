// DxfViewerComponent.tsx (modified)

import React, { useRef, useEffect } from "react";
import { DxfViewer } from "dxf-viewer";
import * as THREE from "three";
import dxfFloor from "../assets/models/dxf/Izvedeno za DCI 25-11-2024.dxf";
import { MainViewerUtils } from "./MainViewerUtils";
import AreaClickable from "./AreaClass";
import ClippingManipulation from "./ClippingManipulation";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_FLOOR, ADD_AREA, SET_CURRENT_FLOOR } from "@types";
import { store } from "@store";
import DrawingModeButton from "./DrawingModeButton";
import { TURN_ON_DRAWING_MODE } from "@api/canvasActionTypes";
import { dxNavigator } from "./DxNavigator";

const DxfViewerComponent = ({ width, height }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const dispatch = useDispatch();
  const floorState = useSelector((state) => state.floorState);
  const canvasState = useSelector((state) => state.canvasState);

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

        // Dispatch action to create the floor
        const floorId = "floor-1";
        const floor = {
          id: 1,
          name: "Floor 1",
          asset: null,
          sensors: [],
          parentArea: null,
          subFloors: [],
        };
        dispatch({ type: CREATE_FLOOR, payload: { floor } });
        dispatch({ type: SET_CURRENT_FLOOR, payload: { currentFloor: floor } });

        // Create Clipping Plane after floor and areas are set up
        ClippingManipulation.CreateClippingPlane(viewer.GetBounds(), viewer.origin);
      })
      .catch((err) => {
        console.error("Error loading DXF:", err);
      });

    const canvas = viewer.GetCanvas();
    if (canvas) {
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

        MainViewerUtils.droppedZone(e, dispatch, floorState);
      });
      let mouseDownTime = 0;

      canvas.addEventListener("pointerdown", (e) => {
        mouseDownTime = Date.now();
      });
      canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const state = store.getState();
        if (!state.canvasState.isDrawingModeOn && state.floorState.currentFloor.parent) {
          dxNavigator.navigateTo(state.floorState.floors[state.floorState.currentFloor.parent]);
        }
      });

      canvas.addEventListener("pointerup", (e) => {
        const mouseUpTime = Date.now();
        const timeDifference = mouseUpTime - mouseDownTime;
        if (timeDifference < 100) {
          const state = store.getState();
          MainViewerUtils.getClickedMesh(e, state, store.dispatch);
        }
      });
    }
  }, []); // Empty dependency array to run once on mount

  // Handle width and height changes
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.SetSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    }
  }, [width, height]);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#D3D3D3",
        }}
      />
      <DrawingModeButton />
    </>
  );
};

export default DxfViewerComponent;
