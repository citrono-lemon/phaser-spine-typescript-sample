/// <reference path="../../node_modules/phaser/types/SpineFile.d.ts" />
/// <reference path="../../node_modules/phaser/types/SpineGameObject.d.ts" />
/// <reference path="../../node_modules/phaser/types/SpinePlugin.d.ts" />

declare namespace Phaser.GameObjects {
  interface GameObjectFactory {
    spineContainer(x: number, y: number, key: string, anim: string, loop?: boolean): ISpineContainer
  }

  interface Container {
    add(go: SpineGameObject): Phaser.GameObjects.Container
  }
}
