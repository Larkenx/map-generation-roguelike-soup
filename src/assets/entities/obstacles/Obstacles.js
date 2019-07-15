import Entity from 'src/assets/entities/Entity'
import Glyph from 'src/assets/display/Glyph'
import Colors from 'src/assets/utils/Colors'

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
	HILL_TREE: 'HILL_TREE',
	DEEP_WATER: 'DEEP_WATER',
	ROCK: 'ROCK'
}

const obstacleDefinitions = {
	[obstacleTypes.HILL_TREE]: {
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.',
		glyph: new Glyph({
			character: '↑',
			fg: Colors.DARKER_GREEN
		}),
		walkable: false,
		blocksVision: false
	},
	[obstacleTypes.DIRT]: {
		glyph: new Glyph({
			character: '.',
			fg: Colors.BROWN
		}),
		walkable: true,
		blocksVision: true,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.SHALLOW_WATER]: {
		glyph: new Glyph({
			character: '~',
			fg: Colors.BLUE
		}),
		walkable: true,
		blocksVision: true,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.FOREST_TREE]: {
		glyph: new Glyph({
			character: '↑',
			fg: Colors.DARK_GREEN
		}),
		walkable: true,
		blocksVision: false,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.GRASS]: {
		glyph: new Glyph({
			character: '.',
			fg: Colors.GREEN
		}),
		walkable: true,
		blocksVision: true,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.SHRUB]: {
		glyph: new Glyph({
			character: "'",
			fg: Colors.BRIGHT_GREEN
		}),
		walkable: true,
		blocksVision: true,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.FLOWER]: {
		glyph: new Glyph({
			character: ',',
			fg: Colors.BRIGHT_GREEN
		}),
		walkable: true,
		blocksVision: true,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.BUSH]: {
		glyph: new Glyph({
			character: '"',
			fg: Colors.BRIGHT_GREEN
		}),
		walkable: true,
		blocksVision: true,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.TALL_GRASS]: {
		glyph: new Glyph({
			character: String.fromCharCode(0x2320), // '?'
			fg: Colors.BRIGHT_GREEN
		}),
		walkable: true,
		blocksVision: true,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.ROCK]: {
		glyph: new Glyph({
			character: '.',
			fg: Colors.WHITE
		}),
		walkable: true,
		blocksVision: true,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.HILL]: {
		glyph: new Glyph({
			character: '^',
			fg: Colors.BROWN
		}),
		walkable: false,
		blocksVision: false,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.LOW_MOUNTAIN]: {
		glyph: new Glyph({
			character: String.fromCharCode(0x25b2),
			fg: Colors.GRAY
		}),
		walkable: false,
		blocksVision: false,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.HIGH_MOUNTAIN]: {
		glyph: new Glyph({
			character: String.fromCharCode(0x25b2),
			fg: Colors.WHITE
		}),
		walkable: false,
		blocksVision: false,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	},
	[obstacleTypes.DEEP_WATER]: {
		glyph: new Glyph({
			character: '≈',
			fg: Colors.DARK_BLUE
		}),
		walkable: false,
		blocksVision: false,
		name: 'Hill Tree',
		description: 'A tree commonly found in hillier, more temperate climates.'
	}
}

export class ObstacleFactory {
	static create(obstacleType, configuration) {
		if (!(obstacleType in obstacleTypes)) {
			console.trace('Unknown obstacle creation: ', obstacleType)
			throw new Error('Unknown obstacle creation: ')
		}

		let defaultConfiguration = obstacleDefinitions[obstacleType]
		return new Entity({ ...defaultConfiguration, ...configuration })
	}
}
