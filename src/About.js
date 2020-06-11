import { Lightning } from "wpe-lightning-sdk";

export default class About extends Lightning.Component {

    static _template(){
        return {
            Background: {
                rect: true, w: 1920, h: 1080, colorTop: 0xff38769f, colorBottom: 0xff363358
            },
            Content: {
                y: 340,
                Label:{
                    mountX: .5, x: 960, y: 80,
                    text:{text:'Super Bunny Jump', fontFace:'Magra', fontSize: 64}
                },
                Description:{
                    mountX: .5, x: 960, y:200, color: 0xaaffffff,
                    text:{
                        text:`This game has been build by Metrological to serve as training material and because we like bunnies. It's not that we love bunnies, but some how they keep on popping up in the games we make. We also really like dogs, but don't have any dogs in the office, there is one guy who kind a looks like a dog but that's it.\n\n v1.0.0`.trim(),
                        fontFace:'Roboto', fontSize:32, lineHeight:55, wordWrapWidth: 1080, textAlign: 'center'
                    }
                }
            }
        }
    }

    _active() {
        this.tag("Content").setSmooth("y", 280, {duration: .6});
    }

    _inactive() {
        this.tag("Content").setSmooth("y", 380, {duration: .3});
    }

}