import Vector from "../lib/Vector";
import {Lightning, Utils} from "wpe-lightning-sdk";

export default class Jumper extends Lightning.Component {

    static _template() {
        return {
            Bottom:{y:21,
                src: Utils.asset("assets/level/jumper-a.png")
            },
            Top:{ y:10, x:5,
                src: Utils.asset("assets/level/jumper-b.png")
            }
        };
    }

    _construct() {
        this._size = new Vector(0.4, 0.4);
    }

    _init(){
        this._animation = this.tag("Top").animation({
            duration:0.5, actions:[
                {p:'y', v:{0:10, 0.1:-5, 1:10}}
            ]
        });
    }


    // plus 0, -0.5
    set pos(v) {
        this._pos = v;
    }

    get pos() {
        return this._pos;
    }

    get atype() {
        return "jumper";
    };

    act(dt) {

    }

    onTouch(player) {
        this._animation.start();
        player.speed.y = -25;
    }
}