import Tile, { getTileInfo } from '@/assets/map/Tile.js'
import { getRandomInt } from '@/assets/utils/HelperFunctions.js'

export class GameMap {
	constructor(width, height, name) {
		this.name = name
		this.loadedIDS = []
		this.playerLocation = null // this field is used exclusively for saving the player's last location before they change levels
		this.width = width
		this.height = height
		this.data = new Array(this.height) // stores all tiles in the game
		this.visible_tiles = {}
		this.seen_tiles = {}
		this.visited = false
		this.dungeon = null
		// Intialize all of the tiles...
		for (let i = 0; i < this.height; i++) {
			this.data[i] = new Array(this.width)
			for (let j = 0; j < this.width; j++) {
				this.data[i][j] = new Tile(j, i)
			}
		}
	}

	getActors() {
		let actors = []
		for (let row of this.data) {
			for (let tile of row) {
				actors = actors.concat(tile.actors)
			}
		}
		return actors
	}

	getTile(x, y) {
		return this.data[y][x]
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
