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
      <v-row class="mt-5">
        <v-col offset-md="2" md="8" cols="12">
          <h3>404 Not Found</h3>
          <p>You'll have to look for the Amulet of Yendor elsewhere.</p>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  name: 'NotFound',

  components: {
  },

  data: () => ({
  }),
};
</script>
