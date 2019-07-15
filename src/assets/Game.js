import ROT from 'rot-js'
import { randomSimplexMap } from 'src/assets/map/generation/RandomSimplex'
import GameDisplay from 'src/assets/display/GameDisplay'
import Player from 'src/assets/entities/actors/Player'
import { findStartingLocation } from 'src/assets/utils/HelperFunctions'
import RotGameDisplay from 'src/assets/display/RotGameDisplay'

class Game {
	constructor() {
		this.display = null
		this.map = null
		this.engine = null
		this.scheduler = null
		this.player = null
		this.viewport = null
		this.messageHistory = []
		this.tempMessages = []
		this.eventStream = null
	}

	initialize(configuration) {
		let { width, height } = configuration
		// this.display = new RotGameDisplay(20, 20)
		this.display = new GameDisplay(width, height)
		this.display.mountCanvas()
		this.display.loadTextures(() => {
			this.start()
		})
		this.start()
	}

	start() {
		this.map = randomSimplexMap(100, 100)
		let playerStartingLocation = findStartingLocation(this.map)
		this.player = new Player({ ...playerStartingLocation })
		this.player.placeAt(this.player.x, this.player.y)
		this.display.renderMap(this.map, this.player)
		this.scheduleAllActors()
		this.engine.start()
	}

	scheduleAllActors() {
		this.scheduler = new ROT.Scheduler.Simple()
		this.scheduler.add(this, true)
		for (let entity of this.map.getEntities()) {
			if (entity.act) {
				this.scheduler.add(entity, true)
			}
		}
		this.engine = new ROT.Engine(this.scheduler)
	}

	act() {
		this.engine.lock()
		this.display.renderMap(this.map, this.player)
		this.engine.unlock()
	}

	log(message, type, tmp = false) {
		let message_color = {
			defend: 'lightblue',
			magic: '#6757c6',
			attack: 'red',
			death: 'crimson',
			information: 'yellow',
			player_move: '#878787',
			level_up: 'green',
			alert: 'orange'
		}
		let color = type in message_color ? message_color[type] : type
		if (tmp) this.tempMessages.splice(0, 1, [message, color])
		else this.messageHistory.push([message, color])
	}

	clearTempLog() {
		this.tempMessages.splice(0, this.tempMessages.length)
	}
}

const globalGameState = new Game()

window.Game = globalGameState
export default globalGameState
