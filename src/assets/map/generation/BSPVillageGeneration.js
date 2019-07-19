import { floodFill, key, getRandomColor, unkey, distanceTo, manhattanDistanceTo } from 'src/assets/utils/HelperFunctions'
import { biomeTypes } from 'src/assets/map/generation/RandomSimplex'
import ROT from 'rot-js'
import Entity from 'src/assets/entities/Entity'
import Glyph from 'src/assets/display/Glyph'
/* http://www.roguebasin.com/index.php?title=Basic_BSP_Dungeon_generation
  Find a suitable location to place a village given a large enough square plot of land by partitioning it over and over again (BSP)
  Step by step, given a pre-constructed game map (a simplex-noise landscape with terrain, metadata will mark elevation of tiles):

  1. Perform a flood fill of tiles to discover joined together tiles at the same elevation(in our case, simply finding tiles in the same biome may be sufficient)

  2. Find the largest plot of continuous, square land in the same flood filled area

  3. Form a grid, from (x1,y1) to (x2,y2) - a sub-selection of the existing gamemap

  4. While the grid width & height are less than the minimum room dimensions x2,
  split the grid vertically or horizontally at random, always maintaining the minimum room dimensions

  5. Once the binary partitioning is complete (we have fully partitioned the grid to the minimum room dimensions throughout the original plot of land),
  we can then try to place rooms (buildings, houses, town construction like wells, stairs, towers, etc) in our partitions. Each room can be a prefab structure with minor random attributes.

  6. It's important that all of these structures are reachable to each other structure, so that one could feasibly visit each structure & so that possible
  residents of the village can wander freely from building to building. To that end, we'll want to essentially find each "opening" to each structure and make sure they're all
  accessible in some way. possibly minimum spanning tree from door to door of each structure?

  7. Finally, we can construct roads through each town by simply doing a horizontal and vertical line test to see if we bump into any walls / construction we placed in step 5/6, and if not
  we can lay down a road there that to cut through the entire town
  comments:
  problem I'm sort of having right now is that flood fill usually ends up going from one end to the map :smiley:
so the "upper left" and "lower right" coordinates of my flood fill are the entire map, and not a good grid for beginning BSP
above shows breaking down that flood fill even more based on elevation, but again they often stretch from one end of the map to the other
bet I can add a condition to my flood fill function here that stops if it's x tiles away from the start
adding a max distance from the start of the flood fill is giving really promising results... (exclamation marks with different colors represent possible areas for village generation)

*/

let bspVisualizationObstacle = (x, y, fg, bg = 'transparent') => {
	return new Entity({
		x,
		y,
		glyph: new Glyph({
			character: '*',
			fg,
			bg
		}),
		walkable: true,
		blocksVision: false,
		name: 'Test!',
		description: 'Test!'
	})
}

let startObstacle = (x, y, fg, bg = 'transparent') => {
	return new Entity({
		x,
		y,
		glyph: new Glyph({
			character: '*',
			fg,
			bg
		}),
		walkable: true,
		blocksVision: false,
		name: 'Test!',
		description: 'Test!'
	})
}

function suitableTile(tile) {
	let { biome, elevation } = tile.metadata
	return biome === biomeTypes.GRASSLAND //&& elevation > 0.8
}

function colorizeFloodFilledAreas(gameMap, possibleAreas, renderNonsuitableTiles = false) {
	// Each possible area at this point is ATLEAST minwidth x minheight, and not connected by a single tile
	for (let grid of possibleAreas) {
		let { upperLeft, lowerRight, width, height } = grid
		let a = getRandomColor()
		let b = getRandomColor()
		let c = getRandomColor()
		for (let y = upperLeft.y; y < height; y++) {
			for (let x = upperLeft.x; x < width; x++) {
				let tile = gameMap.tileAt(x, y)
				let { biome, elevation } = tile.metadata
				if (suitableTile(tile) || renderNonsuitableTiles) {
					tile.entities = [bspVisualizationObstacle(x, y, a)]
					// if (elevation >= 1 && elevation <= 2) {
					// } else if (elevation >= 2 && elevation <= 3) {
					// 	tile.entities = [bspVisualizationObstacle(x, y, b)]
					// } else if (elevation >= 3 && elevation <= 4) {
					// 	tile.entities = [bspVisualizationObstacle(x, y, c)]
					// }
				}
			}
		}
	}
}

function colorizeFloodFillAlgorithm(gameMap, tiles, start) {
	let sortedTiles = tiles.sort((a, b) => b.order - a.order)
	console.log(tiles.length)
	let i = 0
	let r = 0
	let g = 0
	let b = 255
	for (let tile of sortedTiles) {
		let { x, y, order } = tile
		if (~~(i / 255) === 0) {
			r++
			b--
		} else if (~~(i / 255) === 1) {
			g++
			r--
		} else if (~~(i / 255) === 2) {
			g--
			b++
		} else if (~~(i / 255) === 3) {
			r++
			b--
		}
		i++
		let color = ROT.Color.toHex([r, g, b])
			.replace('#', '0x')
			.toString(16)
		gameMap.tileAt(x, y).entities = [bspVisualizationObstacle(x, y, color)]
	}
	gameMap.tileAt(start.x, start.y).entities = [startObstacle(start.x, start.y, '#ffffff')]
}

function getPossibleVillageAreas(gameMap, options) {
	let { minWidth, minHeight, maxDistance } = options
	let possibleAreas = []
	let grasslandTiles = gameMap.getTiles().filter(tile => suitableTile(tile))
	while (grasslandTiles.length > 0) {
		let start = grasslandTiles.pop()
		let floodFillCondition = (x, y) => {
			return (
				gameMap.inbounds(x, y) && suitableTile(gameMap.tileAt(x, y)) && manhattanDistanceTo(x, y, start.x, start.y) <= maxDistance
			)
		}
		let connectedTilesMap = floodFill(start, floodFillCondition)
		let connectedTiles = Object.keys(connectedTilesMap).map(k => {
			let [x, y] = unkey(k)
			return { x, y, order: connectedTilesMap[k] }
		})
		let xCoords = connectedTiles.map(tile => tile.x)
		let yCoords = connectedTiles.map(tile => tile.y)
		let x1 = Math.min(...xCoords)
		let y1 = Math.min(...yCoords)
		let x2 = Math.max(...xCoords)
		let y2 = Math.max(...yCoords)
		let width = x2 - x1
		let height = y2 - y1
		if (minWidth <= width && minHeight <= height) {
			let details = {
				upperLeft: {
					x: x1,
					y: y1
				},
				lowerRight: {
					x: x2,
					y: y2
				},
				width,
				height,
				area: width * height,
				connectedTiles,
				start
			}
			possibleAreas.push(details)
		}
		grasslandTiles = grasslandTiles.filter(tile => !(key(tile.x, tile.y) in connectedTilesMap))
	}
	return possibleAreas
}

export function createVillages(gameMap) {
	let possibleAreas = getPossibleVillageAreas(gameMap, {
		minWidth: 7,
		minHeight: 7,
		maxDistance: 22
	})

	if (possibleAreas.length > 0) {
		// colorizeFloodFilledAreas(gameMap, possibleAreas)
		let largestArea = possibleAreas.reduce((previous, current) => {
			return previous.area > current.area ? previous : current
		})

		// colorizeFloodFilledAreas(gameMap, [largestArea])
		colorizeFloodFillAlgorithm(gameMap, largestArea.connectedTiles, largestArea.start)
	}

	return gameMap
}
