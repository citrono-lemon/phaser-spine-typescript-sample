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
    // public/assets へパスを設定する
    this.load.setPath("assets")
    this.load.image("pp", "sd_player.png")
    this.load.spine("player", "sd_player.json", ["sd_player.atlas"], true)
  }

  /**
   * ゲーム画面の作成処理やイベントアクションを記述する処理
   */
  create(): void {
    console.log("create")

    // 壁
    const offset = 40
    const [W, H] = [this.cameras.main.width, this.cameras.main.height]
    const platformColor = 0x456789
    const platform = this.physics.add.staticGroup()
    platform.addMultiple([
      this.add.rectangle(0, H - offset, W, H, platformColor).setOrigin(0, 0),
      this.add.rectangle(0, 0, W, offset, platformColor).setOrigin(0, 0),
      this.add.rectangle(0, 0, offset, H, platformColor).setOrigin(0, 0),
      this.add.rectangle(W - offset, 0, offset, H, platformColor).setOrigin(0, 0),
    ])

    // プレイヤー
    const playerPos = { x: 240, y: 500 }
    const spineObject = this.add.spine(playerPos.x, playerPos.y, "player", "Idle2", true)
      .setScale(1, 1)
      //.setSize(40, 100, playerPos.x - 20, H - playerPos.y - 100 - 5)
      .setMix("Idle2", "Jump", 0.3)
      .setMix("Idle2", "Walk", 0.3)
      .setMix("Walk", "Jump", 0.3)
      .setMix("Jump", "Idle2", 0.3)
    const player = this.physics.add.group(spineObject)

    // プレイヤーと床の衝突を追加
    this.physics.add.collider(platform, player, (plfm, plyr) => {
      if (spineObject.state.getCurrent(0).animation.name == "Jump") {
        spineObject.state.setAnimation(0, "Idle2", true)
        player.setVelocityX(0)
      }
    }, undefined, this)

    // 左右移動ボタンとジャンプの追加

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (p.position.x > spineObject.x) {
        spineObject.setScale(1, 1)
        player.setVelocityX(300)
      }
      else {
        spineObject.setScale(-1, 1)

        player.setVelocityX(-300)
      }
      spineObject.state.setAnimation(0, "Walk", true)
    }).on("pointerup", () => {
      player.setVelocityY(-500)
      spineObject.state.setAnimation(0, "Jump", true)
    })
  }

  /**
   * メインループ
   */
  update(): void {
  }
}

export default MainScene