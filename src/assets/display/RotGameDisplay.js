import ROT from 'rot-js'

export default class RotGameDisplay {
	constructor(width, height) {
		this.width = width
		this.height = height
		this.screen = new ROT.Display({ width, height, fontSize: 20, fontFamily: 'Fira Code', forceSquareRatio: true })
	}

	mountCanvas() {
		document.getElementById('pixi_canvas').innerHTML = ''
		document.getElementById('pixi_canvas').appendChild(this.screen.getContainer())
	}

	renderMap(map, player) {
		console.log(player.x, player.y)
		this.screen.clear()
		let camera = {
			// camera x,y resides in the upper left corner
			x: player.x - ~~(this.width / 2),
			y: player.y - ~~(this.height / 2),
			width: this.width,
			height: this.height
		}
		let startingPos = [camera.x, camera.y]
		if (camera.x < 0) {
			startingPos[0] = 0
		}
		if (camera.x + camera.width >= map.width) {
			startingPos[0] = map.width - camera.width
		}
		if (camera.y <= 0) {
			startingPos[1] = 0
		}
		if (camera.y + camera.height >= map.height) {
			startingPos[1] = map.height - camera.height
		}
		let endingPos = [startingPos[0] + camera.width, startingPos[1] + camera.height]
		let dx = 0
		let dy = 0
		for (let x = startingPos[0]; x < endingPos[0]; x++) {
			for (let y = startingPos[1]; y < endingPos[1]; y++) {
				let tile = map.getTile(x, y)
				for (let entity of tile.entities) {
					if (!Object.is(player, entity)) {
						if (entity.glyph) {
							let { character, fg, bg } = entity.glyph
							this.screen.draw(x - startingPos[0], y - startingPos[1], character, fg, bg)
						}
					}
				}
				dy++
			}
			dy = 0
			dx++
		}
		let { character, fg, bg } = player.glyph
		this.screen.draw(player.x - startingPos[0], player.y - startingPos[1], character, fg, bg)
	}
}
