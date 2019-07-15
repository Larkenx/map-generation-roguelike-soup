import Game from 'src/assets/Game.js'

class EntityInstantiationError extends Error {
	constructor(message) {
		super(message)
		this.name = 'EntityInstantiationError'
	}
}

/* Entities are in-game objects that exist in the map. They have symbols,
 * foregrounds, backgrounds, descriptions, names, visibility, and blocked properties. */
export default class Entity {
	requiredProperties = ['x', 'y', 'name', 'glyph', 'walkable', 'blocksVision']

	constructor(options) {
		let hasProp = (prop, map) => prop in map
		if (this.requiredProperties.some(prop => !hasProp(prop, options))) {
			throw new EntityInstantiationError(`Missing one of required properties in given options: ${JSON.stringify(options)}`)
		}

		Object.assign(this, options)
	}

	move(nx, ny) {
		let ntile = Game.map.tileAt(ny, nx) // new tile to move to
		let ctile = Game.map.tileAt(this.y, this.x) // current tile
		ctile.removeActor(this) // remove this actor from this tile
		ntile.entities.push(this) // add this actor to the new tile
		this.x = nx // update x,y coords to new coords
		this.y = ny
	}

	placeAt(nx, ny) {
		let ntile = Game.map.tileAt(nx, ny) // new tile to move to
		ntile.entities.push(this) // add this actor to the new tile
		this.x = nx
		this.y = ny
	}
}
