// dxNavigator.js
import { ViewerBase } from "./ViewerBase";

export class dxNavigator extends ViewerBase {
  constructor(viewerRef) {
    super(viewerRef);
  }

  navigateTo(position) {
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.lookAt(this.scene.position);
  }

  // Additional methods...
}
