import { Lightning, Utils } from "wpe-lightning-sdk";

import List from "./List.js";

export default class LevelSelection extends Lightning.Component {

    static _template(){
        return {
            Background: {
                rect: true, w: 1920, h: 1080, color: 0xff000000
            },
            Lists:{
                x: 70, y: 70
            }
        }
    }

    async _init(){
        const response = await fetch(Utils.asset("levels.json"));
        const {categories} = await response.json();

        // create lists
        const children = categories.map((el, idx)=>{
            return {
                type: List, label: el.name, items: el.levels, y: idx*500
            }
        });

        // set current position
        this._index = 0;

        // add children
        this.tag("Lists").children = children;
    }

    _handleUp(){
        if(this._index > 0){
            this.setIndex(this._index - 1);
        }
    }

    _handleDown(){
        if(this._index < this.lists.length - 1){
            this.setIndex(this._index + 1);
        }
    }

    setIndex(index){
        this._index = index;
    }

    _getFocused(){
        return this.activeList;
    }

    get lists(){
        return this.tag("Lists").children;
    }

    get activeList(){
        return this.lists[this._index];
    }
}