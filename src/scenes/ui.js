// The scene that draws the UI throughout the entire game
export class UI extends Phaser.Scene {
    constructor () {
        super({ key: 'UI', active: true });
    }
    create() {
        this.guiText = [];
        const num_elements = 10;
        this.guiRect = this.add.rectangle(0, 0, 400, 350, 0x0000000, 0.5);
        this.guiRect.setOrigin(0, 0);
        this.guiRect.setVisible(false);

        for (var i = 0; i < num_elements; i++) {
            this.guiText[i] = this.add.text(10, 10+(70*i), "",  { font: '20px Arial', fill: '#fff' })
            this.guiText[i].setOrigin(0, 0);
        }
    }
}