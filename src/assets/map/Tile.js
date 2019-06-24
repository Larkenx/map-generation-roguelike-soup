export default class Tile {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.entities = []
		this.metadata = {}
	}

	blocked() {
		return this.entities.some(o => o.blocked)
	}

	visible() {
		return !this.entities.some(el => {
			return el.blocksVision
		})
	}

	removeActor(entity) {
		let idx = this.entities.findIndex(element => {
			return Object.is(entity, element)
		})
		this.entities.splice(idx, 1)
	}
}
