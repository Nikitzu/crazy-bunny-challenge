import {Lightning, Utils} from "wpe-lightning-sdk";

export default class CarrotsLeft extends Lightning.Component {
    static _template(){
        return {
            flex: {},
            Carrot: {
                flexItem: {marginTop: 10, marginBottom: 10, marginLeft: 0, marginRight: 15},
                src: Utils.asset('assets/ui/carrot.png')
            },
            CarrotsCounter: {
                flex: {},
                Grabbed:{
                    text:{text:'', fontFace: "Magra", fontSize: 42}
                },
                Total: {
                    flexItem: {marginLeft: 10, marginTop: 14},
                    text:{text:'', fontFace: "Magra", fontSize: 24}
                }
            }
        }
    }

    set(v) {
        this.carrots = v;
        this.tag("Grabbed").text.text = `${this.carrots.total - this.carrots.left}`;
        this.tag("Total").text.text = `/ ${this.carrots.total}`;
    }

}