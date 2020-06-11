import { Utils} from "wpe-lightning-sdk";
import {Floor} from "./";

export default class FloorRight extends Floor {
    _init() {
        this.src = Utils.asset(`assets/level/floor-right-1.png`);
    }
}