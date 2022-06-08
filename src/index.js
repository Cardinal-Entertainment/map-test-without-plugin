import Phaser from 'phaser';
import { Load } from "./scenes/load.js";
import { Map } from "./scenes/map.js";
import { UI } from "./scenes/ui.js";
// configurations for the Phaser game
var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
    }, 
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        Load, Map, UI 
    ],
};

// instantiate the Phaser Game object
let game = new Phaser.Game(config);