<template>
  <div>
    <div class="mb-2">
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
    <NHScoreTable
        v-if="selectedTab === 'My Games'"
        :games="games"
        :dark-mode="darkMode"
        @replayGame="(game) => $emit('replayGame', game)"
    />
    <NHScoreTable
        v-if="selectedTab === 'Best Times'"
        :games="bestTimes"
        :dark-mode="darkMode"
        @replayGame="(game) => $emit('replayGame', game)"
    />
    <NHScoreTable
        v-if="selectedTab === 'Best Turns'"
        :games="bestTurns"
        :dark-mode="darkMode"
        @replayGame="(game) => $emit('replayGame', game)"
    />
  </div>
</template>

<script>
import NHScoreTable from './NHScoreTable'

export default {
  name: 'NHHighScores',

  components: {
    NHScoreTable
  },

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
