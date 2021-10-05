<template>
  <div class="nh-item-type">
    <span class="nh-item-symbol" v-for="type in types" v-bind:key="type.symbol" :style="'color: ' + type.color + ';'" :title="type.notes">
      {{type.symbol}}&nbsp;
    </span>
  </div>
</template>

<script>
export default {
  name: 'NHPriceIdTypes',

  props: ['types'],
  /*
    types: [
      { symbol:'?', color: '#FFF', notes: 'confuse monster, destroy armor, fire, food detection, gold detection, magic mapping, scare monster, teleportation' },
      { symbol:'!', color: '#FF55FF', notes: 'confusion, extra healing, hallucination, healing, restore ability, sleeping' },
      { symbol:'=', color: '#FFFF55', notes: 'adornment, hunger, protection, protection from shape changers, stealth, sustain ability, warning' },
      { symbol:'/', color: '#00AAAA', notes: 'light, nothing' },
    ]
   */

    data: () => ({
    }),

    computed: {
    },

    methods: {
    }
  }
</script>

<style>
.nh-item-type {
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
  font-weight: bolder;
  background-color: #121212;
  padding-left: 0.5em;
  padding-right: 0.5em;
}
.nh-item-symbol {
  cursor: pointer;
}
</style>
