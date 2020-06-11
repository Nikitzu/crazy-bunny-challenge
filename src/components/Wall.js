import {Lightning, Utils} from "wpe-lightning-sdk";
import Vector from "../lib/Vector";

export default class Wall extends Lightning.Component {
    static _template() {
        return {rect:true};
    }

    _init() {
        const index = Math.floor((Math.random() * 2) + 1);
        this.src = Utils.asset(`assets/level/wall-${index}.png`);
    }

    set pos(v) {
        this._pos = v;
    }

    get pos() {
        return this._pos;
    }

    static get size() {
        return Wall.prototype.size;
    }
}

Wall.prototype.size = new Vector(1, 1);