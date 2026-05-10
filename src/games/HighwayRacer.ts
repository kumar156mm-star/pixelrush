import * as Phaser from 'phaser';

export class HighwayRacerScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private traffic!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  public onGameOver: (score: number) => void = () => {};
  private isGameOver: boolean = false;
  private nextCarTime: number = 0;

  constructor() {
    super('HighwayRacer');
  }

  preload() {
    let graphics = this.make.graphics({});
    
    graphics.fillStyle(0xffff00, 1);
    graphics.fillRect(0, 0, 40, 70);
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(5, 5, 30, 20);
    graphics.generateTexture('car', 40, 70);
    
    graphics.clear();
    graphics.fillStyle(0xbc13fe, 1);
    graphics.fillRect(0, 0, 40, 70);
    graphics.generateTexture('traffic', 40, 70);
    
    graphics.clear();
    graphics.fillStyle(0x555555, 1);
    graphics.fillRect(0, 0, 10, 40);
    graphics.generateTexture('mark', 10, 40);
    graphics.destroy();
  }

  create() {
    const { width, height } = this.scale;

    for (let i = 0; i < 10; i++) {
        this.add.tileSprite(width / 2, i * 100, 10, 40, 'mark');
    }

    this.player = this.physics.add.sprite(width / 2, height - 100, 'car');
    this.player.setCollideWorldBounds(true);

    this.traffic = this.physics.add.group();

    this.physics.add.overlap(this.player, this.traffic, () => this.gameOver());

    this.scoreText = this.add.text(20, 20, 'SPEED: 0 KM/H', {
      fontFamily: 'JetBrains Mono',
      fontSize: '24px',
      color: '#ffff00'
    });
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;

    const cursors = this.input.keyboard?.createCursorKeys();
    const isPointerDown = this.input.activePointer.isDown;
    const pointerX = this.input.activePointer.x;

    if (cursors?.left.isDown || (isPointerDown && pointerX < this.scale.width * 0.4)) {
      this.player.x -= 8;
    } else if (cursors?.right.isDown || (isPointerDown && pointerX > this.scale.width * 0.6)) {
      this.player.x += 8;
    }

    this.score += delta * 0.1;
    this.scoreText.setText(`SPEED: ${Math.floor(this.score / 10 + 100)} KM/H`);

    if (time > this.nextCarTime) {
      this.spawnCar();
      this.nextCarTime = time + Math.max(300, 1000 - this.score / 100);
    }

    this.traffic.getChildren().forEach((car: any) => {
      car.y += 10 + this.score / 2000;
      if (car.y > this.scale.height + 100) car.destroy();
    });
  }

  spawnCar() {
    const lanes = [this.scale.width * 0.25, this.scale.width * 0.5, this.scale.width * 0.75];
    const x = lanes[Phaser.Math.Between(0, 2)];
    this.traffic.create(x, -100, 'traffic');
  }

  gameOver() {
    this.isGameOver = true;
    this.physics.pause();
    this.onGameOver(Math.floor(this.score));
  }
}
