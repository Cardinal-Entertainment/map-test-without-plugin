export class Map extends Phaser.Scene {
    constructor() {
        super({
            key: 'Map',
        });
    }
    create(data) {
        this.input.setPollAlways();
        this.cursors = this.input.keyboard.createCursorKeys();

        this.initMap();
        this.initUI();

        this.player = this.physics.add.sprite(0, 0, 'atlasCrusader');
        this.player.walkSpeed = 800;
        this.initCamera();
    }

    initMap() {
        this.map = this.add.tilemap('tilemap');
        this.tileset = this.map.addTilesetImage('from_tp0', 'tiles');

        this.layer1 = this.map.createLayer('Tile Layer 1', this.tileset);
    }
    initUI() {
        // get references to the GUI elements
        this.guiRect = this.scene.get('UI').guiRect;
        this.guiRect.setVisible(true);
        this.guiText = this.scene.get('UI').guiText;
    }

    initCamera() {
        // set up the camera
        this.cameras.main.setZoom(0.5);
        this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
            this.cameras.main.zoom -= deltaY * 0.001;
            this.cameras.main.zoom = Math.min(this.cameras.main.zoom, 2);
            this.cameras.main.zoom = Math.max(this.cameras.main.zoom, 0.125);
        }, this);

        this.cameras.main.startFollow(this.player);
    }

    showMousePos() {
        let pos = this.cameras.main.getWorldPoint(this.input.x, this.input.y);
        this.guiText[0].setText('input: (' + Math.round(this.input.x) + ', ' + Math.round(this.input.y) + ')');
        this.guiText[1].setText('input in world: (' + Math.round(pos.x) + ', ' + Math.round(pos.y) + ')');
        this.guiText[4].setText('zoom: ' + this.cameras.main.zoom);
    }

    update(time, delta) {

        this.showMousePos();


        this.player.body.velocity.setTo(0, 0, 0);
        // Horizontal movement
        if (this.cursors.left.isDown) {
            //this.cameras.main.scrollX -= 50;
            this.player.body.velocity.setTo(-1 * this.player.walkSpeed, 0, 0);
            this.player.anims.play('walk3', true);
        }
        else if (this.cursors.right.isDown) {
            //this.cameras.main.scrollX += 50;
            this.player.body.velocity.setTo(this.player.walkSpeed, 0, 0);
            this.player.anims.play('walk1', true);
        }

        // Vertical movement
        else if (this.cursors.up.isDown) {
            //this.cameras.main.scrollY -= 50;
            this.player.body.velocity.setTo(0, -this.player.walkSpeed, 0);
            this.player.anims.play('walk2', true);
        }
        else if (this.cursors.down.isDown) {
            //this.cameras.main.scrollY += 50;
            this.player.body.velocity.setTo(0, this.player.walkSpeed, 0);
            this.player.anims.play('walk4', true);
        }
    }
}