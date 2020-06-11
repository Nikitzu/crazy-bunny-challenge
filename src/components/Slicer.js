import Vector from "../lib/Vector";
import {Lightning, Utils} from "wpe-lightning-sdk";

export default class Slicer extends Lightning.Component {

    static _template() {
        return {
            Slicer: {
                src: Utils.asset("assets/level/slicer-a.png")
            },
            Stick: {
                y: 35, mountX: .5, x: 35,
                src: Utils.asset("assets/level/slicer-b.png")
            }
        };
    }

    _construct() {
        this._size = new Vector(0.4, 0.4);
    }

    // plus 0, -0.5
    set pos(v) {
        this._pos = v;
    }

    get pos() {
        return this._pos;
    }

    get atype() {
        return "slicer";
    };

    act(dt) {
        let sliceSpeed = Math.PI * 2;

        this.tag("Slicer").rotation += sliceSpeed * dt;
    }

    onTouch(player) {

    }
}