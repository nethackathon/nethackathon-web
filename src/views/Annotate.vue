<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar>
            <template v-slot:extension>
              <v-tabs v-model="tab">
                <v-tab>Intrinsics</v-tab>
              </v-tabs>
              <v-text-field @keydown="inputPasswordCharacter" v-model="passwordCharacter" />
            </template>
          </v-toolbar>
          <v-tabs-items v-model="tab">
            <v-tab-item>

            </v-tab-item>
            <v-tab-item>
              <v-textarea/>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Annotate',

  mounted: function () {
  } ,

  data: () => ({
    passwordCharacter: 'a',
    tab: null,
    intrinsics: [
      "Cold",
      "Disintegration",
      "Fire",
      "Magic",
      "Poison",
      "Shock",
      "Sleep",
      "Searching",
      "See invisible",
      "Invisible",
      "Teleportitis",
      "Teleport control",
      "Speed",
      "Telepathy",
      "Stealth",
      "Warning",
      "Infravision",
      "Reflection",
    ]
  }),

  methods: {
    inputPasswordCharacter: function (evt) {
      console.log('evt', evt)
      evt.preventDefault()
    }
  },

  watch: {
  }
};
</script>

<style>
</style>
