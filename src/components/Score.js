import Vector from "../lib/Vector";

export default class Score {
    constructor(pos) {
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.type = "score";
    }

    type() {
        return this.type;
    }

    act() {
    }
}