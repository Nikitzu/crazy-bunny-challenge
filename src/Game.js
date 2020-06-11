import {Level, Assets, Player, Lives, CarrotsLeft} from "./components";
import {Lightning, Settings, Utils} from "wpe-lightning-sdk";
import levels from "./lib/gameLevels";


export default class Game extends Lightning.Component {
    static _template() {
        return {
            Background: {
                rect: true, w: 1920, h: 1080, colorTop: 0xff38769f, colorBottom: 0xff363358
            },
            Level: {},
            Player: {},
            Statistics: {
                Lives: {
                    x: 70, y: 40,
                    type: Lives
                },
                CarrotsLeft: {
                   x: 70, y: 80,
                    type: CarrotsLeft
                },
                zIndex:2
            }
        };
    }

    _construct() {
        /**
         * Tilesize
         * @type {number}
         */
        this.levelScale = 75;

        /**
         * Our visible viewport
         * @type {{w: number, x: number, h: number, y: number}}
         */
        this.viewport = {
            x: 0,
            y: 0,
            w: 1920 / this.levelScale,
            h: 1080 / this.levelScale,
        };

        /**
         * Key state
         * @type {{left: boolean, right: boolean, up: boolean, down: boolean}}
         */
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        this.updateListener = () => {
            this.loop();
        };

        this.lives = 10;
    }

    _init() {
        this.createNewRound();

        if (Settings.get("app", "showGrid")) {
            this.renderDebugGrid();
        }
    }

    _active() {
        this._setState("Playing");
    }

