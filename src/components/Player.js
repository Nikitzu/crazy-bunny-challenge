import Vector from "../lib/Vector";
import {Lightning, Utils} from "wpe-lightning-sdk";

export default class Player extends Lightning.Component {

    static _template() {
        return {

            Bunny: {
                w: 75, h: 75, pivotY: .5, rect: true, color: 0xff000000,

                /**
                 * @todo:
                 * uncomment body and follow pattern to create
                 * and follow the pattern to create the rest
                 * of the bunny's body
                 *
                 * Also, create the craziest bunny and win
                 * the crazy bunny award
                 *
                 */
                // Body: {
                //     src: Utils.asset("bunny_sprite.png"),
                //     texture: {w: 75, h: 67, x: 5, y: 5},
                //     color: this.playerColor
                // },
                // LegLeft: {
                //     src: Utils.asset("bunny_sprite.png"),
                //     texture: {x: 5, y: 89, w: 11, h: 29},
                //     x: 15, y: 50
                // },
                // // etc..
            }
        };
    }

    static get playerColor() {
        return 0xffFFC42A;
    }

    _construct() {
        this._size = new Vector(0.9, 1);
    }

    _init() {
        this._pos = this._resetPos = this._pos.plus(new Vector(0, -0.5));
        this.speed = new Vector(0, 0);
    }

    // plus 0, -0.5
    set pos(v) {
        this._pos = v;
    }

    get pos() {
        return this._pos;
    }

    get size() {
        return this._size;
    }

    moveX(step, level, keys, distance) {
        let playerXSpeed = 7;
        this.speed.x = 0;
        if (keys.left) {
            this.speed.x -= playerXSpeed;
            this.tag("Bunny").scaleX = 1;
        }
        if (keys.right) {
            this.speed.x += playerXSpeed;
            this.tag("Bunny").scaleX = -1;
        }
        let motion = new Vector(this.speed.x * step, 0);
        let newPos = this.pos.plus(motion);
        let obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle) {
            level.playerTouched(obstacle);
        } else {
            this.pos = newPos;
        }

        this.x = (this.pos.x - distance - 0.1) * 75;

    }

    moveY(step, level, keys, distance) {
        let gravity = 30;
        let jumpSpeed = 17;
        this.speed.y += step * gravity;
        let motion = new Vector(0, this.speed.y * step);
        let newPos = this.pos.plus(motion);
        let obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle) {
            level.playerTouched(obstacle);
            if (keys.up && this.speed.y > 0) {
                this.speed.y -= jumpSpeed;
            } else {
                this.speed.y = 0;
            }
        } else {
            this.pos = newPos;
        }

        this.y = (this.pos.y - distance) * 75;
    }

    act(step, level, keys, viewport) {

        this.moveX(step, level, keys, viewport.x);
        this.moveY(step, level, keys, viewport.y);

        let otherActor = level.actorAt(this);
        if (otherActor) {
            level.playerTouched(otherActor.atype, otherActor, this);
        }
    }

    alive() {
        this.pos = this._resetPos;
        this.speed.x = 0;
        this.speed.y = 0;
    }
}