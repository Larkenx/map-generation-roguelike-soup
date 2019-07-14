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
        <v-layout justify-center align-content-center>
          <div id="pixi_canvas" />
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Game from 'src/assets/Game'
export default {
	name: 'App',
	methods: {},
	mounted() {
		Game.initialize({ width: 1200, height: 800 })
		console.log(Game)
	}
}
</script>
