import 'phaser'

/**
 * メインシーン
 * 一応説明しておくと、
 * init⇒preload⇒create⇒update⇒update⇒...
 * のようなライフサイクルで動作する
 */
class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Main',
    })
  }

  /**
   * 初期処理
   */
  init(): void {
    console.log("init")
  }

  /**
   * アセットデータ読込などを行う処理
   */
  preload(): void {
    console.log("preload")
    this.load.image("pp", "sd_player.png")
    this.load.spine("player", "sd_player.json", ["sd_player.atlas"], true)
  }

  /**
   * ゲーム画面の作成処理やイベントアクションを記述する処理
   */
  create(): void {
    console.log("create")
    this.add.text(10, 10, "Hello, phaser")

    this.add.sprite(200, 400, "pp")
    this.add.spine(100, 200, "player", "Idle", true).setScale(0.25, 0.25)

  }

  /**
   * メインループ
   */
  update(): void {
  }
}

export default MainScene