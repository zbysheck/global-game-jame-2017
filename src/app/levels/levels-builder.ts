import {Obstacle} from '../sprites/obstacle';
import {Boat} from '../sprites/Boat';
import {FinishZone} from '../sprites/finish-zone';
import {LevelBase} from './level-base';

export class LevelBuilder {
    private boats: Boat[] = [];
    private obstacles: Obstacle[] = [];
    private finishZone: FinishZone;

    constructor(private levelNumber: number, private game: Phaser.Game) {
    }

    withBoats(boatsPositions: { x: number, y: number }[]): LevelBuilder {
        this.boats = boatsPositions.map(dim => {
            const boat = new Boat(this.game, dim.x, dim.y);

            this.game.add.existing(boat);
            this.game.physics.p2.enable(boat);

            boat.setupBody();

            return boat;
        });

        return this;
    }

    withObstacles(obstacles: Obstacle[]): LevelBuilder {
        this.obstacles = obstacles;

        return this;
    }

    withFinishZone(zonePosition: { x: number, y: number }): LevelBuilder {
        this.finishZone = new FinishZone(this.game, zonePosition.x, zonePosition.y);

        return this;
    }

    build(): LevelBase {
        return new LevelBase(this.levelNumber, this.boats, this.obstacles, this.finishZone, this.game);
    }
}
