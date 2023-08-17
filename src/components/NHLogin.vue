<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-right"><span class="nh-clickable" @click="closeModal">X</span></v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2>{{ (registering) ? 'Sign up' : 'Login' }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <NHTextInput size="32" minlength="1" maxlength="32" :value="username" label="Username" @changed="changeUsername"/>
    </v-row>
    <v-row>
      <v-col cols="12">
        <fieldset class="nh-fieldset">
          <legend>Password</legend>
          <CharPicker :color="passwordColor" :character="passwordChar" @pickChar="pickChar"/>
          <ColorPicker :color="passwordColor" @pickColor="pickColor"/>
        </fieldset>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <NHButton :label="(registering) ? 'Submit' : 'Login'" @clicked="onLogin" :disabled="buttonDisabled"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-right">
        <span v-if="!registering" class="nh-link nh-clickable sm1" @click="registering = true">or, Register a new account</span>
        <span v-if="registering" class="nh-link nh-clickable sm1" @click="registering = false">or, Login with an existing account</span>
      </v-col>
    </v-row>
    <v-row v-if="error.length > 0"><strong class="red--text">{{ error }}</strong></v-row>
    <v-row v-if="loginMessage.length > 0"><strong class="red--text">{{ loginMessage }}</strong></v-row>
  </v-container>
</template>

<script>
import NHTextInput from "./NHTextInput";
import CharPicker from "./CharPicker";
import ColorPicker from "./ColorPicker";
import NHButton from "./NHButton";
import PALETTE from "../includes/palette"
import {register, login} from "../services/auth.service"

export default {
  name: 'NHNumber',

  props: ['value', 'label', 'size', 'minlength', 'maxlength', 'loginMessage'],

  components: {
    CharPicker,
    ColorPicker,
    NHTextInput,
    NHButton
  },

  data: () => ({
    username: '',
    passwordColor: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    passwordChar: '',
    registering: false,
    error: ''
  }),

  computed: {
    buttonDisabled: function () {
      return (this.passwordChar.trim() === '' || this.username.trim() === '')
    }
  },

  methods: {
    changeUsername: function (username) {
      this.username = username
    },
    pickChar: function (char) {
      this.passwordChar = char
    },
    pickColor: function (color) {
      this.passwordColor = color
    },
    handleLogin: function (res) {
      if (res.status === 201) {
        // Yes, I understand that this is vulnerable to XSS attacks
        // However, who is going to want to hack this web app?
        localStorage.setItem('nethackathon-jwt', res.data);
        localStorage.setItem('loggedInAs', this.username);
        this.$emit('loggedIn')
      } else {
        // Some non-standard response display the error
        this.error = res.data
      }
    },
    onLogin: function () {
      if (this.registering) {
        register({username: this.username, passwordCharacter: this.passwordChar, passwordColor: this.passwordColor})
            .then(this.handleLogin)
      } else {
        login({username: this.username, passwordCharacter: this.passwordChar, passwordColor: this.passwordColor})
            .then(this.handleLogin)
      }
    },
    closeModal: function () {
      this.$emit('closeModal')
    }
  }
}
</script>

<style>
.nh-fieldset {
  padding: 1em;
}

.nhDark {
  color: white;
}

.nhLight {
  color: black;
}

.nh-input {
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
}
</style>
