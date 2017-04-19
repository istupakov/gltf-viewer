import { quat, vec3, mat4 } from 'gl-matrix';

export class Trackball implements EventListenerObject {
    element: HTMLElement;
    previousPositon: vec3;
    capture: boolean = false;
    lastX: number;
    lastY: number;

    scale: number = 1;
    rotation: quat = quat.create();

    attach(canvas: HTMLElement) {
        this.element = canvas;

        canvas.addEventListener('mousedown', this);
        canvas.addEventListener('wheel', this);
        document.addEventListener('mousemove', this);
        document.addEventListener('mouseup', this);
    }

    detach(canvas: HTMLElement) {
        canvas.removeEventListener('mousedown', this);
        canvas.removeEventListener('wheel', this);
        document.removeEventListener('mousemove', this);
        document.removeEventListener('mouseup', this);
    }

    rotate(position: vec3) {
        let rot = quat.rotationTo(quat.create(), this.previousPositon, position);
        quat.mul(this.rotation, rot, this.rotation);
    }

    handleEvent(event: Event) {
        if (event instanceof MouseEvent) {
            let target = event.target as HTMLElement;
            if (event.type == 'mousedown') {
                this.capture = true;
                this.lastX = event.offsetX;
                this.lastY = event.offsetY;
                this.previousPositon = this.projectToTrackball();
            } else if (event.type == 'mouseup') {
                this.capture = false;
                //console.log('rotation: ', this.rotation);
            } else if (event.type == 'mousemove' && this.capture) {
                this.lastX += event.movementX;
                this.lastY += event.movementY;
                let position = this.projectToTrackball();
                this.rotate(position);
                this.previousPositon = position;
            }
        }
        if (event instanceof WheelEvent) {
            //console.log(event);
            event.stopPropagation();
            this.scale *= event.deltaY > 0 ? 1.1 : 1 / 1.1;
        }
    }

    projectToTrackball() {
        // Scale so bounds map to [-1,-1] - [+1,+1]
        let x = 2 * this.lastX / this.element.clientWidth - 1;
        let y = 1 - 2 * this.lastY / this.element.clientHeight;

        let z2 = 1 - x * x - y * y;
        let z = z2 > 0 ? Math.sqrt(z2) : 0;

        return vec3.normalize(vec3.create(), [x, y, z]);
    }

    getViewMatrix(view: mat4) {
        let mat = view;//mat4.lookAt(mat4.create(), [1500, 1400, 1800], [0, 0, 0], [0, 1, 0]);;
        let scaleMatrix = mat4.fromScaling(mat4.create(), [this.scale, this.scale, this.scale]);
        let rotateMatrix = mat4.fromQuat(mat4.create(), this.rotation);
        return mat4.mul(mat, mat, mat4.mul(scaleMatrix, scaleMatrix, rotateMatrix));
    }
}