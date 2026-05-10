import * as Phaser from 'phaser';
import { DesertRunnerScene } from './DesertRunner';
import { SpaceShooterScene } from './SpaceShooter';
import { HighwayRacerScene } from './HighwayRacer';
import { TunnelRushScene } from './TunnelRush';
import { CubeDashScene } from './CubeDash';
import { ZombieSurvivalScene } from './ZombieSurvival';

export function initGame(gameId: string, parent: HTMLElement, onGameOver: (score: number) => void): Phaser.Types.Core.GameConfig {
  let SceneClass: any;

  switch (gameId) {
    case 'desert-runner': SceneClass = DesertRunnerScene; break;
    case 'space-shooter': SceneClass = SpaceShooterScene; break;
    case 'highway-racer': SceneClass = HighwayRacerScene; break;
    case 'tunnel-rush': SceneClass = TunnelRushScene; break;
    case 'cube-dash': SceneClass = CubeDashScene; break;
    case 'zombie-survival': SceneClass = ZombieSurvivalScene; break;
    default: SceneClass = DesertRunnerScene;
  }

  const sceneInstance = new SceneClass();
  sceneInstance.onGameOver = onGameOver;

  return {
    type: Phaser.AUTO,
    parent: parent,
    width: parent.clientWidth,
    height: parent.clientHeight,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false
      }
    },
    scene: sceneInstance,
    backgroundColor: '#000000',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };
}
