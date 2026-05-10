import * as Phaser from 'phaser';

export class TunnelRushScene extends Phaser.Scene {
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  public onGameOver: (score: number) => void = () => {};
  private isGameOver: boolean = false;
  private playerRotation: number = 0;
  private obstacles!: Phaser.GameObjects.Group;
  private nextObstacleTime: number = 0;

  constructor() {
    super('TunnelRush');
  }

  preload() {
    let graphics = this.make.graphics({});
    graphics.lineStyle(2, 0x00f2ff, 1);
    graphics.strokeRect(0, 0, 100, 100);
    graphics.generateTexture('block', 100, 100);
    graphics.destroy();
  }

  create() {
    const { width, height } = this.scale;
    this.obstacles = this.add.group();

    this.scoreText = this.add.text(20, 20, 'DEPTH: 0m', {
      fontFamily: 'JetBrains Mono',
      fontSize: '24px',
      color: '#00f2ff'
    });

    this.input.on('pointermove', (pointer: any) => {
      this.playerRotation = (pointer.x / width) * Math.PI * 2;
    });
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;

    this.score += delta * 0.05;
    this.scoreText.setText(`DEPTH: ${Math.floor(this.score)}m`);

    if (time > this.nextObstacleTime) {
      this.spawnObstacle();
      this.nextObstacleTime = time + Math.max(400, 1200 - this.score / 10);
    }

    const { width, height } = this.scale;
    const centerX = width / 2;
    const centerY = height / 2;

    this.obstacles.getChildren().forEach((obs: any) => {
      obs.scale += 0.02 + this.score / 10000;
      obs.alpha = obs.scale / 4;
      
      const angle = obs.getData('angle');
      const dist = obs.scale * 200;
      obs.x = centerX + Math.cos(angle) * dist;
      obs.y = centerY + Math.sin(angle) * dist;

      if (obs.scale > 3 && obs.scale < 3.5) {
        const diff = Math.abs((angle % (Math.PI * 2)) - (this.playerRotation % (Math.PI * 2)));
        if (diff < 0.4 || diff > Math.PI * 2 - 0.4) {
          this.gameOver();
        }
      }

      if (obs.scale > 10) obs.destroy();
    });
  }

  spawnObstacle() {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const obs = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'block')
      .setScale(0.1)
      .setAlpha(0)
      .setTint(0xbc13fe);
    obs.setData('angle', angle);
    this.obstacles.add(obs);
  }

  gameOver() {
    this.isGameOver = true;
    this.onGameOver(Math.floor(this.score));
  }
}
