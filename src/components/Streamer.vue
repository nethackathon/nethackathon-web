<template>
  <span>
    <span v-bind:class="{featured: streamer.featured}"><a class="streamer" :href="channelHref" target="_blank">{{streamer.channel}}</a></span><span v-if="concatenate && index < streamersLength - 2">, </span><span v-if="concatenate && index === streamersLength - 2">, and </span>
  </span>
</template>

<script>
  export default {
    name: 'Streamer',

    props: ['streamer', 'concatenate', 'index', 'streamersLength'],

    data: () => ({
    }),

    computed: {
      channelHref: function () {
        return 'https://twitch.tv/' + this.streamer.channel
      }
    }
  }
</script>

<style>
  .featured {
    font-weight: bold;
  }

  a.streamer {
    text-decoration: none;
    color: black !important;
  }

  a:hover.streamer {
    text-decoration: underline;
    color: black !important;
  }
</style>
