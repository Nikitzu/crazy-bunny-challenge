import {Wall, Lava, Floor, FloorLeft, FloorRight} from "./";

const types = new Map([
    ["wall", Wall],
    ["lava", Lava],
    ["floor", Floor],
    ["floor-left", FloorLeft],
    ["floor-right", FloorRight]
]);

export default {
    get: (type) => {
        if (types.has(type)) {
            return types.get(type);
        }
    }
};