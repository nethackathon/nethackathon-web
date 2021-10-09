<template>
  <table :class="{darkMode}">
    <tr v-if="games.length === 0">
      <td>No games found.</td>
    </tr>
    <tr v-if="games.length > 0">
      <th>Player</th><th>Time</th><th>Turns</th><th></th>
    </tr>
    <tr v-for="game in games" v-bind:key="game.id">
      <td>{{game.player}}</td>
      <td>{{game.time_seconds}}</td>
      <td>{{game.turn_count}}</td>
      <td @click="$emit('replayGame', game)" class="nh-clickable">Replay</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'NHScoreTable',

  props: ['games', 'darkMode'],
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
</style>
