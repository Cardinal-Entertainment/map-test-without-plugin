export class Load extends Phaser.Scene {
    constructor() {
        super({
            key: 'Load'
        });
    }
    preload() {
        // load all the sprites 
        this.load.image('sprLogoTop', 'https://zoombies.world/images/zoombies_logo_horizontal_glow.svg');
        this.load.image('sprLogo', 'https://zoombies.world/images/zoombies_coin.svg');

        this.load.atlas('atlasCrusader', 'src/assets/sprites/crusader.png', 'src/assets/sprites/crusader.json');
		
        this.load.image('tiles', 'src/assets/tilemaps/iso/waste_atlas-0.png');
        this.load.tilemapTiledJSON('tilemap', 'src/assets/tilemaps/iso/waste_map.json')
        
        this.load.on("load", (file) => {console.log("Loaded " + file.src)});

    }
    createAnims() {
        // create all of the player walk anims
        var frameNames = this.anims.generateFrameNames('atlasCrusader', { start: 0, end: 14, zeroPad: 4, prefix:'walk/crusader_walk_1', suffix:'.png' });
        this.anims.create({ key: 'walk1', frames: frameNames, frameRate: 10, repeat: -1 });

        frameNames = this.anims.generateFrameNames('atlasCrusader', { start: 0, end: 14, zeroPad: 4, prefix:'walk/crusader_walk_3', suffix:'.png' });
        this.anims.create({ key: 'walk2', frames: frameNames, frameRate: 10, repeat: -1 });

        frameNames = this.anims.generateFrameNames('atlasCrusader', { start: 0, end: 14, zeroPad: 4, prefix:'walk/crusader_walk_5', suffix:'.png' });
        this.anims.create({ key: 'walk3', frames: frameNames, frameRate: 10, repeat: -1 });

        frameNames = this.anims.generateFrameNames('atlasCrusader', { start: 0, end: 14, zeroPad: 4, prefix:'walk/crusader_walk_7', suffix:'.png' });
        this.anims.create({ key: 'walk4', frames: frameNames, frameRate: 10, repeat: -1 });
    }
    create() {
        this.createAnims();
        // fade in the scene
        this.cameras.main.fadeIn(500, 0, 0, 0)

        // add the loading logos (adding sprite only works in the create event for some reason)
        this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'sprLogo').setScale(0.1);
        this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height * 0.2, 'sprLogoTop').setScale(0.2);

        // add a loading label 
        this.loadLabel = this.add.text(this.sys.game.config.width * 0.5, this.sys.game.config.height * 0.8, 'Loading...',
        { font: '60px Arial', fill: '#fff' });
        this.loadLabel.setOrigin(0.5, 0.5);

        // fade out after a while
        this.time.addEvent({
            delay: 1000,
            callback: () => {this.cameras.main.fadeOut(500, 0, 0, 0)},
        });

        // once fade out is completed go to main scene
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('Map');
        })
    }
}