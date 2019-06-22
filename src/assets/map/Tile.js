export default class Tile {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.actors = []
		this.obstacles = []
		this.metadata = {}
	}

	blockedByAnyObstacle() {
		return this.obstacles.some(o => o.blocked)
	}

	blockedByAnything() {
		return this.obstacles.some(o => o.blocked) || this.actors.some(actor => actor.blocked && !actor.openable && !actor.locked)
	}

	blockedByObstacle() {
		if (this.obstacles.length > 0) return this.obstacles[this.obstacles.length - 1].blocked
		return false
	}

	removeBlockedObstacles() {
		this.obstacles = this.obstacles.filter(o => !o.blocked)
	}

	visible() {
		return !(
			this.obstacles.some(el => {
				return el.blocks_vision
			}) ||
			this.actors.some(el => {
				return !el.blocks_vision
			})
		)
	}

	removeActor(a) {
		let idx = this.actors.findIndex(actor => {
			return Object.is(a, actor)
		})
		this.actors.splice(idx, 1)
	}
}
