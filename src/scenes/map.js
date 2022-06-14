export class Map extends Phaser.Scene {
    constructor() {
        super({
            key: 'Map',
        });
    }
    create(data) {

        
        // The offset used for getTileatWorldXY()
        this.inputOffsetX = 512;
        this.inputOffsetY = 512;
        // points used for the rhombus collision body for tilemap collisions
        this.POINTS = '0 0 512 -256 1024 0 512 256'

        this.input.setPollAlways();
        this.cursors = this.input.keyboard.createCursorKeys();

        this.initMap();
        this.initUI();

        this.player = this.matter.add.sprite(0, 0, 'atlasCrusader', null);
        this.player.setBody({type:'circle',radius:43})
        this.player.walkSpeed = 10;

        this.initCamera();

        

        // currently selected tile. 
        this.currentSelectedTile = null;
        
    }

    initMap() {
        
        this.map = this.add.tilemap('tilemap');
        this.tileset = this.map.addTilesetImage('from_tp0', 'tiles');
        this.layer1 = this.map.createLayer('Tile Layer 1', this.tileset);

        this.layer1.setCollisionByProperty({collides: true});

        this.convertTilemapLayer(this.layer1);
        
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

        this.cameras.main.startFollow(this.player, true);
    }

    showMousePos() {
        let pos = this.cameras.main.getWorldPoint(this.input.x, this.input.y);
        this.guiText[0].setText('input: (' + Math.round(this.input.x) + ', ' + Math.round(this.input.y) + ')');
        this.guiText[1].setText('input in world: (' + Math.round(pos.x) + ', ' + Math.round(pos.y) + ')');
        this.guiText[4].setText('zoom: ' + this.cameras.main.zoom);
    }

    update(time, delta) {
        this.showMousePos();
        this.player.setVelocity(0, 0);


        let sp = Math.sqrt(Math.pow(this.player.walkSpeed, 2) / 5);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.setVelocity(-2 * sp, -sp);
            this.player.anims.play('walk3', true);     
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocity(2 * sp, sp);
            this.player.anims.play('walk1', true);
        }

        // Vertical movement
        else if (this.cursors.up.isDown) {
            this.player.setVelocity(2 * sp, -1 * sp);
            this.player.anims.play('walk2', true);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocity(-2 * sp, sp);
            this.player.anims.play('walk4', true);
        }
        else {
            this.player.anims.restart();
            this.player.anims.stop();
        }

        this.checkInputForSelectedTile();
        //console.log(this.currentSelectedTile);
        this.player.angle = 0;
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

    // convert a tile x and y to the world x y.
    // this function is used to generate the rhombus collision bodies
    worldXY(tileXY) {
        let xx = (512*tileXY.x) - (512*tileXY.y) + this.inputOffsetX;
        let yy = (256*tileXY.x) + (256*tileXY.y) + 256 + this.inputOffsetY;

        return {x: xx, y: yy};
    }
    // generate collision bodies for a given tilemap layer
    convertTilemapLayer(tilemapLayer) {
        let layerData = tilemapLayer.layer; 

        let tiles = tilemapLayer.getTilesWithin(0, 0, layerData.width, layerData.height, { isColliding: true });

        
        for (let i = 0; i < tiles.length; i++) {
            let pt = this.worldXY({x: tiles[i].x, y: tiles[i].y});
            console.log(pt);
            
            let poly = this.add.polygon(pt.x, pt.y, this.POINTS, undefined, 0);
            
            this.matter.add.gameObject(poly, {shape: { type: 'fromVerts', verts: this.POINTS, flagInternal: true }}).setStatic(true);
            
        } 
    }

    
}
