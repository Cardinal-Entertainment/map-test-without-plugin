import Phaser from 'phaser';
import { Load } from "./scenes/load.js";
import { Map } from "./scenes/map.js";
import { UI } from "./scenes/ui.js";

import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./components/App.jsx";


// configurations for the Phaser game
var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0
            },
            debug: true,
        }
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

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);