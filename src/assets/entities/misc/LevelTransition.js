import Game from 'src/assets/Game.js'
import Entity from 'src/assets/entities/Entity.js'

export default class LevelTransition extends Entity {
	constructor(x, y, id) {
		super(x, y, {
			id: id,
			name: 'path',
			description: 'A path leading to a new area!',
			fg: 'brown',
			bg: 'orange',
			walkable: false,
			visible: true
		})
		this.portal = null
	}

	act() {}

	react(actor) {
		// Game.log(`You leave the ${Game.currentLevel.name} and go to the ${this.portal}.`, 'information')
		Game.changeLevels(this.portal)
	}
}
