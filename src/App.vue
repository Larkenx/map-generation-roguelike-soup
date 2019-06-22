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
// import { mapState, mapMutations } from 'vuex'
import PixiRenderer from '@/components/PixiRenderer'

export default {
	name: 'App',
	components: {
		PixiRenderer
	},
	// computed: mapState(['map']),
	methods: {},
	created() {}
}
</script>
