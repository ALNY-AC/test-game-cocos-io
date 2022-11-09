import { _decorator, Component, Node, input, Input, Vec2, EventMouse, Vec3, Camera, CCInteger, PhysicsSystem2D, EPhysics2DDrawFlags, find, } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Control')
export class Control extends Component {

    moveTarget: Vec2;

    @property({ type: CCInteger, displayName: '移动速度' })
    speed: number = 100;

    @property({ type: CCInteger, displayName: '相机深度' })
    cameraZ = 100;

    camera: Camera;

    // 准星
    @property({ type: Node, displayName: '准星' })
    sightBead: Node;


    dt: number = 0;

    onLoad() {
        this.camera = find("Canvas/Camera").getComponent(Camera);
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }
    onMouseWheel(e: EventMouse) {
        this.cameraZ += -e.getScrollY() * this.dt;
        if (this.cameraZ <= 30) this.cameraZ = 30;
        if (this.cameraZ >= 300) this.cameraZ = 300;
    }
    onMouseDown(e: EventMouse) {
        if (e.getButton() == EventMouse.BUTTON_LEFT) {
            this.moveTarget = this.mouseLocationToWordLocation(e.getLocation());
        }
    }
    mouseLocationToWordLocation(mouseLocation: Vec2): Vec2 {
        let v3 = new Vec3(mouseLocation.x, mouseLocation.y, 0);
        let word = this.camera.screenToWorld(v3);
        let v2 = new Vec2(word.x, word.y);
        return v2;
    }
    onMouseMove(e: EventMouse) {
        this.rotationTo(this.mouseLocationToWordLocation(e.getLocation()));
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
            this.node.setWorldPosition(this.node.worldPosition.x + vx, this.node.worldPosition.y + vy, 0);
        } else {
            this.node.setWorldPosition(tx, ty, 0);
            this.moveTarget = null;
        }
    }
    moveCamera() {
        // let v3 = this.node.getWorldPosition();
        // v3.z
        this.camera.node.setWorldPosition(this.node.getWorldPosition());
        this.camera.orthoHeight = this.cameraZ;
    }
    start() {

    }

    update(dt: number) {
        this.dt = dt;
        if (this.moveTarget) this.moveTo(this.moveTarget, dt);
        if (this.camera) this.moveCamera();

        if (this.moveTarget) this.sightBead.setWorldPosition(this.moveTarget.x, this.moveTarget.y, 0);

        this.sightBead.active = !!this.moveTarget;
    }
}
