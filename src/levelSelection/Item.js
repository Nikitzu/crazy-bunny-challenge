import {Lightning, Utils} from "wpe-lightning-sdk";

export default class Level extends Lightning.Component{
    static _template(){
        return {
            alpha: .5,
            Image: {

            },
            Title: {
                y: 310, x: 20,
                text: {fontFace: "Magra", fontSize: 24}
            }
        }
    }

    _focus(){
        this.setSmooth("alpha", 1);
    }

    _unfocus(){
        this.setSmooth("alpha", .5);
    }

    set item(v){
        this.patch({
            Image: {
                src: Utils.asset(`assets/chapters/${v.thumbnail}`)
            },
            Title: {
                text: {text: v.title}
            }
        });
    }
}