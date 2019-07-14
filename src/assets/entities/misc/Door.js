/**
 * Created by Larken on 7/8/2017.
 */
import Game from 'src/assets/Game.js'
import Entity from 'src/assets/entities/Entity.js'

export default class Door extends Entity {
	constructor(x, y, id) {
		super(x, y, {
			name: 'door',
			id: id,
			bg: 'rgb(140, 80, 0)',
			fg: 'red',
			visible: false,
			walkable: false
		})
		this.openable = true
		this.closed = true
	}

	react() {
		if (this.closed) {
			this.openDoor()
		}
	}

	openDoor() {
		this.closed = false
		this.walkable = false
		this.visible = true
		this.id = Game.display.tileset.tileproperties[this.id].activated_id
		this.sprite.texture = Game.display.tilesetMapping[this.id]
	}

	closeDoor() {
		this.closed = true
		this.walkable = true
		this.visible = false
		this.id = Game.display.tileset.tileproperties[this.id].activated_id
		this.sprite.texture = Game.display.tilesetMapping[this.id]
	}
}
