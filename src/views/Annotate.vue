<template>
  <v-container fluid>
    <!-- CharPicker @pickChar="pickChar" :color="passwordColor" :character="passwordCharacter"/>
    TODO: Use CharPicker and ColorPicker to password protect per-character
    <ColorPicker @pickColor="pickColor" :color="passwordColor"/ -->
    <v-row>
      <v-col cols="2">
        <div class="nh-textarea">
          <h3>Intrinsics</h3>
        </div>
        <NHCheckbox
            v-for="intrinsic in localData.intrinsics"
            @clicked="updateIntrinsic(intrinsic)"
            v-bind:key="intrinsic.name"
            :checked="intrinsic.value"
            :label="intrinsic.name"
        />
        <NHProtection
            :protection="localData.protection"
            @changed="updateProtection"
        />
        <v-divider class="mt-5 mb-16"/>
        <NHButton label="Reset" @clicked="resetAnnotate"/>
      </v-col>
      <v-col cols="10">
        <div class="nh-textarea">
          <h3>Notes</h3>
          <v-textarea outlined v-model="localData.notes" @keydown="updateNotes" cols="80" rows="24"/>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PALETTE from "../includes/palette"
// import INTRINSICS from "../includes/intrinsics"
// import CharPicker from "../components/CharPicker"
// import ColorPicker from "../components/ColorPicker"
import NHCheckbox from "../components/NHCheckbox"
import {update, read, reset} from "../services/annotate.service"
import { debounce } from "debounce"
import NHProtection from "../components/NHProtection";
import NHButton from "../components/NHButton";

export default {
  name: 'Annotate',

  components: {
    NHButton,
    NHProtection,
    NHCheckbox,
  },

  mounted: async function () {
    this.localData = await read()
  },

  data: () => ({
    localData: {},
    passwordCharacter: 'a',
    passwordColor: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    tab: null,
    debounce,
  }),

  methods: {
    pickColor: function (color) {
      this.passwordColor = color
    },
    pickChar: function (char) {
      this.passwordCharacter = char
    },
    updateIntrinsic: function (intrinsic) {
      let i = this.localData.intrinsics.find((i) => i.name === intrinsic.name)
      i.value = !i.value
      update(this.localData)
    },
    updateNotes: debounce(function () {
      update(this.localData)
    }, 1000),
    updateProtection: function (value) {
      this.localData.protection = value
      update(this.localData)
    },
    resetAnnotate: function () {
      reset().then((res) => this.localData = res)
    }
  },

};
</script>

<style>
.nh-textarea {
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
}
.theme--light.v-application {
  color: #000 !important;
}
.theme--dark.v-application {
  background-color: #121212 !important;
}
</style>
