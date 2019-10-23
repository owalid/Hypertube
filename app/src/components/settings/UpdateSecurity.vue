<template>
  <div>
    <v-card-title class="justify-center">{{ user.firstname }} {{ user.lastname }}</v-card-title>
    <v-card-text align="center">{{ user.email }}</v-card-text>
    <v-text-field
      append-icon="mdi-check"
      prepend-icon="mdi-email"
      v-model="emailForm.email"
      :rules="rules.email"
      @click:append="updateMail"
    ></v-text-field>
    <v-form ref="updatePassword">
      <v-text-field
        v-model="pwdForm.oldPwd"
        :rules="rules.password"
        class="mt-5"
        prepend-icon="mdi-lock"
        v-bind:label="$t('security.oldpw')"
        type="password"
      ></v-text-field>
      <v-text-field
        v-model="pwdForm.newPwd"
        :rules="rules.password"
        prepend-icon="mdi-lock"
        v-bind:label="$t('security.newpw')"
        type="password"
      ></v-text-field>
      <v-btn class="mr-4 mt-5" @click="updatePassword">{{$t('security.changepw')}}</v-btn>
    </v-form>
    <v-snackbar v-model="snackbar">
      {{ snackText }}
      <v-btn color="white" text @click="snackbar = false">{{$t('close')}}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "UpdateSecurity",
  data() {
    let user = this.$store.getters.user;
    const updateMailForm = Object.freeze({
      uid: user.uid,
      email: user.email
    });
    const updatePwdForm = Object.freeze({
      uid: user.uid,
      oldPwd: "",
      newPwd: ""
    });
    return {
      user,
      headers: {
        headers: { token: this.$store.getters.token }
      },
      emailForm: Object.assign({}, updateMailForm),
      pwdForm: Object.assign({}, updatePwdForm),
      snackbar: false,
      snackText: "",
      rules: {
        password: [v => this.checkPassword(v) || this.$t("rule.pwd")],
        email: [v => this.checkEmail(v) || this.$t("rule.email")]
      },
      updateMailForm,
      updatePwdForm
    };
  },
  components: {},
  methods: {
    async updateMail() {
      this.snackbar = true;
      if (this.emailForm.email && this.checkEmail(this.emailForm.email)) {
        try {
          const data = { uid: this.user.uid, email: this.emailForm.email };
          const result = await axios.post(
            `${process.env.VUE_APP_BASE_URL}/users/updateEmailReq`,
            data,
            this.headers
          );
          if (result.data.error === "token expired") {
            this.$store.commit("SET_USER", this.$store.getters.defaultUser);
            this.$store.commit("SET_ISLOG", false);
            this.$store.commit("SET_ISSEARCH", false);
            this.$router.push({ path: "/" });
          } else {
            this.snackText = result.data.message;
          }
        } catch (err) {
          this.snackText = this.$t("error.internal");
        }
      } else {
        this.snackText = this.$t("rule.email");
      }
    },

    async updatePassword() {
      if (
        this.checkPassword(this.pwdForm.oldPwd) &&
        this.checkPassword(this.pwdForm.newPwd)
      ) {
        try {
          this.snackbar = true;
          const data = {
            uid: this.user.uid,
            oldPwd: this.pwdForm.oldPwd,
            newPwd: this.pwdForm.newPwd
          };
          const result = await axios.post(
            `${process.env.VUE_APP_BASE_URL}/users/updatePassword`,
            data,
            this.headers
          );
          if (result.data.error === "token expired") {
            this.$store.commit("SET_USER", this.$store.getters.defaultUser);
            this.$store.commit("SET_ISLOG", false);
            this.$store.commit("SET_ISSEARCH", false);
            this.$router.push({ path: "/" });
          } else {
            this.snackText = result.data.message;
          }
        } catch (err) {
          this.snackText = this.$t("error.internal");
        }
      } else {
        this.snackText = this.$t("error.instruct");
      }
    },

    checkPassword(password) {
      const regex = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/;
      return regex.test(password) ? true : false;
    },

    checkEmail(email) {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return regex.test(String(email).toLowerCase());
    }
  }
};
</script>