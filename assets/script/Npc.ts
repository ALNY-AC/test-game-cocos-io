import { _decorator, Component, Node, find } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Npc')
export class Npc extends Component {

    target: Node;

    onLoad() {
        this.target = find("Canvas/player");
    }
    start() {

    }
    rotationTo() {
        let v2 = this.target.getWorldPosition();
        let dx = v2.x - this.node.worldPosition.x;
        let dy = v2.y - this.node.worldPosition.y;
        let angle = Math.atan2(dy, dx);
        let rotation = angle * 180 / Math.PI;
        this.node.setRotationFromEuler(0, 0, rotation);
    }
    update(deltaTime: number) {
        if (this.target) this.rotationTo();
    }
}


