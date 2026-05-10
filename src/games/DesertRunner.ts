import * as Phaser from 'phaser';

export class DesertRunnerScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  public onGameOver: (score: number) => void = () => {};
  private isGameOver: boolean = false;
  private spawnTimer: number = 0;
  private gameSpeed: number = 1;

  constructor() {
    super('DesertRunner');
  }

  preload() {
    let graphics = this.make.graphics({});
    
    graphics.fillStyle(0x00f2ff, 1);
    graphics.fillRect(0, 0, 40, 60);
    graphics.generateTexture('player', 40, 60);
    
    graphics.clear();
    graphics.fillStyle(0xff00ff, 1);
    graphics.fillTriangle(0, 40, 20, 0, 40, 40);
    graphics.generateTexture('obstacle', 40, 40);
    
    graphics.clear();
    graphics.fillStyle(0x333333, 1);
    graphics.fillRect(0, 0, 800, 2);
    graphics.generateTexture('ground', 800, 2);
    graphics.destroy();
  }

  create() {
    const { width, height } = this.scale;
    const groundY = height * 0.85;

    // 1. Create a physics-enabled ground
    const ground = this.add.rectangle(width / 2, groundY, width, 40, 0x333333);
    this.physics.add.existing(ground, true); // true = static body

    // 2. Spawn player properly above ground
    // Player height is 60, so we place it at groundY - 20 (half ground height) - 30 (half player height)
    this.player = this.physics.add.sprite(150, groundY - 70, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(1200); // Slightly more snappy gravity
    
    // 3. Add collider
    this.physics.add.collider(this.player, ground);

    this.obstacles = this.physics.add.group();

    this.physics.add.overlap(this.player, this.obstacles, () => this.gameOver());

    this.scoreText = this.add.text(40, 40, 'SCORE: 0', {
      fontFamily: 'JetBrains Mono',
      fontSize: '28px',
      color: '#00f2ff',
      stroke: '#000000',
      strokeThickness: 4
    });

    // 4. Input handling
    this.input.keyboard?.on('keydown-SPACE', () => this.jump());
    this.input.keyboard?.on('keydown-W', () => this.jump());
    this.input.keyboard?.on('keydown-UP', () => this.jump());
    this.input.on('pointerdown', () => this.jump());
  }

  jump() {
    // Check if player is on ground or colliding with a platform
    if (this.player.body.touching.down || this.player.body.blocked.down) {
      this.player.setVelocityY(-600);
    }
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;

    this.score += delta * 0.01 * this.gameSpeed;
    this.scoreText.setText(`SCORE: ${Math.floor(this.score)}`);
    
    this.gameSpeed += 0.00005; // Slightly slower speed scaling for better playability

    this.spawnTimer += delta;
    if (this.spawnTimer > 1800 / this.gameSpeed) {
      this.spawnObstacle();
      this.spawnTimer = 0;
    }

    this.obstacles.getChildren().forEach((obstacle: any) => {
      obstacle.x -= 6 * this.gameSpeed;
      if (obstacle.x < -100) obstacle.destroy();
    });
  }

  spawnObstacle() {
    const { width, height } = this.scale;
    const groundY = height * 0.85;
    
    // Place obstacle exactly on the ground surface
    const obstacle = this.obstacles.create(width + 100, groundY - 40, 'obstacle');
    obstacle.setImmovable(true);
    obstacle.body.allowGravity = false;
    
    // Adjust hitbox for fairer collisions
    obstacle.body.setSize(30, 30);
    obstacle.body.setOffset(5, 10);
  }

  gameOver() {
    this.isGameOver = true;
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.onGameOver(Math.floor(this.score));
  }
}
