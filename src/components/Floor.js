import {Lightning, Utils} from "wpe-lightning-sdk";
import Vector from "../lib/Vector";

export default class Floor extends Lightning.Component {
    static _template() {
        return {
            zIndex: 2
        };
    }

    _init() {
        const index = Math.floor((Math.random() * 4) + 1);
        this.src = Utils.asset(`assets/level/floor-${index}.png`);
    }

    set pos(v) {
        this.pos = v;
    }

    get pos() {
        return this.pos;
    }

    static get size() {
        return Floor.prototype.size;
    }
}

Floor.prototype.size = new Vector(1, 1);