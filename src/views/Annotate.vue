<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar>
            <template v-slot:extension>
              <v-tabs v-model="tab">
                <v-tab>Intrinsics</v-tab>
                <v-tab>Notes</v-tab>
              </v-tabs>
              <!-- CharPicker @pickChar="pickChar" :color="passwordColor" :character="passwordCharacter"/>
              TODO: Use CharPicker and ColorPicker to password protect per-character
              <ColorPicker @pickColor="pickColor" :color="passwordColor"/ -->
            </template>
          </v-toolbar>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-container fluid>
                <v-row>
                  <v-col cols="12">
                    <v-switch
                        v-for="intrinsic in localData.intrinsics"
                        @change="updateIntrinsic(intrinsic)"
                        v-bind:key="intrinsic.name"
                        v-model="intrinsic.value"
                        :label="intrinsic.name"
                        dense
                    />
                    <v-text-field
                        type="number"
                        label="Protection"
                        v-model="localData.protection"
                        @change="updateProtection"
                        outlined
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <v-container fluid>
                <v-row>
                  <v-col cols="12">
                    <v-textarea solo v-model="localData.notes" @keydown="updateNotes"/>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PALETTE from "../includes/palette"
// import INTRINSICS from "../includes/intrinsics"
// import CharPicker from "../components/CharPicker"
// import ColorPicker from "../components/ColorPicker"
import {update, read} from "../services/annotate.service"
import { debounce } from "debounce"

export default {
  name: 'Annotate',

  components: {
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
      this.localData.intrinsics.find((i) => i.name === intrinsic.name).value = intrinsic.value
      update(this.localData)
    },
    updateNotes: debounce(function () {
      update(this.localData)
    }, 1000),
    updateProtection: function () {
      update(this.localData)
    }
  },

};
</script>

<style>
</style>
