<template>
  <div>
    <v-row>
      <v-col v-if="prod == 'false'" cols="12" sm="12" md="6">
        <v-btn
          rounded
          block
          small
          color="info"
          crossorigin="use-credentials"
          referrerpolicy="origin"
          :href="pathFb"
        >{{$t("loginFb")}}</v-btn>
      </v-col>
      <v-col cols="12" sm="12" :md="(prod == 'false') ? '6' : '12'">
        <v-btn
          rounded
          block
          small
          color="blue-grey"
          :href="pathIntra"
          crossorigin="use-credentials"
          referrerpolicy="origin"
        >{{$t("loginIntra")}}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="6">
        <v-btn
          rounded
          block
          small
          color="deep-orange"
          dark
          crossorigin="use-credentials"
          referrerpolicy="origin"
          :href="pathGoogle"
        >{{$t("loginGoogle")}}</v-btn>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <v-btn
          rounded
          block
          small
          crossorigin="use-credentials"
          referrerpolicy="origin"
          color="grey darken-4"
          :href="pathGh"
        >{{$t("loginGh")}}</v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-form ref="form">
      <v-text-field v-bind:label="$t('email')" :rules="rules.required" v-model="form.email"></v-text-field>
      <v-text-field
        label="Password"
        :rules="rules.required"
        type="password"
        v-model="form.password"
      ></v-text-field>
      <v-btn class="mr-4 mt-5" @click="submit">{{ $t("login") }}</v-btn>
      <div class="my-2">
        <v-btn text small @click.stop="resetMod = true">{{ $t("resetPwd") }}</v-btn>
      </div>
      <v-snackbar v-model="snackbar">
        {{ snackText }}
        <v-btn color="white" text @click="snackbar = false">{{ $t("close") }}</v-btn>
      </v-snackbar>
    </v-form>
    <v-row justify="center">
      <v-dialog v-model="resetMod" max-width="400">
        <v-card>
          <v-card-title class="headline">{{ $t("resetPwd") }}</v-card-title>
          <v-form ref="resetPassword">
            <v-card-text>
              <v-text-field
                v-bind:label="$t('email')"
                :rules="rules.required"
                v-model="form2.email"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="darken-1" text @click="resetMod = false">{{$t("close")}}</v-btn>
              <v-btn @click="resetPassword" color="darken-1" text>{{$t("reset")}}</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "Login",
  components: {},
  data() {
    const loginForm = Object.freeze({
      email: "",
      password: ""
    });
    const resetForm = Object.freeze({ email: "" });
    return {
      prod: process.env.VUE_APP_PROD,
      pathGh: `${process.env.VUE_APP_BASE_URL}/oauth/authgh`,
      pathFb: `${process.env.VUE_APP_BASE_URL}/oauth/authfb`,
      pathIntra: `${process.env.VUE_APP_BASE_URL}/oauth/authintra`,
      pathGoogle: `${process.env.VUE_APP_BASE_URL}/oauth/authgoogle`,
      resetMod: false,
      snackbar: false,
      snackText: "",
      form: Object.assign({}, loginForm),
      form2: Object.assign({}, resetForm),
      rules: {
        required: [v => v.length > 0 || this.$t("error.required")]
      },
      loginForm,
      resetForm
    };
  },
  methods: {
    async submit() {
      try {
        const result = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/auth/login`,
          this.form
        );
        if (result.data.success) {
          this.$store.commit("SET_ISLOG", true);
          this.$store.commit("SET_USER", result.data.user);
          this.$router.push({ path: "store" });
        }
        this.snackbar = true;
        this.snackText = result.data.message;
      } catch (err) {
        console.log(err);
        this.snackbar = true;
        this.snackText = this.$t("error.wrong");
      }
    },

    async resetPassword() {
      this.snackbar = true;
      if (this.form2.email) {
        try {
          this.snackbar = true;
          const result = await axios.get(
            `${process.env.VUE_APP_BASE_URL}/auth/resetPasswordReq/${this.form2.email}`
          );
          if (result.data.success) {
            this.resetMod = false;
          }
          this.snackText = result.data.message;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
};
</script>