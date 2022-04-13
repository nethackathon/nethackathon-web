<template>
<pre class="trophy">
{{before}}
   ___________
  '._==_==_=_.'
  .-\:      /-.
 | (|:.     |) |
  '-|:.     |-'
    \::.    /
     '::. .'
       ) (
     _.' '._
    `"""""""` 
{{after}}
</pre>
</template>

<script>

export default {
  name: 'Trophy',

  data: () => ({
  }),

  components: {
  },

  props: {
    before: {
      type: String,
      default: ''
    },
    after: {
      type: String,
      default: ''
    }
  },

  mounted: function () {
  },

  computed: {
  },

  methods: {
  },
}
</script>

<style>
.trophy {
  display: inline;
  white-space: pre;
  margin: 0 auto;
}
</style>
