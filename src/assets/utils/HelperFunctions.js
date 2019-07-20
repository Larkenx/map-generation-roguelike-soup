import ROT from 'rot-js'

export function pathfinding(x, y) {
	return Game.map.inbounds(x, y) && !Game.map.getTile(x, y).blocked()
}

export function configurablePathfinding(options = {}) {
	let andConditions = []
	let orConditions = []
	andConditions.push((x, y) => {
		return Game.map.inbounds(x, y) && !Game.map.getTile(x, y).blockedByAnything()
	})
	// if we exlude the starting location, a tile is considered not blocked
	// if we're standing on it
	if (options.excludeOrigin && options.origin) {
		orConditions.push((x, y) => options.origin.x === x && options.origin.y === y)
	}

	if (options.excludeTarget && options.target) {
		orConditions.push((x, y) => options.target.x === x && options.target.y === y)
	}
	return (x, y) => andConditions.every(c => c(x, y)) || orConditions.some(c => c(x, y))
}

export function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getNormalRandomInt(min, max) {
	let gaussianRand = () => {
		let rand = 0
		for (let i = 0; i < 6; i++) rand += Math.random()

		return rand / 6
	}
	return Math.floor(min + gaussianRand() * (max - min + 1))
}

export function randomProperty(object) {
	let keys = Object.keys(object)
	return keys[Math.floor(keys.length * Math.random())]
}

export function between(a, n, b) {
	return a <= n && n <= b
}

export function within(a, n, b) {
	return a <= b + n || a >= b - n
}

export const flatten = arr => arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), [])

export function addPrefix(word) {
	const vowels = ['a', 'e', 'i', 'o', 'u']
	if (word !== 'you') {
		const someWords = [
			'trees',
			'flowers',
			'grass',
			'wild grass',
			'water',
			'steel arrows',
			'carpet',
			'logs',
			'cobwebs',
			'dirt',
			'bones',
			'gold',
			'plate legs',
			'boots'
		]
		if (someWords.includes(word.toLowerCase())) {
			return 'some ' + word
		}
		if (vowels.includes(word[0].toLowerCase())) return 'an ' + word
		else return 'a ' + word
	} else {
		return word
	}
}

export function getDiceRoll(rolls, sides) {
	let n = 0
	for (let i = 0; i < rolls; i++) {
		n += getRandomInt(1, sides)
	}
	return n
}

export function getVisibleTiles(actor, map = Game.map) {
	let { x, y } = actor
	let { range } = actor.cb
	let fov = new ROT.FOV.RecursiveShadowcasting((x, y) => {
		return map.inbounds(x, y) && map.getTile(x, y).visible()
	})

	let visibleTiles = []
	fov.compute(x, y, range, (x, y, r, visibility) => {
		if (map.inbounds(x, y)) visibleTiles.push(map.getTile(x, y))
	})
	return visibleTiles
}

export function getWeightedValue(table) {
	let rotFormat = {}
	for (let key in table) {
		rotFormat[key] = table[key].chance
	}
	return ROT.RNG.getWeightedValue(rotFormat)
}

export function neighbors({ x, y }, predicate) {
	let coords = []
	for (let dir of ROT.DIRS[8]) {
		let [dx, dy] = dir
		if (predicate(x + dx, dy + y)) coords.push({ x: x + dx, y: y + dy })
	}
	return coords
}

export function outOfBoundsOrBlocked(x, y) {
	return !Game.map.inbounds(x, y) || Game.map.getTile(x, y).blocked()
}

export function outOfBoundsOrBlockedByAnything(x, y) {
	return !Game.map.inbounds(x, y) || Game.map.getTile(x, y).blockedByAnything()
}

export function unexploredTiles(actor) {
	let allWalkableTiles = Game.map.getTiles().filter(t => !t.blocked())
	return allWalkableTiles.filter(t => !actor.seenTiles.includes(t))
}

export function floodFill(start, predicate) {
	let neighbors = [start]
	let visited = {}
	let order = 0
	while (neighbors.length > 0) {
		let v = neighbors.pop()
		visited[key(v.x, v.y)] = order++
		shuffle([...ROT.DIRS[8]]).forEach(([dx, dy]) => {
			let x = v.x + dx
			let y = v.y + dy
			if (predicate(x, y) && !visited[key(x, y)]) {
				neighbors.push({ x, y })
			}
		})
	}
	return visited
}

export function createFovDijkstraMap(start, notVisibleTiles, blockedPredicate = outOfBoundsOrBlockedByAnything) {
	const reachable = floodFill(start)
	let dijkstraMap = new ROT.Path.Dijkstra(start.x, start.y, (x, y) => !blockedPredicate(x, y) && reachable[key(x, y)])
	let distanceTransform = {}
	for (let { x, y } of notVisibleTiles) {
		let coord = key(x, y)
		distanceTransform[coord] = 0
		let steps = []
		dijkstraMap.compute(x, y, (sx, sy) => {
			steps.push({ x: sx, y: sy })
		})
		let distance = 0
		for (let step of steps) {
			distance += 1
			let stepKey = key(step.x, step.y)
			if (stepKey in distanceTransform && distance > distanceTransform[stepKey]) {
				distance = distanceTransform[stepKey]
			}
			distanceTransform[stepKey] = distance
		}
	}
	distanceTransform[key(start.x, start.y)] = Number.MAX_VALUE
	return distanceTransform
}

