<template>
  <div>
    <div>
        <span
            v-if="!loggedIn"
            :class="{'selected-tab':('My Games' === selectedTab)}"
            @click="selectedTab = 'My Games'"
            class="nh-tab nh-clickable nh-textarea">My Games</span>
      <span
          v-if="loggedIn"
          :class="{'selected-tab':('Best Times' === selectedTab)}"
          @click="selectedTab = 'Best Times'"
          class="nh-tab nh-clickable nh-textarea">Best Times</span>
      <span
          v-if="loggedIn"
          :class="{'selected-tab':('Best Turns' === selectedTab)}"
          @click="selectedTab = 'Best Turns'"
          class="nh-tab nh-clickable nh-textarea">Best Turn Count</span>
    </div>
    <table :class="{darkMode}" v-if="selectedTab === 'My Games'">
      <tr>
        <th>Player</th><th>Time</th><th>Turns</th><th></th>
      </tr>
      <tr v-for="game in games" v-bind:key="game.id">
        <td>{{game.player}}</td>
        <td>{{game.time_seconds}}</td>
        <td>{{game.turn_count}}</td>
        <td @click="$emit('replayGame', game)" class="nh-clickable">Replay</td>
      </tr>
    </table>
    <table :class="{darkMode}" v-if="selectedTab === 'Best Times'">
      <tr>
        <th>Player</th><th>Time</th><th>Turns</th><th></th>
      </tr>
      <tr v-for="game in bestTimes" v-bind:key="game.id">
        <td>{{game.player}}</td>
        <td>{{game.time_seconds}}</td>
        <td>{{game.turn_count}}</td>
        <td @click="$emit('replayGame', game)" class="nh-clickable">Replay</td>
      </tr>
    </table>
    <table :class="{darkMode}" v-if="selectedTab === 'Best Turns'">
      <tr>
        <th>Player</th><th>Time</th><th>Turns</th><th></th>
      </tr>
      <tr v-for="game in bestTurns" v-bind:key="game.id">
        <td>{{game.player}}</td>
        <td>{{game.time_seconds}}</td>
        <td>{{game.turn_count}}</td>
        <td @click="$emit('replayGame', game)" class="nh-clickable">Replay</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'NHHighScores',

  props: ['games', 'darkMode', 'bestTimes', 'bestTurns', 'loggedIn'],

    data: () => ({
      selectedTab: undefined
    }),

    created () {
      this.selectedTab = (this.loggedIn) ? 'Best Times' : 'My Games'
    },

    computed: {
    },

    methods: {
    }
  }
</script>

<style>
  td, th {
    font-weight: bold;
    padding: 0.15em 0.7em;
    border: 1px solid black;
  }
  table.darkMode td, table.darkMode th {
    border: 1px solid white;
  }
  table {
    border-collapse: collapse;
  }
  .selected-tab {
    background-color: #999;
  }
</style>
