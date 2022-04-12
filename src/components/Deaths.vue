<template>
  <div>
    <h1>{{ (ascensions) ? 'Ascensions' : 'Deaths' }}</h1>
    <ul>
      <li v-for="death in deaths" v-bind:key="death.time">{{ death.message }}</li>
      <li v-if="deaths.length === 0">None... yet.</li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: 'Deaths',

    components: {
    },

    props: ['livelog', 'ascensions'],

    computed: {
      deaths: function() {
        return [...this.livelog]
            .filter((l) => {
              return ( 
                  l.type === '16384' &&
                  ( (  this.ascensions && l.message.includes('ascended') ) ||
                  ( !this.ascensions && !l.message.includes('ascended') ) )
              )
            })
            .sort((l, m) => parseInt(m.time) - parseInt(l.time) )
      }
    },

    methods: {
    },
  }
</script>

<style>
</style>
