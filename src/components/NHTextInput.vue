<template>
  <div class="nh-input">
    <label for="nh-input">{{label}}: </label>
    <input
        :class="{nhDark: $vuetify.theme.dark, nhLight: !$vuetify.theme.dark}"
        id="nh-input"
        type="text"
        :size="size"
        :value="value"
        :minlength="minlength"
        :maxlength="maxlength"
        @change="changed"/>
  </div>
</template>

<script>
export default {
  name: 'NHTextInput',

  props: ['value', 'label', 'size', 'minlength', 'maxlength'],

    data: () => ({
    }),

    computed: {
    },

    methods: {
      changed: function (evt) {
        this.$emit('changed', evt.target.value)
      }
    }
  }
</script>

<style>
.nhDark {
  color: white;
}
.nhLight {
  color: black;
}
.nh-input {
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
}
input {
  outline: 0;
  border-bottom: 1px solid #666;
}
</style>
