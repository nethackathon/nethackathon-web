<template>
  <v-layout>
      <v-container>
        <v-row class="mt-5">
          <v-col offset-md="2" md="8" cols="12">
            <v-img
                alt="NetHackathon Logo"
                src="../assets/logo1.png"
                width="100%"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col offset-md="2" md="8" cols="12">
            <h1>Streamer FAQ</h1>
          </v-col>
        <v-row v-for="f in faq" v-bind:key="f.question">
          <v-col offset-md="2" md="8" cols="12">
            <h2>{{ f.question }}</h2>
            <div v-html="f.answer" class="answer"></div>
            <v-divider/>
          </v-col>
        </v-row>
        </v-row>
      </v-container>
  </v-layout>
</template>

<script>

export default {
  name: 'Help',

  components: {
  },

  created: function () {
  },

  data: () => ({
    faq: [
      {
        question: `How do I connect to the server?`,
        answer: `
          <p>You need to SSH into the server you've been assigned to, the servers are:</p>
          <ul>
            <li>nethackathon.org (US)</li>
            <li>eu.nethackathon.org (EU/UK)</li>
            <li>au.nethackathon.org (AU)</li>
          </ul>
        `
      },
      {
        question: `SSH? Never heard of it.`,
        answer: `
          <p>You'll need a SSH client, if you're on Windows, <a href="https://www.putty.org/">download PuTTY.</a></p>
          <p>On Linux or Mac systems you can simply open a shell or Terminal window and type \`ssh [your username]@nethackathon.org\`.</p>
        `
      },
      {
        question: `OK, I'm connected to the server. Now what?`,
        answer: `
          <p>Type \`nethackathon\` and you'll be prompted to choose one of four default NetHack configurations.</p>
          <p>After you choose your configuration, it will launch NetHack with the shared save.</p>
        `
      },
      {
        question: `When I type \`nethackathon\` it says "someone (some server) is currently running NetHack, ask them to save and quit."`,
        answer: `
          <p>The nethackathon script only allows one person to run NetHack at a time, ask the person listed to save and quit.</p>
        `
      },
      {
        question: `But the person listed has already saved and quit / is me.`,
        answer: `
          <p>If you're on the same server as the last person to run the nethackathon script and NetHack is no longer running, type \`rm /nethackathon/running\` which will allow you to run \`nethackathon\` again.</p>
          <p>If you're on a different server than the last person to run the script, ask someone on that server to \`rm /nethackaton/running\`, run \`nethackathon\`, and save the game.</p>
        `
      },
      {
        question: `How can I configure my NetHack settings?`,
        answer: `
          <p>After running \`nethackathon\` for the first time, your personal settings will be stored in a \`.nethackrc\`
          file in your home directory (where you start when you log into the server).</p>
          <p>You can edit the configuration file by typing, for instance, \`nano .nethackrc\`. When you're done editing
          type CTRL-X to exit and type \`Y\` and enter to confirm and save. </p>
          <p>If you already have a good configuration set up on a server like hardfought, browse for the location of your
          configuration file <a href="https://www.hardfought.org/nethack/userdata/">here</a>. Once you find the URL of
          your configuration file type the following in your home directory: \`wget [url of your config] -O .nethackrc\`.</p>
        `
      },
    ]
  }),

  computed: {
  },

  methods: {
  },

  mounted: function () {
  },

};
</script>

<style>
  .answer {
    margin-bottom: 1em;
  }
</style>
