import ROT from 'rot-js'
import { randomSimplexMap } from 'src/assets/map/generation/RandomSimplex'
import GameDisplay from 'src/assets/display/GameDisplay'
import Player from 'src/assets/entities/actors/Player'
import { findStartingLocation } from 'src/assets/utils/HelperFunctions'

class Game {
	constructor() {
		this.display = null
		this.map = null
		this.engine = null
		this.scheduler = null
		this.player = null
		this.viewport = null
	}

	initialize(configuration) {
		let { width, height } = configuration
		this.display = new GameDisplay(width, height)
		this.display.mountCanvas()
		this.display.loadTextures(() => {
			this.start()
		})
	}

	start() {
		this.map = randomSimplexMap(100, 100)
		let playerStartingLocation = findStartingLocation(this.map)
		this.player = new Player({ ...playerStartingLocation })
		this.viewport = this.player
		this.display.renderMap(this.map, this.viewport)
		this.scheduleAllActors()
		this.engine.start()
	}

	scheduleAllActors() {
		this.scheduler = new ROT.Scheduler.Simple()
		for (let entity of this.map.getEntities()) {
			if (entity.act) {
				this.scheduler.add(entity, true)
			}
		}
		this.scheduler.add(this, true)
		this.engine = new ROT.Engine(this.scheduler)
	}

	act() {
		this.engine.lock()
		this.display.updateViewport(this.map, this.viewport)
		this.engine.unlock()
	}
}

export default new Game()
