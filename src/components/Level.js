import {Lightning} from "wpe-lightning-sdk";
import {Player, Carrot, Lava, Plant, Jumper, Slicer, Mole} from './';
import Vector from "../lib/Vector";

export default class Level extends Lightning.Component {

    static _template() {
        return {
            Assets: {},
            Decorators: {},
            Actors: {}
        };
    }

    set plan(v) {
        this._plan = v;
        this._layout = v.layout;
    }

    set lives(v) {
        this._lives = v;
    }

    get actorCharacters() {
        return {
            "@": Player,
            "c": Carrot,
            "^": Jumper,
            'o': Slicer,
            "!": Lava,
            "m": Mole
        };
    }

    get decoratorsCharacters() {
        return {
            "p": Plant
        };
    }

    _setup() {
        this.width = this._layout[0].length;
        this.height = this._layout.length;
        this.grid = [];
        this.actors = [];
        this.decorators = [];
        this.carrots = 0;
        this.total = 0;

        this._enemyType = [
            "lava","mole","slicer"
        ];
    }

    _init() {
        for (let y = 0; y < this.height; y++) {
            let line = this._layout[y], gridLine = [];
            for (let x = 0; x < this.width; x++) {
                let ch = line[x], fieldType = null;
                let Actor = this.actorCharacters[ch];
                let Decorator = this.decoratorsCharacters[ch];
                if (Actor) {
                    const a = this.stage.c({
                        type: Actor, pos: new Vector(x, y), ch
                    });
                    if (Actor === Carrot) {
                        this.carrots += 1;
                    }
                    this.actors.push(a);
                } else if (Decorator) {
                    const d = this.stage.c({
                        type: Decorator, pos: new Vector(x, y), ch
                    });
                    this.decorators.push(d);
                } else if (ch == "x") {
                    fieldType = "floor";
                } else if (ch == "(") {
                    fieldType = "floor-left";
                } else if (ch == ")") {
                    fieldType = "floor-right";
                } else if (ch == "i") {
                    fieldType = "wall";
                } else if (ch == "!") {
                    fieldType = "lava";
                }
                gridLine.push(fieldType);
            }

            this.total = this.carrots;
            this.grid.push(gridLine);
        }
    }

    obstacleAt(pos, size) {
        let xStart = Math.floor(pos.x);
        let xEnd = Math.ceil(pos.x + size.x);
        let yStart = Math.floor(pos.y);
        let yEnd = Math.ceil(pos.y + size.y);

        if (xStart < 0 || xEnd > this.width || yStart < 0) {
            return "wall";
        }else if(yEnd > this.height){
            return "lava";
        }

        for (let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                let fieldType = this.grid[y][x];
                if (fieldType) {
                    return fieldType;
                }
            }
        }
    }

    actorAt(actor) {
        for (let i = 0; i < this.actors.length; i++) {
            let other = this.actors[i];
            if (other !== actor &&
                actor.pos.x + actor._size.x > other.pos.x &&
                actor.pos.x < other.pos.x + other._size.x &&
                actor.pos.y + actor._size.y > other.pos.y &&
                actor.pos.y < other.pos.y + other._size.y &&
                other.visible ) {
                return other;
            }
        }
    }

    playerTouched(type, actor, player) {
        if(this._enemyType.indexOf(type) !== -1){
            this.signal("playerDied");
            return
        }

        if (type === "carrot") {
            this.carrots -= 1;
            this.signal("carrotGrab");

            // call touch method on actor, ad pass player reference
            // could be handle more nicely in the future
            actor.onTouch(player);

            // remove touched actor
            this.actors = this.actors.filter((other) => {
                return other !== actor;
            });

            // test if we still have carrots left
            // else we signal that this level is finished
            if (!this.actors.some((actor) => {
                return actor.atype === "carrot";
            })) {
                this.signal("playerFinished");
            }

        } else if(type === "jumper"){
            actor.onTouch(player);
        }
    }

    fill(ref, children) {
        this.tag(ref).children = children;
    }

    step(dt, viewport) {
        const actors = this.tag("Actors").children;
        let n = actors.length;

        while (n--) {
            actors[n].act(dt, viewport);
        }
    }

}