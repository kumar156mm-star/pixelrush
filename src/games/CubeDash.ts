import * as Phaser from 'phaser';

export class CubeDashScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  public onGameOver: (score: number) => void = () => {};
  private isGameOver: boolean = false;
  private nextObstacleTime: number = 0;

  constructor() {
    super('CubeDash');
  }

  preload() {
    let graphics = this.make.graphics({});
    graphics.fillStyle(0x00f2ff, 1);
    graphics.fillRect(0, 0, 40, 40);
    graphics.generateTexture('cube', 40, 40);
    
    graphics.clear();
    graphics.fillStyle(0xff00ff, 1);
    graphics.fillTriangle(0, 40, 20, 0, 40, 40);
    graphics.generateTexture('spike', 40, 40);
    graphics.destroy();
  }

  create() {
    const { width, height } = this.scale;
    const groundY = height * 0.75;

    // Create a proper physics ground
    const ground = this.add.rectangle(width / 2, groundY + 20, width, 40, 0x111111);
    this.physics.add.existing(ground, true);

    // Spawn player exactly on top of ground
    // Cube is 40x40. Ground center is groundY + 20. Top of ground is groundY.
    this.player = this.physics.add.sprite(150, groundY - 20, 'cube');
    this.player.setGravityY(2000);
    this.player.setCollideWorldBounds(true);
    
    this.physics.add.collider(this.player, ground);

    this.obstacles = this.physics.add.group();

    this.physics.add.overlap(this.player, this.obstacles, () => this.gameOver());

    this.scoreText = this.add.text(40, 40, 'FLOW: 0', {
      fontFamily: 'JetBrains Mono',
      fontSize: '28px',
      color: '#00f2ff',
      stroke: '#000000',
      strokeThickness: 4
    });

    this.input.on('pointerdown', () => this.jump());
    this.input.keyboard?.on('keydown-SPACE', () => this.jump());
    this.input.keyboard?.on('keydown-UP', () => this.jump());
    this.input.keyboard?.on('keydown-W', () => this.jump());
  }

  jump() {
    if (this.player.body.blocked.down || this.player.body.touching.down) {
      this.player.setVelocityY(-700);
      this.tweens.add({
        targets: this.player,
        angle: 90,
        duration: 400,
        onComplete: () => { this.player.angle = 0; }
      });
    }
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;

    this.score += delta * 0.01;
    this.scoreText.setText(`FLOW: ${Math.floor(this.score)}`);

    if (time > this.nextObstacleTime) {
      this.spawnObstacle();
      this.nextObstacleTime = time + Phaser.Math.Between(1000, 2500) - Math.min(800, this.score * 2);
    }

    this.obstacles.getChildren().forEach((obs: any) => {
      obs.x -= 8 + this.score / 800;
      if (obs.x < -100) obs.destroy();
    });
  }

  spawnObstacle() {
    const { height } = this.scale;
    const groundY = height * 0.75;
    // Spawn spike exactly on the ground
    const obstacle = this.obstacles.create(this.scale.width + 100, groundY - 20, 'spike');
    obstacle.setImmovable(true);
    obstacle.body.allowGravity = false;
    
    // tighter hitbox for cube dash
    obstacle.body.setSize(20, 20);
    obstacle.body.setOffset(10, 20);
  }

  gameOver() {
    this.isGameOver = true;
    this.physics.pause();
    this.onGameOver(Math.floor(this.score));
  }
}
