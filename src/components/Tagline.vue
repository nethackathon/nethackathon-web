<template>
  <v-container v-if="tagline.length > 0">
    <v-row>
      <v-col align="center">
        <h1 :style="{fontFamily: randomFonts, color: randomColor, fontVariantCaps: randomFontVariant}">
          {{ tagline }}
        </h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import {getTagline} from "../services/signup.service";
  import {random} from "lodash/lodash";

  export default {
    name: 'Tagline',


    data: () => ({
      tagline: '',
      fonts: ['Papyrus', 'Comic Sans', 'Trajan', 'Helvetica', 'Futura'],
      colors: ['rgb(233, 81, 75)', 'rgb(148, 152, 248)', 'rgb(232, 63, 247)'],
      fontVariants: ['normal', 'small-caps', 'all-small-caps', 'petite-caps', 'tilting-caps']
    }),

    components: {
    },

    props: [],

    mounted: function () {
      getTagline().then((resp) => {
        this.tagline = resp.data.tagline
      })
    },
    
    computed: {
      randomFonts: function() {
        return `'${this.fonts[random(this.fonts.length - 1)]}', serif`
      },
      randomColor: function() {
        return this.colors[random(this.colors.length - 1)]
      },
      randomFontVariant: function() {
        return this.fontVariants[random(this.fontVariants.length - 1)]
      }
    },

    methods: {
    },
  }
</script>

<style>
</style>
