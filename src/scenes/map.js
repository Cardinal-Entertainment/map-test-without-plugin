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

        // The offset used for getTileatWorldXY()
        this.inputOffsetX = 512;
        this.inputOffsetY = 512;

        // currently selected tile. 
        this.currentSelectedTile = null;
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
        this.cameras.main.setZoom(1);
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
        this.checkInputForSelectedTile();
        console.log(this.currentSelectedTile);
    }
    checkInputForSelectedTile() {
        // reset selected tile 
        if (this.currentSelectedTile !== null) {
            this.currentSelectedTile.tint = 0xffffff;
            this.currentSelectedTile = null;
        }

        // poll input for selected tile
        let pos = this.cameras.main.getWorldPoint(this.input.x, this.input.y);
        pos.x -= this.inputOffsetX;
        pos.y -= this.inputOffsetY;
        let tile = this.layer1.getTileAtWorldXY(pos.x, pos.y);
        if (tile !== null) {
            this.currentSelectedTile = tile;
            this.currentSelectedTile.tint = (0x86bfda);
        }
    }
}
