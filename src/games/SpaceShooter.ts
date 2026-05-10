import * as Phaser from 'phaser';

export class SpaceShooterScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private bullets!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  public onGameOver: (score: number) => void = () => {};
  private isGameOver: boolean = false;
  private nextEnemyTime: number = 0;
  private lastFired: number = 0;

  constructor() {
    super('SpaceShooter');
  }

  preload() {
    let graphics = this.make.graphics({});
    
    graphics.fillStyle(0x00f2ff, 1);
    graphics.fillTriangle(20, 0, 0, 40, 40, 40);
    graphics.generateTexture('ship', 40, 40);
    
    graphics.clear();
    graphics.fillStyle(0xff00ff, 1);
    graphics.fillRect(0, 0, 40, 40);
    graphics.generateTexture('enemy', 40, 40);
    
    graphics.clear();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, 4, 15);
    graphics.generateTexture('bullet', 4, 15);
    graphics.destroy();
  }

  create() {
    const { width, height } = this.scale;

    this.player = this.physics.add.sprite(width / 2, height - 60, 'ship');
    this.player.setCollideWorldBounds(true);

    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();

    this.physics.add.overlap(this.bullets, this.enemies, (b: any, e: any) => {
      b.destroy();
      e.destroy();
      this.score += 100;
      this.scoreText.setText(`SCORE: ${this.score}`);
    });

    this.physics.add.overlap(this.player, this.enemies, () => this.gameOver());

    this.scoreText = this.add.text(20, 20, 'SCORE: 0', {
      fontFamily: 'JetBrains Mono',
      fontSize: '24px',
      color: '#00f2ff'
    });

    this.input.on('pointermove', (pointer: any) => {
      if (!this.isGameOver) {
        // Add a bit of smoothing to player movement
        this.player.x = Phaser.Math.Linear(this.player.x, pointer.x, 0.2);
      }
    });

    this.input.on('pointerdown', () => this.fire());
    this.input.on('pointerup', () => {}); // Reset fire if needed
  }

  fire() {
    if (this.isGameOver || this.time.now < this.lastFired + 250) return;
    
    const bullet = this.bullets.create(this.player.x, this.player.y - 20, 'bullet');
    bullet.setVelocityY(-600);
    this.lastFired = this.time.now;
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;

    if (this.input.keyboard?.addKey('SPACE').isDown) this.fire();

    if (time > this.nextEnemyTime) {
      this.spawnEnemy();
      this.nextEnemyTime = time + Math.max(200, 1000 - this.score / 10);
    }

    this.bullets.getChildren().forEach((b: any) => {
      if (b.y < -20) b.destroy();
    });

    this.enemies.getChildren().forEach((e: any) => {
      e.y += 3 + this.score / 5000;
      if (e.y > this.scale.height + 20) {
        e.destroy();
        this.score = Math.max(0, this.score - 50);
      }
    });
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(40, this.scale.width - 40);
    this.enemies.create(x, -40, 'enemy');
  }

  gameOver() {
    this.isGameOver = true;
    this.physics.pause();
    this.onGameOver(this.score);
  }
}
