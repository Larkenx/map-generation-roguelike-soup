import Entity from '../Entity'
import { Glyph } from '../traits/index'

import COLOR from '../../utils/theme'

export const obstacleTypes = {
	DIRT: 'DIRT',
	SHALLOW_WATER: 'SHALLOW_WATER',
	FOREST_TREE: 'FOREST_TREE',
	GRASS: 'GRASS',
	SHRUB: 'SHRUB',
	TALL_GRASS: 'TALL_GRASS',
	BUSH: 'BUSH',
	FLOWER: 'FLOWER',
	LOW_MOUNTAIN: 'LOW_MOUNTAIN',
	HIGH_MOUNTAIN: 'HIGH_MOUNTAIN',
	HILL: 'HILL',
	DEEP_WATER: 'DEEP_WATER',
	ROCK: 'ROCK'
}

const obstacleDefinitions = {
	[obstacleTypes.DIRT]: {
		glyph: new Glyph({
			character: '.',
			fg: COLOR.BROWN
		})
	},
	[obstacleTypes.SHALLOW_WATER]: {
		glyph: new Glyph({
			character: '~',
			fg: COLOR.BLUE
		})
	},
	[obstacleTypes.FOREST_TREE]: {
		glyph: new Glyph({
			character: '↑',
			fg: COLOR.DARK_GREEN
		})
	},
	[obstacleTypes.GRASS]: {
		glyph: new Glyph({
			character: '.',
			fg: COLOR.GREEN
		})
	},
	[obstacleTypes.SHRUB]: {
		glyph: new Glyph({
			character: "'",
			fg: COLOR.BRIGHT_GREEN
		})
	},
	[obstacleTypes.FLOWER]: {
		glyph: new Glyph({
			character: ',',
			fg: COLOR.BRIGHT_GREEN
		})
	},
	[obstacleTypes.BUSH]: {
		glyph: new Glyph({
			character: '"',
			fg: COLOR.BRIGHT_GREEN
		})
	},
	[obstacleTypes.TALL_GRASS]: {
		glyph: new Glyph({
			character: String.fromCharCode(0x2320), // '?'
			fg: COLOR.BRIGHT_GREEN
		})
	},
	[obstacleTypes.ROCK]: {
		glyph: new Glyph({
			character: '.',
			fg: COLOR.WHITE
		})
	},
	[obstacleTypes.HILL]: {
		glyph: new Glyph({
			character: '^',
			fg: COLOR.BROWN
		})
	},
	[obstacleTypes.LOW_MOUNTAIN]: {
		glyph: new Glyph({
			character: String.fromCharCode(0x25b2),
			fg: COLOR.GRAY
		})
	},
	[obstacleTypes.HIGH_MOUNTAIN]: {
		glyph: new Glyph({
			character: String.fromCharCode(0x25b2),
			fg: COLOR.WHITE
		})
	},
	[obstacleTypes.DEEP_WATER]: {
		glyph: new Glyph({
			character: '≈',
			fg: COLOR.DARK_BLUE
		})
	}
}

export const obstacleFactory = (obstacleType, configuration) => {
	if (!(obstacleType in obstacleTypes)) {
		console.trace('Unknown obstacle creation: ', obstacleType)
		throw new Error('Unknown obstacle creation: ')
	}

	let defaultConfiguration = obstacleDefinitions[obstacleType]
	return new Entity({ ...defaultConfiguration, ...configuration })
}
