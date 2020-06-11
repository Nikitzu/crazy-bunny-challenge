import Vector from "../lib/Vector";
import {Lightning, Utils} from "wpe-lightning-sdk";


export default class Lava extends Lightning.Component {

    static _template() {
        return {
            Lava: {
                rect: true, w: 75, h: 75, colorTop: 0xffFFC42A, colorBottom: 0xffFF2F2A, mountY: 1, pivotY: 1, y: 75
            },
            Ground: {
                y: 49,
                src: Utils.asset("assets/level/lava.png")
            }
        };
    }

    _construct() {
        this._size = new Vector(1, 1);
    }

    _init() {
        this._lavaAnimation = this.animation({
            duration: 5, repeat: -1, stopMethod: 'immediate', actions: [
                {t: 'Lava', p: 'colorTop', rv: 0, v: {0: {v: 0xffFFC42A}, .5: {v: 0xffFF2F2A}, 1: {v: 0xffFFC42A}}},
                {t: 'Lava', p: 'colorBottom', rv: 0, v: {0: {v: 0xffFF2F2A}, .5: {v: 0xffFFC42A}, 1: {v: 0xffFF2F2A}}},
                {t: 'Lava', p: 'scaleY', rv: 0, v: {0: {v: 1}, .5: {v: .6}, 1: {v: 1}}}
            ]
        });
        this._lavaAnimation.start();
    }

    set pos(v) {
        this._pos = v;
    }

    get pos() {
        return this._pos;
    }

    get atype() {
        return "lava";
    };

    act(step, level) {

    }

    onTouch(player) {

    }

    static get size() {
        return Lava.prototype.size;
    }
}

Lava.prototype.size = new Vector(1, 1);