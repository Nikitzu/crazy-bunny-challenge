import { Lightning, Utils } from "wpe-lightning-sdk";
import Menu from "./menu/Menu.js";

export default class Main extends Lightning.Component {

    static _template(){
        return {
            Image:{
                w:1920, h: 1080, src: Utils.asset("platformer-background.png")
            },
            Logo:{

            },
            Menu:{
                x: 1510, y: 680,
                type: Menu, items:[
                    {label:'Start',action:'start'},
                    {label:'Level select',action:'levels'},
                    {label:'About',action:'about'},
                    {label:'Exit', action:'exit'}
                ]
            }
        }
    }

    _getFocused(){
        return this.tag("Menu");
    }

    _handleEnter(){
        this.signal("select", {item: this.tag("Menu").activeItem});
    }
}