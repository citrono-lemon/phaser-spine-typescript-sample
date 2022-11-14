import 'phaser'
import './SpineContainer'

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
    const wallColor = 0x456789
    const wall = this.physics.add.staticGroup()
    wall.addMultiple([
      this.add.rectangle(0, 0, W, offset, wallColor).setOrigin(0, 0),
      this.add.rectangle(0, 0, offset, H, wallColor).setOrigin(0, 0),
      this.add.rectangle(W - offset, 0, offset, H, wallColor).setOrigin(0, 0),
    ])
    const platformColor = 0x345678
    const platform = this.physics.add.staticGroup(
      this.add.rectangle(0, H - offset, W, H, platformColor).setOrigin(0, 0),
    )

    // プレイヤー
    const spineObject = this.add.spineContainer(200, 300, "player", "Idle2", true)
    spineObject.spine.setScale(2, 2)
      .setMix("Idle2", "Jump", 0.1)
      .setMix("Idle2", "Walk", 0.1)
      .setMix("Walk", "Jump", 0.1)
      .setMix("Jump", "Idle2", 0.1)
    const body = spineObject.body as Phaser.Physics.Arcade.Body
    spineObject.setPhysicsSize(body.width * 1, body.height * 1)

    const player = this.physics.add.group(spineObject)
    console.log(player)

    // プレイヤーとブロックの衝突を追加
    this.physics.add.collider(wall, player, undefined, undefined, this)

    // プレイヤーと床の衝突を追加
    this.physics.add.collider(platform, player, (plfm, plyr) => {
      if (spineObject.spine.state.getCurrent(0).animation.name == "Jump") {
        spineObject.spine.state.setAnimation(0, "Idle2", true)
        const body = plyr.body as Phaser.Physics.Arcade.Body
        body.setVelocityX(0)
      }
    }, undefined, this)

    // 左右移動とジャンプの追加
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (p.position.x > spineObject.x) {
        spineObject.faceDirection(1)
        player.setVelocityX(300)
      }
      else {
        spineObject.faceDirection(-1)
        player.setVelocityX(-300)
      }
      if (spineObject.spine.state.getCurrent(0).animation.name != "Jump") {
        spineObject.spine.state.setAnimation(0, "Walk", true)
      }
    }).on("pointerup", () => {
      if (spineObject.spine.state.getCurrent(0).animation.name != "Jump") {
        player.setVelocityY(-400)
        spineObject.spine.state.setAnimation(0, "Jump", true)
      }
    })
  }

  /**
   * メインループ
   */
  update(): void {
  }
}

export default MainScene