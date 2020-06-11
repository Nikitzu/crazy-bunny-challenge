import { Lightning, Utils } from "wpe-lightning-sdk";

export default class Splash extends Lightning.Component {

    static _template(){
        return {
            Background: {
                rect: true, w: 1920, h: 1080, colorTop: 0xff38769f, colorBottom: 0xff363358
            },
            Logo: {
                mount: .5, x: 960, y: 540, alpha: 0,
                transitions: {alpha: {duration: 1}, scale: {duration: 1}},
                src: Utils.asset("logo.png")
            },
            Carrot: {
                mount: 1, x: 1840, y: 1000,
                src: Utils.asset("assets/carrot.png")
            }
        }
    }

    _init(){
        this._pulse = this.animation({
            duration: 1, repeat: 3, actions:[
                {t: 'Carrot', p:'rotation', v:{0: 0, 1: Math.PI * 2}}
            ]
        });
        this._pulse.start();

        this._pulse.on("finish",()=>{
            this.signal("loaded");
        });
    }

    _active() {
        this.patch({
            Logo: {
                smooth: {alpha: 1, scale: 1.2}
            }
        });
    }
}