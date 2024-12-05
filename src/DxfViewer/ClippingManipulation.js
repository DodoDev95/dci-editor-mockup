import { MainViewerUtils } from "./MainViewerUtils";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
class ClippingManipulation {
  static clippingPlane = null;
  static CreateClippingPlane(Bounds, origin) {
    const { scene, renderer } = MainViewerUtils;
    //rotate the camera so that i can see depth

    if (!scene || !renderer) {
      console.error("Scene or renderer is not initialized!");
      return;
    }
    ClippingManipulation.ViewerBounds = Bounds;
    console.log(Bounds);
    const { minX, maxX, minY, maxY } = Bounds;
    console.log(Bounds);
    const center = new THREE.Vector3((minX + maxX) / 2, (minY + maxY) / 2, 0);
    const planeWidth = maxX - minX;
    const planeHeight = maxY - minY;
    const holeRadius = Math.min(planeWidth, planeHeight) / 2;
    if (ClippingManipulation.clippingPlane) {
      scene.remove(ClippingManipulation.clippingPlane);
    }

    const shape = new THREE.Shape();
    shape.moveTo(minX, minY);
    shape.lineTo(maxX, minY);
    shape.lineTo(maxX, maxY);
    shape.lineTo(minX, maxY);
    shape.lineTo(minX, minY);
    shape.closePath();
    //add a hole

    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      opacity: 0.4,
      transparent: true,
    });
    const planeGeometry = new THREE.ShapeGeometry(shape);
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.setX(-origin.x);
    planeMesh.position.setY(-origin.y);
    ClippingManipulation.clippingPlane = planeMesh;
    ClippingManipulation.clippingPlane.shape = shape;
    ClippingManipulation.ViewerBounds = Bounds;
    ClippingManipulation.origin = origin;
    return planeMesh;
  }

  static ClippingPlaneClick(clickedMesh, clickedPath) {
    const { scene, renderer } = MainViewerUtils;

    if (!scene || !renderer) {
      console.error("Scene or renderer is not initialized!");
      return;
    }

    // Ensure that ViewerBounds and origin are available
    const Bounds = ClippingManipulation.ViewerBounds;
    const origin = ClippingManipulation.origin;

    if (!Bounds || !origin) {
      console.error("ViewerBounds or origin is not set!");
      return;
    }

    const { minX, maxX, minY, maxY } = Bounds;

    // Remove the existing clipping plane from the scene
    if (ClippingManipulation.clippingPlane) {
      scene.remove(ClippingManipulation.clippingPlane);
      ClippingManipulation.clippingPlane.geometry.dispose();
      ClippingManipulation.clippingPlane.material.dispose();
      ClippingManipulation.clippingPlane = null;
    }

    // Define a small non-zero depth for CSG operations
    const planeDepth = 0.01; // Adjust as needed

    // Create the clipping plane mesh as a solid box
    const planeWidth = maxX + 100 - minX + 100;
    const planeHeight = maxY + 100 - minY + 100;
    const planeGeometry = new THREE.BoxGeometry(planeWidth, planeHeight, planeDepth);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      opacity: 1.0,
      transparent: true,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set((minX + maxX) / 2 - origin.x, (minY + maxY) / 2 - origin.y, -0.0);

    // Create a Shape from clickedPath
    const holeShape = new THREE.Shape(clickedPath.getPoints());

    // Create extrude settings with non-zero depth
    const extrudeSettings = {
      depth: planeDepth,
      bevelEnabled: false,
    };

    // Create the extruded hole geometry
    const holeGeometry = new THREE.ExtrudeGeometry(holeShape, extrudeSettings);
    const holeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide,
      opacity: 1.0,
      transparent: true,
    });
    const holeMesh = new THREE.Mesh(holeGeometry, holeMaterial);

    // Position the holeMesh to align with the planeMesh
    holeMesh.position.z = planeMesh.position.z - planeDepth / 2;

    // Update matrices before CSG operation
    planeMesh.updateMatrix();
    holeMesh.updateMatrix();

    // Perform the CSG subtraction: subtract holeMesh from planeMesh
    const subtractedMesh = CSG.subtract(planeMesh, holeMesh);

    // Apply material to the subtracted mesh
    subtractedMesh.material = new THREE.MeshBasicMaterial({
      color: 0xd3d3d3,
      opacity: 1.0,
      transparent: true,
    });

    // Update the clippingPlane reference
    ClippingManipulation.clippingPlane = subtractedMesh;

    // Add the new clipping plane to the scene
    scene.add(subtractedMesh);
    renderer.render(scene, MainViewerUtils.camera);
  }
  droppedZone(event) {
    const droppedZone = ClippingManipulation.clippingPlane;
    const { scene, renderer } = MainViewerUtils;
    //make a red circle with radius 200 here
  }
}
export default ClippingManipulation;
