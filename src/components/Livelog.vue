<template>
  <div>
    <h1>Livelog</h1>
    <div class="nh-textarea">
      <v-textarea outlined v-model="allLivelog" readonly cols="80" rows="40"/>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Livelog',

    components: {
    },

    props: ['livelog'],

    computed: {
      allLivelog: function() {
        return [...this.livelog]
            .sort((l, m) => parseInt(m.time) - parseInt(l.time) )
            .map((l) => l.message)
            .join('\n');
      }
    },

    methods: {
    },
  }
</script>

<style>
</style>
