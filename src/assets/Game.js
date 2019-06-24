import ROT from 'rot-js'
import { randomSimplexMap } from '@/assets/map/generation/RandomSimplex'
import GameDisplay from '@/assets/display/GameDisplay'
import SimpleViewportHandler from '@/assets/handlers/SimpleViewportHandler'

class Game {
	constructor() {
		this.display = null
		this.map = null
		this.engine = null
		this.scheduler = null
		this.viewport = { x: 0, y: 0 }
	}

	initialize(configuration) {
		let { width, height } = configuration
		this.display = new GameDisplay(width, height)
		this.display.mountCanvas()
		this.display.loadTextures(() => {
			this.map = randomSimplexMap(100, 100)
			this.display.renderMap(this.map, { viewPortX: this.viewport.x, viewPortY: this.viewport.y })
			this.scheduleAllActors()
			this.engine.start()
		})
	}

	scheduleAllActors() {
		this.scheduler = new ROT.Scheduler.Simple()
		for (let entity of this.map.getEntities()) {
			if (entity.act) {
				this.scheduler.add(entity, true)
			}
		}
		this.scheduler.add(this, true)
		this.scheduler.add(new SimpleViewportHandler(), true)
		this.engine = new ROT.Engine(this.scheduler)
	}

	act() {
		this.engine.lock()
		this.display.updateViewport(this.map, { viewPortX: this.viewport.x, viewPortY: this.viewport.y })
		this.engine.unlock()
	}
}

export default new Game()
