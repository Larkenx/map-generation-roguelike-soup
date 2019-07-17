import * as PIXI from 'pixi.js'
PIXI.utils.skipHello()
// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const convertToUnicode = altCode => {
	// prettier-ignore
	const unicode = [ 0x0000, 0x263A, 0x263B, 0x2665, 0x2666, 0x2663, 0x2660, 0x2022, 0x25D8, 0x25CB, 0x25D9, 0x2642, 0x2640, 0x266A, 0x266B, 0x263C, 0x25BA, 0x25C4, 0x2195, 0x203C, 0x00B6, 0x00A7, 0x25AC, 0x21A8, 0x2191, 0x2193, 0x2192, 0x2190, 0x221F, 0x2194, 0x25B2, 0x25BC, 0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025, 0x0026, 0x0027, 0x0028, 0x0029, 0x002A, 0x002B, 0x002C, 0x002D, 0x002E, 0x002F, 0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 0x0038, 0x0039, 0x003A, 0x003B, 0x003C, 0x003D, 0x003E, 0x003F, 0x0040, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047, 0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F, 0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 0x0059, 0x005A, 0x005B, 0x005C, 0x005D, 0x005E, 0x005F, 0x0060, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067, 0x0068, 0x0069, 0x006A, 0x006B, 0x006C, 0x006D, 0x006E, 0x006F, 0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077, 0x0078, 0x0079, 0x007A, 0x007B, 0x007C, 0x007D, 0x007E, 0x007F, 0x00C7, 0x00FC, 0x00E9, 0x00E2, 0x00E4, 0x00E0, 0x00E5, 0x00E7, 0x00EA, 0x00EB, 0x00E8, 0x00EF, 0x00EE, 0x00EC, 0x00C4, 0x00C5, 0x00C9, 0x00E6, 0x00C6, 0x00F4, 0x00F6, 0x00F2, 0x00FB, 0x00F9, 0x00FF, 0x00D6, 0x00DC, 0x00A2, 0x00A3, 0x00A5, 0x20A7, 0x0192, 0x00E1, 0x00ED, 0x00F3, 0x00FA, 0x00F1, 0x00D1, 0x00AA, 0x00BA, 0x00BF, 0x2310, 0x00AC, 0x00BD, 0x00BC, 0x00A1, 0x00AB, 0x00BB, 0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x2561, 0x2562, 0x2556, 0x2555, 0x2563, 0x2551, 0x2557, 0x255D, 0x255C, 0x255B, 0x2510, 0x2514, 0x2534, 0x252C, 0x251C, 0x2500, 0x253C, 0x255E, 0x255F, 0x255A, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256C, 0x2567, 0x2568, 0x2564, 0x2565, 0x2559, 0x2558, 0x2552, 0x2553, 0x256B, 0x256A, 0x2518, 0x250C, 0x2588, 0x2584, 0x258C, 0x2590, 0x2580, 0x03B1, 0x00DF, 0x0393, 0x03C0, 0x03A3, 0x03C3, 0x00B5, 0x03C4, 0x03A6, 0x0398, 0x03A9, 0x03B4, 0x221E, 0x03C6, 0x03B5, 0x2229, 0x2261, 0x00B1, 0x2265, 0x2264, 0x2320, 0x2321, 0x00F7, 0x2248, 0x00B0, 0x2219, 0x00B7, 0x221A, 0x207F, 0x00B2, 0x25A0, 0x00A0]
	if (altCode < unicode.length) return unicode[altCode]
}

const tilesets = [
	{
		name: '16x16-sb-ascii.png',
		url: 'images/tilesets/transparent/16x16-sb-ascii.png',
		imageWidth: 256,
		imageHeight: 256,
		spriteWidth: 16,
		spriteHeight: 16
	}
]

export default class GameDisplay {
	constructor(width, height) {
		this.width = width
		this.height = height
		this.scale = 1.0
		this.app = new PIXI.Application({
			// forceCanvas: true,
			width: this.width,
			height: this.height,
			antialias: false,
			// transparent: true,
			powerPreference: 'high-performance',
			backgroundColor: 0x2a5250
		})
		this.app.backgroundColor = 0x2a5250
		this.app.ticker.stop()
		this.gameView = null
		this.textureMap = {}
		this.selectedTileset = tilesets[0]
		this.movingSprites = []
	}

