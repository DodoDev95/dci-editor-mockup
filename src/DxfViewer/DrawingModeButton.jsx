// DrawingModeButton.tsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TURN_ON_DRAWING_MODE } from "@api/canvasActionTypes";

const DrawingModeButton = ({ floorType, parentFloorId }) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const handleClick = () => {
    const floor = {
      id: Object.keys(store.floorState.floors).length + 1,
      parent: store.floorState.currentFloor.id,
      asset: null,
      name: "5",
      sensors: [],
      subFloors: [],
    };
    dispatch({ type: TURN_ON_DRAWING_MODE, payload: { floor } });
  };

  return <button onClick={handleClick}>Start Drawing {floorType === "subfloor" ? "Subfloor" : "Area"}</button>;
};

export default DrawingModeButton;
