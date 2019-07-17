import { floodFill, key, getRandomColor, unkey, distanceTo } from 'src/assets/utils/HelperFunctions'
import { biomeTypes } from 'src/assets/map/generation/RandomSimplex'
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

let bspVisualizationObstacle = (x, y, color) => {
	return new Entity({
		x,
		y,
		glyph: new Glyph({
			character: '!',
			fg: color
		}),
		walkable: true,
		blocksVision: false,
		name: 'Test!',
		description: 'Test!'
	})
}

let suitableTile = tile => {
	let { biome, elevation } = tile.metadata
	return biome === biomeTypes.GRASSLAND
}

let colorizeFloodFilledAreas = (gameMap, possibleAreas) => {
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
				if (suitableTile(tile)) {
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

export function createVillages(gameMap) {
	let minWidth = 7
	let minHeight = 7
	let maxDistance = 30
	let possibleAreas = []
	let grasslandTiles = gameMap.getTiles().filter(tile => suitableTile(tile))
	while (grasslandTiles.length > 0) {
		let start = grasslandTiles.pop()
		let floodFillCondition = (x, y) => {
			return gameMap.inbounds(x, y) && suitableTile(gameMap.tileAt(x, y)) && distanceTo(x, y, start.x, start.y) <= maxDistance
		}
		let connectedTilesMap = floodFill(start, floodFillCondition)
		let connectedTiles = Object.keys(connectedTilesMap).map(k => unkey(k))
		let xCoords = connectedTiles.map(tile => tile[0])
		let yCoords = connectedTiles.map(tile => tile[1])
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
				height
			}
			possibleAreas.push(details)
		}
		grasslandTiles = grasslandTiles.filter(tile => !(key(tile.x, tile.y) in connectedTilesMap))
	}

	colorizeFloodFilledAreas(gameMap, possibleAreas)

	return gameMap
}