    createNewRound() {
        this._setState("Setup");
        // create and hold level reference
        const level = this.stage.c({
            // @todo: replace plan property for:
            // plan: levels[~~(Math.random() * levels.length)]
            // to get random levels:
            // level editor in: lib/gameLevels.js
            type: Level, plan: levels[0], lives: 5, signals: {
                playerDied: true, playerFinished: true, carrotGrab: true
            }
        });

        // it's should not be neccesary for something like
        // a level controller to populate a position in the rendertree
        // but for now we do it to showcase Lightnings capabilities
        // and not having to use event emitters for communication
        this.tag("Level").children = [level];

        this.renderLevel(level, true);
        this.renderActors(level);
        this.updateStatistics(level);
        this.renderDecorators(level);

        // reset keys
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false
        };
    }

    renderLevel(level, override = false) {
        if (override) {
            this.level = level;
        }

        let children = [];
        let view = this.level.grid;
        let xStart = 0;
        let xEnd = view[0].length;
        let yStart = 0;
        let yEnd = view.length;

        for (let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                const tile = this.level.grid[y][x];
                if (tile === null) {
                    continue;
                } else {
                    const construct = Assets.get(tile);
                    const screenX = x * this.levelScale;
                    const screenY = y * this.levelScale;
                    const w = construct.size.x * this.levelScale;
                    const h = construct.size.y * this.levelScale;

                    // create and hold reference
                    const child = this.stage.c({
                        type: construct, x: screenX, y: screenY, w, h
                    });

                    children.push(child);
                }
            }
        }

        this.level.fill("Assets", children);
    }

    renderActors(level) {
        const children = level.actors.map((actor) => {
            actor.x = actor.pos.x * this.levelScale;
            actor.y = actor.pos.y * this.levelScale;
            actor.w = this.levelScale;
            actor.h = this.levelScale;

            if (actor.constructor === Player) {
                actor.h = 75 * 1.5;
                this.player = actor;
                return false;
            }
            return actor;
        }).filter(Boolean);

        // add player to rendertree
        this.tag("Player").children = [this.player];

        // populate actores
        this.level.fill("Actors", children);
    }

    renderDecorators(level){
        const children = level.decorators.map((decorator) => {
            decorator.x = decorator.pos.x * this.levelScale;
            decorator.y = decorator.pos.y * this.levelScale;
            decorator.w = this.levelScale;
            decorator.h = this.levelScale;
            return decorator;
        }).filter(Boolean);

        // populate actores
        this.level.fill("Decorators", children);
    }

    updateStatistics(level) {
        this.tag("Lives").set(this.lives);
        this.tag("CarrotsLeft").set({left: level.carrots, total: level.total});
    }

    updateViewport() {
        let view = this.viewport;
        let xMargin = view.w / 3;
        let yMargin = view.h / 3;
        let player = this.player;
        let center = player.pos.plus(player.size.times(0.5));

        if (center.x < view.x + xMargin) {
            view.x = Math.max(center.x - xMargin, 0);
        } else if (center.x > view.x + view.w - xMargin) {
            view.x = Math.min(center.x + xMargin - view.w,
                this.level.width - view.w);
        }
        if (center.y < view.y + yMargin) {
            view.y = Math.max(center.y - yMargin, 0);
        } else if (center.y > view.y + view.h - yMargin) {
            view.y = Math.min(center.y + yMargin - view.h,
                this.level.height - view.h);
        }

        this.level.x = -this.viewport.x * this.levelScale;
        this.level.y = -this.viewport.y * this.levelScale;
    }

    loop() {
        // update level
        this.level.step(this.stage.dt, this.viewport);

        // update player
        this.player.act(this.stage.dt, this.level, this.keys, this.viewport);

        // update viewport
        this.updateViewport();
    }

    static _states() {
        return [
            class Setup extends this {

            },
            class Playing extends this {
                $enter() {
                    this.stage.on("frameStart", this.updateListener);
                }

                $exit() {
                    this.stage.off("frameStart", this.updateListener);
                }

                playerDied() {
                    this._setState("Died");
                }

                carrotGrab() {
                    this.tag("CarrotsLeft").set({left: this.level.carrots, total: this.level.total});
                }

                playerFinished() {
                    this._setState("Win");
                }

                _handleLeft() {
                    this.keys.left = true;
                }

                _handleLeftRelease() {
                    this.keys.left = false;
                }

                _handleRight() {
                    this.keys.right = true;
                }

                _handleRightRelease() {
                    this.keys.right = false;
                }

                _handleUp() {
                    this.keys.up = true;
                }

                _handleUpRelease() {
                    this.keys.up = false;
                }

                _handleDown() {
                    this.keys.down = true;
                }

                _handleDownRelease() {
                    this.keys.down = false;
                }
            },
            class Paused extends this {

            },
            class Died extends this{
                _captureKey(){

                }
                $enter(){
                    this.player.died();

                    this.patch({
                        Background:{
                            smooth:{alpha:0}
                        },
                        Level:{
                            smooth:{alpha:0}
                        }
                    });

                    this.keys = {
                        left: false,
                        right: false,
                        up: false,
                        down: false
                    };

                    this.player.setSmooth("scale",1.5, {duration:1});
                    this.player.setSmooth("y",540, {duration:1});

                    setTimeout(()=>{
                        this.lives -= 1;
                        this.tag("Lives").set(this.lives);
                        this.player.alive();
                        this._setState("Playing");
                        this.player.scale = 1;
                    },2000)
                }
                $exit(){
                    this.patch({
                        Background:{
                            smooth:{alpha:1}
                        },
                        Level:{
                            smooth:{alpha:1}
                        }
                    });
                }
            },
            class Win extends this {
                $enter() {
                    this.signal("won");
                }
            },
            class Lost extends this {

            }
        ];
    }

    renderDebugGrid() {
        const c = new Array(40).fill("").map((el, idx) => {
            return {
                type: Line, y: idx * 40
            };
        });
        const d = new Array(60).fill("").map((el, idx) => {
            return {
                type: Line, x: idx * 40, h: 1080, w: 1
            };
        });
        this.patch({
            Grid: {
                alpha: 0.5, children: [...c, ...d]
            }
        });
        this.tag("Grid").animation({
            duration: 10, repeat: -1, actions: [
                {p: 'alpha', v: {0: 0.5, 0.3: 0, 1: 0.5}}
            ]
        }).start();
    }
}

class Line extends Lightning.Component {
    static _template() {
        return {
            rect: true, h: 1, w: 1920
        };
    }
}