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
      <v-container fill-height>
        <v-layout
          justify-center
          align-content-center
        >
          <PixiRenderer />
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import ROT from 'rot-js'
import { mapState, mapMutations } from 'vuex'
import PixiRenderer from '@/components/PixiRenderer'
import { LOAD_MAP } from '@/store'
import { randomSimplexMap } from '@/assets/map/generation/RandomSimplex'

const width = 50
const height = 50

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
		generateMap() {
			this.loadMap(randomSimplexMap(width, height, 0.5))
		}
	},
	created() {
		this.generateMap()
	}
}
</script>
