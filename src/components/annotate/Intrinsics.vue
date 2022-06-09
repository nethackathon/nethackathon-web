<template>
  <div>
    <NHCheckbox
        v-for="intrinsic in characterData.intrinsics"
        @clicked="updateIntrinsic(intrinsic)"
        v-bind:key="intrinsic.name"
        :checked="intrinsic.value"
        :label="intrinsic.name"
    />
    <NHNumber
        :value="characterData.protection"
        min="0"
        max="99"
        label="Protection"
        @changed="updateProtection"
    />
    <NHCheckbox
        @clicked="updateCanPray"
        :checked="characterData.canPray"
        label="Can pray"
    />
    <NHNumber
        :value="characterData.lastPrayed"
        min="0"
        max="99999"
        label="Last prayed"
        @changed="updateLastPrayed"
    />
  </div>
</template>

<script>

import NHCheckbox from "../NHCheckbox";
import NHNumber from "../NHNumber";

export default {
  name: 'Intrinsics',

  props: ['characterData'],

  components: {
    NHCheckbox,
    NHNumber
  },

  data: () => ({
  }),

  computed: {
  },

  methods: {
    updateLastPrayed(val) {
      this.$emit('update-last-prayed', val)
    },
    updateCanPray() {
      this.$emit('update-can-pray')
    },
    updateProtection(val) {
      this.$emit('update-protection', val)
    },
    updateIntrinsic(intrinsic) {
      this.$emit('update-intrinsic', intrinsic)
    }
  }
}
</script>

<style>
</style>
