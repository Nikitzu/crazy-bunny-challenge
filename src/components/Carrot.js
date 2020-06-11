import Vector from "../lib/Vector";
import {Lightning, Utils} from "wpe-lightning-sdk";

export default class Carrot extends Lightning.Component {

    static _template() {
        return {
            src: Utils.asset("assets/level/carrot.png"),
            w: 2, h: 2,
            transitions: {
                alpha: {duration: .6, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'},
                scale: {duration: .6, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'}
            }
        };
    }

    _construct() {
        this._size = new Vector(0.4, 0.4);
    }

    _init() {
        this.basePos = this.pos = this.pos.plus(new Vector(0.2, 0.1));
        this.wobble = Math.random() * Math.PI * 2;
    }

    // plus 0, -0.5
    set pos(v) {
        this._pos = v;
    }

    get pos() {
        return this._pos;
    }

    get atype() {
        return "carrot";
    };

    act(dt) {
        let wobbleSpeed = 8;
        let wobbleDist = 0.1;
        this.wobble += dt * wobbleSpeed;
        let wobblePos = Math.sin(this.wobble) * wobbleDist;
        this.pos = this.basePos.plus(new Vector(0, wobblePos));

        this.x = (this.pos.x) * 75;
        this.y = (this.pos.y - 0.8) * 75;
    }

    onTouch(player) {
        this.patch({
            smooth: {
                scale: [0,{duration:0.4,delay:0}],
                alpha:[0, {duration:0.2, delay:0.3}]
            }
        });
    }
}