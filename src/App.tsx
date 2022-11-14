
import { CSSProperties, useEffect } from 'react';
// import 'phaser'
import 'phaser/plugins/spine/dist/SpinePlugin'
import MainScene from './game/main';

// Phaserの設定
const config: Phaser.Types.Core.GameConfig = {
  width: 1280,
  height: 720,
  type: Phaser.AUTO,
  pixelArt: false,
  backgroundColor: 0xcdcdcd,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_VERTICALLY,
    parent: 'game',
    fullscreenTarget: 'game'
  },

  // ここで読み込むシーンを取得する
  // 今回は軽いテストなので、MainSceneのみ
  scene: [MainScene],

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: true
    }
  },

  // Spineを使用
  plugins: {
    scene: [
      { key: 'SpinePlugin', plugin: SpinePlugin, mapping: 'spine' }
    ]
  }
}

/**
 * PhaserのGameを生成するためのクラス
 */
class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

/**
 * ゲームを描写するDivコンポーネント
 */
const App: React.FC<{ className?: string }> = ({ className }) => {
  // お手軽にCSSの設定（フルスクリーンで、Canvasを中央寄せにする）
  const style: CSSProperties = {
    width: "100vw",
    height: "100vh",
    textAlign: "center"
  }

  // 画面の発描写時に実行する
  // 画面の終了時にはGameをDestroyする
  useEffect(() => {
    const g = new Game(config)

    return () => {
      g?.plugins.removeScenePlugin('SpinePlugin')
      g?.destroy(true)
    }
  }, []);


  // canvasをAppendするdivコンポーネント
  return (
    <div id="game" className={className} style={style}>
    </div >
  )
}

export default App;
