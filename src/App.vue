<style>
html {
	overflow: auto;
	background-color: #303030;
}
</style>


<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vampire Life RL</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-layout
        justify-center
        fill-height
      >
        <PixiRenderer />
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import ROT from 'rot-js'
import { mapState, mapMutations } from 'vuex'
import PixiRenderer from '@/components/PixiRenderer'
import { LOAD_MAP } from '@/store'
import { key, unkey, getRandomInt, sumToTile, computeBitmaskWalls } from '@/assets/utils/utils'

const width = 50
const height = 50

class Glyph {
	constructor(character, fg = '#ffffff', bg = 'transparent') {
		this.character = character
		this.fg = fg.replace('#', '0x').toString(16)
		this.bg = bg
	}
}

export default {
	name: 'App',
	components: {
		PixiRenderer
	},
	computed: mapState(['map']),
	methods: {
		...mapMutations({
			loadMap: LOAD_MAP
		}),
		getCharacter(x, y, map) {
			if (map[key(x, y)]) {
				return sumToTile(computeBitmaskWalls(x, y, map))
			} else if (!map[key(x, y)]) return '.'
		},
		generateMap() {
			let map = new ROT.Map.Rogue(width, height)
			this.blockedCells = {}
			let mapGeneratorCallback = (x, y, blocked) => {
				this.blockedCells[key(x, y)] = blocked || x >= width || y >= height
				this.blockedCells[key(x, y)] = this.blockedCells[key(x, y)]
			}
			map.create(mapGeneratorCallback)
			this.createMapFromBlockedCells()
		},
		createMapFromBlockedCells() {
			let colors = {
				Black: '#090200',
				Blue: '#00a0e4',
				BrightBlack: '#5b5754',
				BrightBlue: '#7f7c7b',
				BrightCyan: '#ccab53',
				BrightGreen: '#3a3332',
				BrightMagenta: '#d6d4d3',
				BrightRed: '#e8bacf',
				BrightWhite: '#f7f7f7',
				BrightYellow: '#494542',
				Cyan: '#b5e4f4',
				Green: '#00a152',
				Magenta: '#a06994',
				Red: '#da2c20',
				White: '#a4a1a1',
				Yellow: '#fcec02'
			}
			if (this.selectedColors) {
				colors = { ...this.selectedColors }
			}
			let entities = [
				new Glyph('@', colors.Yellow),
				new Glyph('g', colors.Green),
				new Glyph('r', colors.Blue),
				new Glyph('t', colors.BrightGreen),
				new Glyph('b', colors.BrightMagenta),
				new Glyph('$', colors.Yellow),
				new Glyph('>', colors.BrightRed),
				new Glyph('<', colors.BrightRed),
				new Glyph('e', colors.Cyan),
				new Glyph('m', colors.Magenta),
				new Glyph('w', colors.Blue),
				new Glyph('j', colors.BrightCyan),
				new Glyph('!', colors.BrightMagenta),
				new Glyph('?', colors.BrightMagenta),
				new Glyph('[', colors.BrightGreen),
				new Glyph(')', colors.BrightGreen),
				new Glyph('%', colors.BrightRed)
			]
			let result = []
			let freeCells = []
			let entityPlacements = {}
			const popRandomElement = arr => {
				if (arr.length !== 0) {
					let index = getRandomInt(0, arr.length - 1)
					return arr.splice(index, 1)[0]
				}
			}

			for (let y = 0; y < height; y++) {
				result.push([])
				for (let x = 0; x < width; x++) {
					const blocked = this.blockedCells[key(x, y)]
					if (!blocked) {
						freeCells.push([x, y])
					}
					result[y].push(new Glyph(this.getCharacter(x, y, this.blockedCells), blocked ? colors.BrightWhite : colors.BrightBlack))
				}
			}

			while (freeCells.length > 0 && entities.length > 0) {
				let [x, y] = popRandomElement(freeCells)
				let entity = popRandomElement(entities)
				console.log(`Placing '${entity.character}' at ${x},${y}`)
				result[y][x] = entity
			}

			this.loadMap(result)
		}
	},
	data() {
		return {
			blockedCells: {}
		}
	},
	created() {
		this.generateMap()
	}
}
</script>
