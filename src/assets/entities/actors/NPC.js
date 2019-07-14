/**
 * Created by larken on 7/12/17.
 */

import { Actor } from 'src/assets/entities/actors/Actor.js'
import { getRandomInt } from 'src/assets/utils/HelperFunctions'

import ROT from 'rot-js'

export default class NPC extends Actor {
	constructor(x, y, id) {
		super(x, y, {
			id: id,
			bg: 'orange',
			name: 'non-player character',
			visible: true,
			walkable: false,
			cb: {
				hostile: false
			}
		})
		this.wanders = false
		this.dialogData = null
		this.dialogBubbleEnabled = false
	}

	react(actor) {
		if (this.dialogData !== null) {
			Game.openNPCDialog(this.dialogData)
		} else if (this.wanders) {
			// you can swap places with this NPC
			let nx = actor.x
			let ny = actor.y
			actor.move(this.x, this.y)
			this.move(nx, ny)
		}
	}

	act() {
		Game.engine.lock()
		if (this.wanders && getRandomInt(1, 2) === 1) {
			let dx = this.x + getRandomInt(-1, 1)
			let dy = this.y + getRandomInt(-1, 1)
			this.tryMove(dx, dy)
		}
		Game.engine.unlock()
	}
}
