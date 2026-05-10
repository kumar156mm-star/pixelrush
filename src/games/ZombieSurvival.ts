import * as Phaser from 'phaser';

export class ZombieSurvivalScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private zombies!: Phaser.Physics.Arcade.Group;
  private bullets!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  public onGameOver: (score: number) => void = () => {};
  private isGameOver: boolean = false;
  private nextZombieTime: number = 0;

  constructor() {
    super('ZombieSurvival');
  }

  preload() {
    let graphics = this.make.graphics({});
    graphics.fillStyle(0x00f2ff, 1);
    graphics.fillCircle(15, 15, 15);
    graphics.generateTexture('survivor', 30, 30);
    
    graphics.clear();
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillCircle(15, 15, 15);
    graphics.generateTexture('zombie', 30, 30);
    
    graphics.clear();
    graphics.fillStyle(0xffff00, 1);
    graphics.fillRect(0, 0, 6, 6);
    graphics.generateTexture('bullet_z', 6, 6);
    graphics.destroy();
  }

  create() {
    const { width, height } = this.scale;

    this.player = this.physics.add.sprite(width / 2, height / 2, 'survivor');
    this.player.setCollideWorldBounds(true);

    this.zombies = this.physics.add.group();
    this.bullets = this.physics.add.group();

    this.physics.add.overlap(this.bullets, this.zombies, (b: any, z: any) => {
      b.destroy();
      z.destroy();
      this.score += 50;
      this.scoreText.setText(`KILLS: ${this.score / 50}`);
    });

    this.physics.add.overlap(this.player, this.zombies, () => this.gameOver());

    this.scoreText = this.add.text(20, 20, 'KILLS: 0', {
      fontFamily: 'JetBrains Mono',
      fontSize: '24px',
      color: '#00f2ff'
    });

    this.input.on('pointerdown', (pointer: any) => this.fire(pointer));
  }

  fire(pointer: any) {
    if (this.isGameOver) return;
    const bullet = this.bullets.create(this.player.x, this.player.y, 'bullet_z');
    this.physics.moveTo(bullet, pointer.x, pointer.y, 400);
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;

    const cursors = this.input.keyboard?.createCursorKeys();
    const speed = 200;
    
    let moveX = 0;
    let moveY = 0;

    if (cursors?.left.isDown) moveX = -speed;
    else if (cursors?.right.isDown) moveX = speed;

    if (cursors?.up.isDown) moveY = -speed;
    else if (cursors?.down.isDown) moveY = speed;

    // Mobile/Touch movement: Move towards pointer if held down
    if (this.input.activePointer.isDown) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.input.activePointer.x, this.input.activePointer.y);
      if (distance > 20) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.input.activePointer.x, this.input.activePointer.y);
        moveX = Math.cos(angle) * speed;
        moveY = Math.sin(angle) * speed;
      }
    }

    this.player.setVelocity(moveX, moveY);

    if (time > this.nextZombieTime) {
      this.spawnZombie();
      this.nextZombieTime = time + Math.max(500, 2000 - this.score / 5);
    }

    this.zombies.getChildren().forEach((z: any) => {
      this.physics.moveToObject(z, this.player, 80 + this.score / 1000);
    });
  }

  spawnZombie() {
    const side = Phaser.Math.Between(0, 3);
    let x, y;
    if (side === 0) { x = -20; y = Phaser.Math.Between(0, this.scale.height); }
    else if (side === 1) { x = this.scale.width + 20; y = Phaser.Math.Between(0, this.scale.height); }
    else if (side === 2) { x = Phaser.Math.Between(0, this.scale.width); y = -20; }
    else { x = Phaser.Math.Between(0, this.scale.width); y = this.scale.height + 20; }
    
    this.zombies.create(x, y, 'zombie');
  }

  gameOver() {
    this.isGameOver = true;
    this.physics.pause();
    this.onGameOver(this.score);
  }
}
