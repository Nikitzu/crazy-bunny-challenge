import Vector from "../lib/Vector";
import {Lightning, Utils} from "wpe-lightning-sdk";

export default class Mole extends Lightning.Component {

    static _template() {
        return {
            Mole: {
                x: 20,
                src: Utils.asset("assets/level/mole-b.png"),
                ArmLeft: {
                    src: Utils.asset("assets/level/mole-c.png"),
                    rotation: Math.PI * -.5, y: 15,
                    mountY: .9, pivotY: .9, scaleX: -1
                },
                ArmRight: {
                    src: Utils.asset("assets/level/mole-c.png"),
                    rotation: Math.PI * .5, x: 30, y: 15,
                    mountY: .9, pivotY: .9
                },
                LegLeft: {
                    y: 43, x: -5,
                    src: Utils.asset("assets/level/mole-d.png"),
                },
                LegRight: {
                    y: 43, x: 30, scaleX: -1,
                    src: Utils.asset("assets/level/mole-d.png"),
                }
            },
            Overlay: {
                y: 60, x: 5,
                src: Utils.asset("assets/level/mole-a.png")
            }
        };
    }

    _construct() {
        this._size = new Vector(0.4, 0.4);
    }

    _init() {
        this._moleAnimation = this.animation({
            duration: .2, repeat: -1, stopMethod: 'immediate', actions: [
                {t: 'ArmLeft', p: 'rotation', v: {0: {v: Math.PI * -.2}, .5: {v: Math.PI * -.7}, 1: {v: Math.PI * -.2}}},
                {t: 'ArmRight', p: 'rotation', v: {0: {v: Math.PI * .2}, .5: {v: Math.PI * .7}, 1: {v: Math.PI * .2}}}
            ]
        });
        this._jumpPos = Math.random() * Math.PI * 2
        this._offset = 0;
        this._prevPos = 0;
    }

    _active() {
        this._moleAnimation.start();
    }

    _inactive() {
        this._moleAnimation.stop();
    }

    // plus 0, -0.5
    set pos(v) {
        this._pos = v;
    }

    get pos() {
        return this._pos;
    }

    get atype() {
        return "mole";
    };

    act(dt) {
        const jumpSpeed = 2.5;
        const jumpDistance = 200;
        this._jumpPos += dt * jumpSpeed;

        const molePos = Math.sin(this._jumpPos) * jumpDistance;

        this.tag("Mole").patch({
            y: molePos + 50, scaleY: molePos > this._prevPos?-1:1
        })

        this.visible = !!(molePos < 0);
        this._prevPos = molePos;
    }

    onTouch(player) {

    }
}