import ROT from 'rot-js'
import Game from '@/assets/Game'

export default class SimpleViewportHandler {
	keyTimer = null
	keyMap = {
		// Arrow Pad
		[ROT.VK_RIGHT]: 2,
		[ROT.VK_LEFT]: 6,
		[ROT.VK_UP]: 0,
		[ROT.VK_DOWN]: 4,
		// Numpad Movement
		[ROT.VK_NUMPAD8]: 0,
		[ROT.VK_NUMPAD9]: 1,
		[ROT.VK_NUMPAD6]: 2,
		[ROT.VK_NUMPAD3]: 3,
		[ROT.VK_NUMPAD2]: 4,
		[ROT.VK_NUMPAD1]: 5,
		[ROT.VK_NUMPAD4]: 6,
		[ROT.VK_NUMPAD7]: 7,
		// vi movement
		[ROT.VK_H]: 6,
		[ROT.VK_U]: 1,
		[ROT.VK_L]: 2,
		[ROT.VK_N]: 3,
		[ROT.VK_J]: 4,
		[ROT.VK_B]: 5,
		[ROT.VK_K]: 0,
		[ROT.VK_Y]: 7,
		[107]: 'zoomin',
		[109]: 'zoomout'
	}

	handleEvent(evt) {
		if (evt.getModifierState('Control') || evt.metaKey) return
		evt.preventDefault()
		let { keyCode } = evt
		let shiftPressed = evt.getModifierState('Shift')
		let movementKeys = [0, 1, 2, 3, 4, 5, 6, 7]
		if (!(keyCode in this.keyMap)) {
			// invalid key press, retry turn
			return
		}
		if (evt.type === 'keydown' && movementKeys.includes(this.keyMap[keyCode])) {
			if (this.keyTimer === null) {
				this.keyTimer = new Date()
			} else {
				let start = this.keyTimer.getTime()
				let now = new Date().getTime()
				if (!(now - start >= 50)) {
					return
				} else {
					// we've waited long enough, but add another timer just in case
					this.keyTimer = new Date()
				}
			}
		}
		const action = this.keyMap[keyCode]
		if (action === 'zoomin') {
			Game.display.scale += 0.25
			Game.display.rescale(Game.display.scale)
		} else if (action === 'zoomout') {
			if (Game.display.scale > 0.25) {
				Game.display.scale -= 0.25
				Game.display.rescale(Game.display.scale)
			}
		} else if (movementKeys.includes(action)) {
			let diff = ROT.DIRS[8][action]
			let ny = Game.viewport.y + diff[1]
			let nx = Game.viewport.x + diff[0]
			if (Game.map.inbounds(nx, ny)) {
				Game.viewport.y = ny
				Game.viewport.x = nx
				this.endTurn()
			}
		}
	}

	act() {
		Game.engine.lock()
		window.addEventListener('keydown', this)
	}

	endTurn() {
		window.removeEventListener('keydown', this)
		Game.engine.unlock()
	}
}
