import Tile from 'src/assets/map/Tile.js'

export class GameMap {
	constructor(width, height, name) {
		this.name = name
		this.width = width
		this.height = height
		this.data = new Array(this.height) // stores all tiles in the game
		// Intialize all of the tiles...
		for (let i = 0; i < this.height; i++) {
			this.data[i] = new Array(this.width)
			for (let j = 0; j < this.width; j++) {
				this.data[i][j] = new Tile(j, i)
			}
		}
	}

	getEntities() {
		let entities = []
		for (let row of this.data) {
			for (let tile of row) {
				entities = entities.concat(tile.entities)
			}
		}
		return entities
	}

	getTile(x, y) {
		return this.data[y][x]
	}

	tileAt(x, y) {
		return this.getTile(x, y)
	}

	at(x, y) {
		this.getTile(x, y)
	}

	getTiles() {
		return this.data.reduce((prev, column) => prev.concat(column))
	}

	inbounds(x, y) {
		return !(x < 0 || x >= this.width || y < 0 || y >= this.height)
	}

	mapTiles(fn) {
		return this.data.map(row => {
			return row.map(tile => fn(tile))
		})
	}

	forEachTile(fn) {
		return this.data.forEach(row => {
			return row.forEach(tile => fn(tile))
		})
	}
}
