import LSystem from 'lindenmayer'
import GameMap from '../GameMap'

let width = 100
let height = 100
let output = new Array(height)
for (let i = 0; i < height; i++) {
	output[i].push(new Array(width))
	for (let j = 0; j < width; j++) {
		output[i][j] = ' '
	}
}

let startX = width / 2
let startY = height / 2
let maxRoadLength = height

let x = iter => {
	return startX
}
let village = new LSystem({
	axiom: 'V',
	productions: {
		V: 'H|H',
		H: 'V-V'
	},
	finals: {
		'|': () => {
			let roadLength = maxRoadLength / (village.iterations + 1)
		}
	}
})
