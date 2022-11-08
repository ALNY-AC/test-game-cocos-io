import { _decorator, Component, Node, input, Input, Vec2, EventMouse, Vec3, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Control')
export class Control extends Component {

    moveTarget: Vec2;
    speed: number = 500;
    // 声明 Player 属性
    @property({ type: Camera })
    camera: Camera;

    onLoad() {
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }
    onMouseDown(e: EventMouse) {
        this.moveTarget = e.getLocation();

    }
    onMouseMove(e: EventMouse) {
        this.rotationTo(e.getLocation());
    }
    rotationTo(targetVec2: Vec2) {
        let v2 = targetVec2;
        let dx = v2.x - this.node.worldPosition.x;
        let dy = v2.y - this.node.worldPosition.y;
        let angle = Math.atan2(dy, dx);
        let rotation = angle * 180 / Math.PI;
        this.node.setRotationFromEuler(0, 0, rotation);
    }
    moveTo(targetVec2: Vec2, dt: number) {
        // 与目标点的距离
        const speed = this.speed * dt;
        let tx = targetVec2.x; //this.camera.screenToWorld(new Vec3(targetVec2.x, 0, 0)).x;
        let ty = targetVec2.y; //this.camera.screenToWorld(new Vec3(0, targetVec2.y, 0)).y;
        let dx = (tx - this.node.worldPosition.x);
        let dy = (ty - this.node.worldPosition.y);

        let dist = Math.sqrt(dx * dx + dy * dy);
        let targetAngle = Math.atan2(dy, dx);
        // 速度分量
        let vx = Math.cos(targetAngle) * speed;
        let vy = Math.sin(targetAngle) * speed;
        // if(npc.angle>=){}

        if (dist > speed) {
            this.node.setWorldPosition(this.node.worldPosition.x + vx, this.node.worldPosition.y + vy, 1);
        } else {
            this.node.setWorldPosition(tx, ty, 1);
            this.moveTarget = null;
        }
    }
    moveCamera() {
        this.camera.node.setWorldPosition(this.node.getWorldPosition());
    }
    start() {

    }

    update(dt: number) {
        if (this.moveTarget) this.moveTo(this.moveTarget, dt);
        if (this.camera) this.moveCamera();
    }
}
