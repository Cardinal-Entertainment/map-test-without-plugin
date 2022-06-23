export class Map extends Phaser.Scene {
    constructor() {
        super({
            key: 'Map',
        });
    }
    create(data) {
        this.input.setPollAlways();
        this.cursors = this.input.keyboard.createCursorKeys();

        // width of a single isometric tile.
        this.TILEWIDTH = 892;

        // height of a single isometric tile. This is the height of the tile in the isomap, not the spritesheet
        this.TILEHEIGHT = 512;

        // the offset that the tilemap is rendered at. Ensure this value is set to the correct value.
        // For an isometric map, this is the world coordinate of the top corner
        this.OFFSET_X = 446;
        this.OFFSET_Y = 0;

        // points used for the rhombus collision body for tilemap collisions.
        this.POINTS = '0 0 ' + (this.TILEWIDTH/2) + ' -' + (this.TILEHEIGHT/2) + ' ' + this.TILEWIDTH + ' 0 ' + (this.TILEWIDTH/2) + ' ' + (this.TILEHEIGHT/2);

        console.log('points = ' + this.POINTS);
        

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
        // add the tilemap and layer
        this.map = this.add.tilemap('tilemap');
        this.tileset = this.map.addTilesetImage('tiles', 'tiles');
        this.layer1 = this.map.createLayer('Tile Layer 1', this.tileset);

        // Option 1 for tilemap collision: Set collision on entire tiles
        
        //this.layer1.setCollisionByProperty({collides: true}); // set collision on tiles with the property collides = true
        //this.layer1.setCollisionBetween(1, 16); // set collision on tiles in a given id range

        // add the matter tile bodies
        //this.convertTilemapLayer(this.layer1);

        // Option 2 for tilemap collision: Create an object layer in tiled and generate collision polygons of any size

        // convert the tiled object layer into matter polygons
        this.createFromObjects(this.map, 'Object Layer 1');
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
        this.checkInputForSelectedTile();
        this.player.setVelocity(0, 0);

        let speedFactor = 0.001;

        let velocityX = this.TILEWIDTH * speedFactor * this.player.walkSpeed;
        let velocityY = this.TILEHEIGHT * speedFactor * this.player.walkSpeed;

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.setVelocity(-1 * velocityX, -1 * velocityY);
            this.player.anims.play('walk3', true);     
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocity(velocityX, velocityY);
            this.player.anims.play('walk1', true);
        }

        // Vertical movement
        else if (this.cursors.up.isDown) {
            this.player.setVelocity(velocityX, -1 * velocityY);
            this.player.anims.play('walk2', true);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocity(-1 * velocityX, velocityY);
            this.player.anims.play('walk4', true);
        }
        else {
            this.player.anims.restart();
            this.player.anims.stop();
        }

        
        //console.log(this.currentSelectedTile);

        // prevent player from rotating when colliding with other matter bodies
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
        pos.x -= this.OFFSET_X;
        pos.y -= this.OFFSET_Y;
        let tile = this.layer1.getTileAtWorldXY(pos.x, pos.y);
        if (tile !== null) {
            this.currentSelectedTile = tile;
            this.currentSelectedTile.tint = (0x86bfda);
            // console.log(this.currentSelectedTile);
        }
    }

    // convert a tile's coordinates to the world coordinates.
    // the coordinate returned will be the CENTER of the isometric tile
    // used in convertTilemapLayer.
    tileXYtoworldXY(tileXY) {
        let xx = ((this.TILEWIDTH/2)*tileXY.x) - ((this.TILEWIDTH/2)*tileXY.y) + this.OFFSET_X;

        // note: tileheight/2 is added to the y coordinate so that the center of the isometric tile is returned.
        let yy = ((this.TILEHEIGHT/2)*tileXY.x) + ((this.TILEHEIGHT/2)*tileXY.y) + (this.TILEHEIGHT/2) + this.OFFSET_Y;

        return {x: xx, y: yy};
    }

    // convert iso coordinates to the world coordinates.
    // used in createfromObjects.
    isoXYtoWorldXY(isoXY) {
        let xx = (this.TILEWIDTH / (2*this.TILEHEIGHT)) * (isoXY.x - isoXY.y) + this.OFFSET_X;
        let yy = (0.5 * isoXY.x) + (0.5 * isoXY.y) + this.OFFSET_Y;
        return {x: xx, y: yy};
    }

    // generate collision bodies for a given tilemap layer
    convertTilemapLayer(tilemapLayer) {
        let layerData = tilemapLayer.layer; 
        let tiles = tilemapLayer.getTilesWithin(0, 0, layerData.width, layerData.height, { isColliding: true });

        for (let i = 0; i < tiles.length; i++) {
            let pt = this.tileXYtoworldXY({x: tiles[i].x, y: tiles[i].y});
            let poly = this.add.polygon(pt.x, pt.y, this.POINTS, undefined, 0);
            
            this.matter.add.gameObject(poly, {shape: { type: 'fromVerts', verts: this.POINTS, flagInternal: true }}).setStatic(true);
        } 
    }

    // create collision bodies for a given object layer
    createFromObjects(map, objectLayerName) {
        let objectLayer = map.getObjectLayer(objectLayerName);
        let objects = objectLayer.objects;

        for (let i = 0; i < objects.length; i++) {
            let obj = objects[i];

            // define the four corners of the rhom  bus
            let p1 = this.isoXYtoWorldXY({x: obj.x, y: obj.y});
            let p2 = this.isoXYtoWorldXY({x: obj.x + obj.width, y: obj.y});
            let p3 = this.isoXYtoWorldXY({x: obj.x + obj.width, y: obj.y + obj.height});
            let p4 = this.isoXYtoWorldXY({x: obj.x, y: obj.y + obj.height});

            let pts = p1.x + ' ' + p1.y + ' ' + p2.x + ' ' + p2.y + ' ' + p3.x + ' ' + p3.y + ' ' + p4.x + ' ' + p4.y;

            let avgX = (p1.x + p2.x + p3.x + p4.x) / 4;
            let avgY = (p1.y + p2.y + p3.y + p4.y) / 4;
            let poly = this.add.polygon(avgX, avgY, pts, undefined, 0);

            this.matter.add.gameObject(poly, {shape: { type: 'fromVerts', verts: pts, flagInternal: true }}).setStatic(true);
        }
        
    }
}