	mountCanvas() {
		document.getElementById('pixi_canvas').innerHTML = ''
		document.getElementById('pixi_canvas').appendChild(this.getContainer())
	}

	handleAssetLoad(loader, resource) {
		let { stage, renderer } = this.app
		this.clear()
		// let graphics = new PIXI.Graphics()
		let cx = renderer.width / 2
		let cy = renderer.height / 2
		// let barLength = renderer.width / 2
		let text = new PIXI.Text(`Loading ${resource.name}... ${Math.floor(loader.progress)}%`, {
			fill: 0xffffff,
			fontSize: 16,
			fontFamily: ['Source Code Pro', 'Menlo', 'Consolas'],
			x: cx,
			y: cy
		})
		stage.addChild(text)
	}

	loadTextures(done) {
		PIXI.loader.reset()
		PIXI.loader
			.add(tilesets)
			.on('progress', (loader, resource) => this.handleAssetLoad(loader, resource))
			.load((loader, resources) => {
				this.generateTextures()
				done()
			})
	}

	generateTextures() {
		this.textureMap = {}
		for (let tileset of tilesets) {
			const { spriteWidth, spriteHeight, name } = tileset
			this.textureMap[name] = {}
			for (let i = 0; i <= 255; i++) {
				const character = String.fromCharCode(convertToUnicode(i))
				const coords = this.getTilesetCoords(i, spriteWidth, spriteHeight, 16)
				const frame = new PIXI.Rectangle(coords[0], coords[1], spriteWidth, spriteHeight)
				const texture = new PIXI.Texture(PIXI.loader.resources[tileset.name].texture, frame)
				this.textureMap[name][character] = texture
			}
		}
	}

	rescale(ratio) {
		let newTileSize = this.selectedTileset.spriteWidth * ratio
		if (newTileSize % 2 === 0) {
			this.app.stage.scale.x = this.app.stage.scale.y = ratio
		}
	}

	renderOnTick(delta) {
		for (let obj of this.movingSprites)
			if (obj.sprite.x === obj.target.x && obj.sprite.y === obj.target.y)
				this.movingSprites = this.movingSprites.filter(o => o.sprite !== obj.sprite)

		for (let obj of this.movingSprites) {
			let { sprite, target } = obj
			let x = 0
			let y = 0
			let distX = Math.abs(sprite.x - target.x)
			let distY = Math.abs(sprite.y - target.y)
			let shouldSlowDown = (distX <= 12 && distX !== 0) || (distY <= 12 && distY !== 0)
			let movementSpeed = shouldSlowDown ? 2.0 : 4.0
			if (target.x > sprite.x) x = movementSpeed
			if (target.x < sprite.x) x = -movementSpeed
			if (target.y > sprite.y) y = movementSpeed
			if (target.y < sprite.y) y = -movementSpeed
			if (Math.abs(x) > distX) x = distX
			if (Math.abs(y) > distY) y = distY
			obj.currentTime += delta
			sprite.position.set(sprite.x + x, sprite.y + y)
		}
	}

	getTilesetCoords(index, tileWidth, tileHeight, columns) {
		let rowNumber = Math.floor(index / columns) * tileHeight
		let colNumber = (index % columns) * tileWidth
		return [colNumber, rowNumber]
	}

	calculateViewport(options) {
		let { x, y, map } = options
		let { spriteWidth, spriteHeight } = this.selectedTileset
		let viewPort = { width: this.width / (spriteWidth * this.scale), height: this.height / (spriteHeight * this.scale) }
		let camera = {
			// camera x,y resides in the upper left corner
			x: x - ~~(viewPort.width / 2),
			y: y - ~~(viewPort.height / 2),
			width: Math.ceil(viewPort.width),
			height: viewPort.height
		}
		let startingPos = [camera.x, camera.y]
		if (camera.x < 0) {
			// far left
			startingPos[0] = 0
		}
		if (camera.x + camera.width > map.width) {
			// far right
			startingPos[0] = map.width - camera.width
		}
		if (camera.y <= 0) {
			// at the top of the map
			startingPos[1] = 0
		}
		if (camera.y + camera.height > map.height) {
			// at the bottom of the map
			startingPos[1] = map.height - camera.height
		}
		return startingPos
	}

