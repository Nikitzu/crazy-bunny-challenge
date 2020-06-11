/**
 * We import Lightning and Utils from our SDK:
 * https://github.com/WebPlatformForEmbedded/Lightning-SDK
 *
 */
import {Lightning, Utils} from "wpe-lightning-sdk";

/**
 * Import all the Components that we need in our App
 */

import Splash from "./Splash.js";
import Main from "./Main.js";
import Game from "./Game.js";
import About from "./About";
import LevelSelection from "./levelSelection/LevelSelection.js";

/**
 * Every Component will extends a Lightning Component
 * or a class that extends a Lightning Component:
 * https://webplatformforembedded.github.io/Lightning/docs/components/overview
 */
export default class App extends Lightning.Component {

    /**
     * Provide all the needed fonts for your Application. During setup all the fonts will be loaded
     * and after load your app will show.
     *
     * @returns {{descriptor: {}, family: string, url: *}[]}
     */
    static getFonts() {
        return [
            {family: 'Magra', url: Utils.asset('fonts/Magra-Bold.ttf'), descriptor: {}},
            {family: 'Roboto', url: Utils.asset('fonts/Roboto-Regular.ttf'), descriptor: {}}
        ];
    }

    /**
     * Define the root tree of your App
     */
    static _template() {
        return {
            Splash: {
                type: Splash,
                /**
                 * Define which signals you accept from the splash page
                 */
                signals: {loaded: true}, alpha: 0
            },
            Main: {
                type: Main, alpha: 0, signals: {select: "menuSelect"}
            },
            About:{
                type: About, alpha: 0
            },
            LevelSelection:{
                type: LevelSelection, alpha: 0
            },
            Game: {
                type: Game, alpha: 0, signals: {won: true}
            }
        };
    }

    /**
     * Setup lifecycle event:
     * https://webplatformforembedded.github.io/Lightning/docs/components/overview#component-events
     * @private
     */
    _setup() {
        this._setState("Splash");
    }

    /**
     * The definition of our statemachine:
     * https://webplatformforembedded.github.io/Lightning/docs/components/statemachine/statemachine
     *
     * @returns {*[]}
     * @private
     */
    static _states() {
        return [
            class Splash extends this {
                /**
                 * $enter() will be called when you enter a state,
                 * $exit() when you leave a state, you can do any additional clean up here
                 */
                $enter() {
                    this.tag("Splash").setSmooth("alpha", 1);
                }

                $exit() {
                    this.tag("Splash").setSmooth("alpha", 0);
                }

                loaded() {
                    this._setState("Main");
                }
            },
            class Main extends this {
                $enter() {
                    this.tag("Main").patch({
                        smooth: {alpha: 1, y: 0}
                    });
                }

                $exit() {
                    this.tag("Main").patch({
                        smooth: {alpha: 0, y: 100}
                    });
                }

                /**
                 * get's called when someone selects a menu item
                 * we first test if we have an attached method
                 * with that action
                 * @param item
                 * @returns {*}
                 */
                menuSelect({item}) {
                    if (this._hasMethod(item.action)) {
                        return this[item.action]();
                    }
                }

                /**
                 * start action / called by menu
                 */
                start() {
                    this._setState("Game");
                }

                /**
                 * about action / called by menu
                 * this is mainly to showcase substates
                 */

                about(){
                    this._setState("Main.About");
                }

                levels(){
                    this._setState("LevelSelection");
                }

                /**
                 * Tell Lightning which component is the active component
                 * and should handle the remote control events.
                 * @returns {*|never}
                 * @private
                 */
                _getFocused() {
                    return this.tag("Main");
                }

                /**
                 * Define substates
                 * @returns {Array}
                 * @private
                 */
                static _states(){
                    return [
                        class About extends this{
                            $enter(){
                                this.tag("About").setSmooth("alpha",1);
                            }

                            $exit(){
                                this.tag("About").setSmooth("alpha",0);
                            }

                            _handleBack(){
                                this._setState("Main");
                            }

                            _getFocused(){
                                this.tag("About");
                            }
                        }
                    ]
                }
            },
            class LevelSelection extends this{
                $enter(){
                    this.tag("LevelSelection").setSmooth("alpha",1);
                }

                $exit(){
                    this.tag("LevelSelection").setSmooth("alpha",0);
                }

                _getFocused(){
                    return this.tag("LevelSelection");
                }

                _handleBack(){
                    this._setState("Main");
                }
            },
            class Game extends this {
                $enter() {
                    this.tag("Game").setSmooth("alpha", 1);
                }

                $exit() {
                    this.tag("Game").setSmooth("alpha", 0);
                }

                _getFocused() {
                    return this.tag("Game");
                }

                won() {
                    this._setState("PrepareNewRound");
                }
            },
            class PrepareNewRound extends this {
                $enter() {
                    this.tag("Game").createNewRound();
                }
            }
        ];
    }
}