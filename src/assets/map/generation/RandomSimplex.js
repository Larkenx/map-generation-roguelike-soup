/**
 * Created by larken on 7/4/17.
 */
import ROT from 'rot-js'
import SimplexNoise from 'simplex-noise'
import RNG from 'prng-parkmiller-js'
import { GameMap } from 'src/assets/map/GameMap.js'
import { getRandomInt, getNormalRandomInt, randomProperty, between, flatten } from 'src/assets/utils/HelperFunctions.js'
import { obstacleTypes, ObstacleFactory } from 'src/assets/entities/obstacles/Obstacles'

export const biomeTypes = {
	OCEAN: 'OCEAN',
	COASTAL: 'COASTAL',
	GRASSLAND: 'GRASSLAND',
	FOREST: 'FOREST',
	LOW_MOUNTAIN: 'LOW_MOUNTAIN',
	HIGH_MOUNTAIN: 'HIGH_MOUNTAIN',
	SWAMP: 'SWAMP',
	TUNDRA: 'TUNDRA'
}

const biomes = {
	[biomeTypes.OCEAN]: {
		[obstacleTypes.DEEP_WATER]: 1
	},
	[biomeTypes.COASTAL]: {
		[obstacleTypes.SHALLOW_WATER]: 1
	},
	[biomeTypes.SWAMP]: {
		[obstacleTypes.TALL_GRASS]: 50,
		[obstacleTypes.DIRT]: 10
	},
	[biomeTypes.GRASSLAND]: {
		[obstacleTypes.GRASS]: 50,
		[obstacleTypes.FOREST_TREE]: 5,
		[obstacleTypes.SHRUB]: 5,
		[obstacleTypes.FLOWER]: 5,
		[obstacleTypes.BUSH]: 5
	},
	[biomeTypes.FOREST]: {
		[obstacleTypes.GRASS]: 25,
		[obstacleTypes.FOREST_TREE]: 50,
		[obstacleTypes.SHRUB]: 10
	},
	[biomeTypes.HILL]: {
		[obstacleTypes.HILL]: 10,
		[obstacleTypes.DIRT]: 10,
		[obstacleTypes.HILL_TREE]: 5
	},
	[biomeTypes.TUNDRA]: {
		[obstacleTypes.ROCK]: 15,
		[obstacleTypes.HILL_TREE]: 5
	},
	[biomeTypes.LOW_MOUNTAIN]: {
		[obstacleTypes.LOW_MOUNTAIN]: 1
	},
	[biomeTypes.HIGH_MOUNTAIN]: {
		[obstacleTypes.HIGH_MOUNTAIN]: 1
	}
}

let seed1 = 908234
let seed2 = 798465
let rng1 = RNG.create(seed1)
let rng2 = RNG.create(seed2)
let gen1 = new SimplexNoise(rng1.nextDouble.bind(rng1))
let gen2 = new SimplexNoise(rng2.nextDouble.bind(rng2))
let frequency = 0.8

const elevationNoise = (nx, ny) => {
	return gen1.noise2D(nx, ny) / 2 + 0.5
}

export function getElevation(x, y, width, height) {
	let nx = x / width - 0.5,
		ny = y / height - 0.5
	let e =
		1.0 * elevationNoise(frequency * 1 * nx, frequency * 1 * ny) +
		0.5 * elevationNoise(frequency * 2 * nx, frequency * 2 * ny) +
		0.25 * elevationNoise(frequency * 4 * nx, frequency * 4 * ny) +
		0.13 * elevationNoise(frequency * 8 * nx, frequency * 8 * ny) +
		0.06 * elevationNoise(frequency * 16 * nx, frequency * 16 * ny) +
		0.03 * elevationNoise(frequency * 32 * nx, frequency * 32 * ny)
	e /= 1.0 + 0.5 + 0.25 + 0.13 + 0.06 + 0.03
	e = Math.pow(e, 5.0)
	return e * 100
}

export const getBiome = e => {
	if (e <= 0.3) {
		return biomeTypes.OCEAN
	} else if (e <= 0.5) {
		return biomeTypes.COASTAL
	} else if (e <= 0.7) {
		return biomeTypes.SWAMP
	} else if (e <= 4) {
		console.log(~~e)
		return biomeTypes.GRASSLAND
	} else if (e <= 12) {
		return biomeTypes.FOREST
	} else if (e <= 18) {
		return biomeTypes.HILL
	} else if (e <= 22) {
		return biomeTypes.TUNDRA
	} else if (e <= 25) {
		return biomeTypes.LOW_MOUNTAIN
	} else if (e > 25) {
		return biomeTypes.HIGH_MOUNTAIN
	}
}

export const getMoisture = (x, y) => {
	let nx = x / width - 0.5,
		ny = y / height - 0.5
	let m =
		1.0 * moistureNoise(1 * nx, 1 * ny) +
		0.75 * moistureNoise(2 * nx, 2 * ny) +
		0.33 * moistureNoise(4 * nx, 4 * ny) +
		0.33 * moistureNoise(8 * nx, 8 * ny) +
		0.33 * moistureNoise(16 * nx, 16 * ny) +
		0.5 * moistureNoise(32 * nx, 32 * ny)
	m /= 1.0 + 0.75 + 0.33 + 0.33 + 0.33 + 0.5
	return m
}

export function randomSimplexMap(width, height) {
	// we want to zoom in a lot so that the land is larger, so the width & height will be half
	let gameMap = new GameMap(width, height)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			// Find what the elevation & prescribed biome is for this tile
			let elevation = getElevation(x, y, width, height)
			let biome = getBiome(elevation)
			// Get a new type of appropriate flora/fauna for this biome
			let obstacleType = ROT.RNG.getWeightedValue(biomes[biome])
			let newObstacle = ObstacleFactory.create(obstacleType, { x, y })
			let tile = gameMap.tileAt(x, y)
			tile.entities.push(newObstacle)
			tile.metadata = {
				biome,
				elevation
			}
		}
	}

	console.log(gameMap)

	return gameMap
}
