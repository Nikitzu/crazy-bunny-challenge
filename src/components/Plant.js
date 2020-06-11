import {Lightning, Utils} from "wpe-lightning-sdk";
import Vector from "../lib/Vector";

export default class Plant extends Lightning.Component {
    static _template() {
        return {
        };
    }

    _init() {
        const index = Math.floor((Math.random() * 3) + 1);
        this.src = Utils.asset(`assets/level/plant-${index}.png`);
    }

    set pos(v) {
        this._pos = v;
    }

    get pos() {
        return this._pos;
    }

    static get size() {
        return Plant.prototype.size;
    }
}

Plant.prototype.size = new Vector(1, 1);