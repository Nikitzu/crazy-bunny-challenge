import {Lightning, Utils} from "wpe-lightning-sdk";

export default class Lives extends Lightning.Component {
    static _template(){
        return {
            Hearts: {}
        }
    }

    set(v){
        this._lives = v;

        this.tag("Hearts").children = [];
        for (let i = 0; i < this._lives; i++) {
            this.tag("Hearts").childList.a({
                src: Utils.asset('assets/ui/heart.png'),
                x: 43 * i
            });
        }
    }

}