import * as Phaser from 'phaser';
import {Player} from './player';
import {RockHit} from '../data/rock-hit';
import {Promise} from 'es6-promise';

export class Rock extends Phaser.Sprite {
    private readyToHit : boolean = false;
    private rockHit: RockHit;
    private promiseHit: Function;

    constructor(game : Phaser.Game, private player : Player) {
        super(game, player.position.x, player.position.y, 'rock');

        this.game = game;
        this.anchor.setTo(0.5, 0.5);

        this.setStartState();
    }

    update() {
        if (!this.rockHit) {
            return true;
        }

        if (Phaser.Rectangle.contains(this.body, this.rockHit.toPoint.x, this.rockHit.toPoint.y)) {
            this.body.velocity.setTo(0, 0);
            this.promiseHit();
            this.game.add.tween(this)
                .to({ alpha: 0 }, 300, Phaser.Easing.Linear.None)
                .start()
                .onComplete
                    .addOnce(() => {
                        this.setStartState();
                    });
        }
    }

    public hit(rockHit: RockHit) : Promise<any> {
        this.readyToHit = false;
        this.rockHit = rockHit;
        this.visible = true;
        this.alpha = 1;
        this.scale.set(.15, .15);


        let units = 1000;
        let pixelPerSeconds = Math.max(units, units * (this.rockHit.power / units));

        this.game.physics.arcade.moveToXY(this, rockHit.toPoint.x, rockHit.toPoint.y, pixelPerSeconds);

        return new Promise((resolve) => this.promiseHit = resolve);
    }

    public isReadyToHit() : boolean {
        return this.readyToHit;
    }

    private setStartState() {
        this.position.x = this.player.position.x;
        this.position.y = this.player.position.y;
        this.visible = false;
        this.rockHit = null;
        this.readyToHit = true;
    }

}
