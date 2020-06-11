import {Lightning} from "wpe-lightning-sdk";
import ItemWrapper from "./ItemWrapper.js";
import Item from "./Item.js";

export default class List extends Lightning.Component{
    static _template(){
        return{
            Label:{
                text:{text:'', fontFace: 'Magra'}
            },
            Levels:{
                y: 75
            }
        }
    }

    _init(){
        this._index = 0;
    }

    _handleLeft(){
        if(this._index > 0){
            this.setIndex(this._index - 1);
        }
    }

    _handleRight(){
        if(this._index < this.items.length - 1){
            this.setIndex(this._index + 1);
        }
    }

    setIndex(index){
        this._index = index;
        this.tag("Levels").setSmooth("x", index * - 500)
    }

    set label(v){
        this.tag("Label").text.text = v;
    }

    set items(v){
        this.tag("Levels").children = v.map((el, idx)=>{
            return {
                type: ItemWrapper, construct: Item, item: el, x: idx * 500
            };
        });
    }

    get items(){
        return this.tag("Levels").children;
    }

    get activeItem(){
        return this.items[this._index];
    }

    _getFocused(){
        return this.activeItem;
    }

}