export function stringifyDijkstraMap(map, start, width, height) {
	let characterMap = []
	for (let y = 0; y < height; y++) {
		characterMap.push([])
		for (let x = 0; x < width; x++) {
			let character = ' '
			if (key({ x, y }) in map) {
				let distance = map[key({ x, y })]
				character = distance <= 36 ? distance.toString(36) : '!'
				if (start.x === x && start.y === y) character = '@'
			} else {
				character = Game.map.inbounds(x, y) && Game.map.getTile(x, y).blocked() ? ' ' : '.'
			}
			characterMap[y].push(character)
		}
	}
	return characterMap
}

export const key = (x, y) => {
	return x + ',' + y
}
export const unkey = k => {
	return k.split(',').map(s => parseInt(s))
}

export function computeBitmaskWalls(x, y, blockedCells) {
	let sum = 0
	let above = `${x},${y - 1}`
	let below = `${x},${y + 1}`
	let left = `${x - 1},${y}`
	let right = `${x + 1},${y}`
	let ur = `${x + 1},${y - 1}`
	let ll = `${x - 1},${y + 1}`
	let ul = `${x - 1},${y - 1}`
	let lr = `${x + 1},${y + 1}`

	let blocked = coord => {
		return !(coord in blockedCells) || blockedCells[coord]
	}

	if (blocked(above)) sum += 2
	if (blocked(right)) sum += 16
	if (blocked(below)) sum += 64
	if (blocked(left)) sum += 8
	if (blocked(ul) && blocked(above) && blocked(left)) sum += 1
	if (blocked(ur) && blocked(above) && blocked(right)) sum += 4
	if (blocked(ll) && blocked(below) && blocked(left)) sum += 32
	if (blocked(lr) && blocked(below) && blocked(right)) sum += 128
	return sum
}

export function findStartingLocation(map) {
	for (let y = 1; y <= map.height - 1; y++) {
		for (let x = 1; y <= map.width - 1; x++) {
			let surroundingTiles = neighbors({ x, y }, (tx, ty) => {
				return !map.tileAt(tx, ty).blocked()
			})
			if (surroundingTiles.length === 8) {
				return { x, y }
			}
		}
	}
	console.warn('Could not find starting location that was not blocked with the given map!')
	return { x: 0, y: 0 }
}

export const sumToTileIdMap = {
	2: 1,
	8: 2,
	10: 3,
	11: 4,
	16: 5,
	18: 6,
	22: 7,
	24: 8,
	26: 9,
	27: 10,
	30: 11,
	31: 12,
	64: 13,
	66: 14,
	72: 15,
	74: 16,
	75: 17,
	80: 18,
	82: 19,
	86: 20,
	88: 21,
	90: 22,
	91: 23,
	94: 24,
	95: 25,
	104: 26,
	106: 27,
	107: 28,
	120: 29,
	122: 30,
	123: 31,
	126: 32,
	127: 33,
	208: 34,
	210: 35,
	214: 36,
	216: 37,
	218: 38,
	219: 39,
	222: 40,
	223: 41,
	246: 36,
	248: 42,
	250: 43,
	251: 44,
	254: 45,
	255: 46,
	0: 47
}

// ╔═╗   ╦
// ║#║  ╠╬╣
// ╚═╝  ╞╩╡
export const unicodeBoxTiles = [
	['╦', '║', '═', '╝', '╝', '═', '╚', '╚'],
	['═', '╩', '╩', '╩', '═', '║', '║', '╗'],
	['╣', '╣', '╔', '╠', '╠', '╦', '╬', '╦'],
	['═', '╦', '╗', '╣', '║', '╦', '╠', '╠'],
	['╬', '╔', '╔', '╠', '║', '╦', '╬', '╬'],
	['╣', '╗', '═', '╩', '╚', '╝', '', '╬']
]

// 3D Effect
// export const unicodeBoxTiles = [
// 	//    0    1
// 	[' ', '╨', '╦', '╝', '╝', '╦', '╚', '╚'],
// 	//    7    8
// 	['╦', '╩', '╩', '╩', '╦', '╥', '║', '╗'],
// 	//    14   15
// 	['╣', '╣', '╔', '╠', '╠', '╦', ' ', ' '],
// 	//    21   22  23   24    25
// 	['╦', ' ', '╗', '╣', '║', '╦', ' ', ' '],
// 	['╬', '╔', '╔', '╠', '║', '╦', '╬', '!'],
// 	['╣', '╗', '═', '╩', '╚', '╝', ' ', ' ']
// ]
const flattenedUnixBoxTiles = unicodeBoxTiles.reduce((a, b) => a.concat(b))
export function sumToTile(sum) {
	return !(sumToTileIdMap[sum] in flattenedUnixBoxTiles) ? sum : flattenedUnixBoxTiles[sumToTileIdMap[sum]]
}

// https://stackoverflow.com/a/1484514/5051119
export function getRandomColor() {
	let letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

export function distanceTo(x1, y1, x2, y2) {
	// linear distance, no obstacles factored in
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

export function manhattanDistanceTo(x1, y1, x2, y2) {
	return Math.abs(y2 - y1) + Math.abs(x2 - x1)
}

export function chebyshevDistanceTo(x1, y1, x2, y2) {
	return Math.max(Math.abs(y2 - y1), Math.abs(x2 - x1))
}

export function shuffle(a) {
	let j, x, i
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1))
		x = a[i]
		a[i] = a[j]
		a[j] = x
	}
	return a
}

export function midpoint(c1, c2) {
	return (c1 + c2) / 2
}