	renderMap(map, player) {
		let { renderer, stage } = this.app
		let { spriteWidth, spriteHeight } = this.selectedTileset
		// this.app.ticker.add(delta => this.renderOnTick(delta))
		stage.removeChildren()
		this.gameView = new PIXI.Container()
		let viewport = {
			width: this.width / (spriteWidth * this.scale),
			height: this.height / (spriteHeight * this.scale)
		}

		let camera = {
			// camera x,y resides in the upper left corner
			x: player.x - ~~(viewport.width / 2),
			y: player.y - ~~(viewport.height / 2),
			width: viewport.width,
			height: viewport.height
		}
		let startingPos = [camera.x, camera.y]
		if (camera.x < 0) {
			startingPos[0] = 0
		}
		if (camera.x + camera.width >= map.width) {
			startingPos[0] = map.width - camera.width
			if (startingPos[0] < 0) startingPos[0] = 0
		}
		if (camera.y <= 0) {
			startingPos[1] = 0
		}
		if (camera.y + camera.height >= map.height) {
			startingPos[1] = map.height - camera.height
			if (startingPos[1] < 0) startingPos[1] = 0
		}
		let endingPos = [startingPos[0] + camera.width, startingPos[1] + camera.height]
		if (endingPos[0] > map.width) {
			endingPos[0] = map.width
		}
		if (endingPos[1] > map.height) endingPos[1] = map.height
		let dx = 0
		let dy = 0
		for (let x = startingPos[0]; x < endingPos[0]; x++) {
			for (let y = startingPos[1]; y < endingPos[1]; y++) {
				let tile = map.getTile(x, y)
				for (let entity of tile.entities) {
					if (!Object.is(entity, player) && (player.x !== x || player.y !== y)) {
						if (entity.glyph) {
							// TODO: Add support for animated glyphs
							let { character, fg, bg } = entity.glyph
							let sprite = new PIXI.Sprite(this.getTexture(character))
							sprite.tint = fg
							sprite.position.set((x - startingPos[0]) * spriteWidth, (y - startingPos[1]) * spriteHeight)
							this.gameView.addChild(sprite)
						}
					}
				}
				dy++
			}
			dy = 0
			dx++
		}
		let { character, fg, bg } = player.glyph
		let playerSprite = new PIXI.Sprite(this.getTexture(character))
		playerSprite.tint = fg
		playerSprite.position.set((player.x - startingPos[0]) * spriteWidth, (player.y - startingPos[1]) * spriteHeight)
		this.gameView.addChild(playerSprite)
		stage.addChild(this.gameView)
		this.app.renderer.render(this.app.stage)
	}

	updateViewport(map, viewport) {
		let { spriteWidth, spriteHeight } = this.selectedTileset
		let cameraStart = this.calculateViewport({ map, ...viewport })
		this.gameView.position.set(-cameraStart[0] * spriteWidth, -cameraStart[1] * spriteHeight)
		this.moveSprite(this.gameView, -cameraStart[0], -cameraStart[1])
		this.app.renderer.render(this.app.stage)
	}

	getTexture(character) {
		return this.textureMap[this.selectedTileset.name][character]
	}

	moveSprite(sprite, x, y, options = { animate: true, duration: 500 }) {
		let { animate, duration } = options
		// used to smoothly pan the map from its curent location to a new one
		// by adding it to the list of sprites who should smoothly progress towards some location
		let nx = x * this.tileSize
		let ny = y * this.tileSize
		if (animate) {
			let existingMovementObject = this.movingSprites.filter(o => {
				return o.sprite === sprite
			})
			if (existingMovementObject.length > 0) {
				// sprite.position.set(nx, ny)
				this.movingSprites = this.movingSprites.filter(o => {
					return o.sprite !== sprite
				})
			}

			this.movingSprites.push({ sprite, target: { x: nx, y: ny }, start: new Date().getTime(), duration })
		} else {
			sprite.position.set(nx, ny)
		}
	}

	removeChild(sprite) {
		this.gameView.removeChild(sprite)
	}

	getContainer() {
		return this.app.view
	}

	clear() {
		this.app.stage.removeChildren()
	}
}
