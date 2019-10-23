
<template>
  <div>
    <v-card-title class="justify-center">{{ user.firstname }} {{ user.lastname }}</v-card-title>
    <v-card-text align="center">{{ user.username }}</v-card-text>
    <v-form ref="form">
      <v-text-field
        required
        v-model="form.firstname"
        :rules="rules.name"
        counter
        maxlength="15"
        v-bind:hint="$t('name-hint')"
        v-bind:label="$t('firstname')"
      ></v-text-field>
      <v-text-field
        v-model="form.lastname"
        :rules="rules.name"
        required
        counter="15"
        maxlength="15"
        v-bind:hint="$t('name-hint')"
        v-bind:label="$t('lastname')"
      ></v-text-field>
      <v-text-field
        v-model="form.username"
        :rules="rules.username"
        required
        counter="15"
        maxlength="15"
        v-bind:hint="$t('un-hint')"
        v-bind:label="$t('username')"
      ></v-text-field>
      <v-btn class="mr-4 mt-5" @click="updateNames">{{$t('update')}}</v-btn>
      <v-snackbar v-model="snackbar">
        {{ snackText }}
        <v-btn color="white" text @click="snackbar = false">{{$t('close')}}</v-btn>
      </v-snackbar>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "UpdateNames",
  data() {
    let user = this.$store.getters.user;
    const namesForm = Object.freeze({
      uid: user.uid,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username
    });
    return {
      user,
      headers: {
        headers: { token: this.$store.getters.token }
      },
      snackbar: false,
      snackText: "",
      form: Object.assign({}, namesForm),
      rules: {
        name: [v => this.checkName(v) || "3 alphabetical characters minimum"],
        username: [
          v => this.checkUsername(v) || "5 alphanumeric characters minimum"
        ]
      },
      namesForm
    };
  },
  components: {},
  methods: {
    async updateNames() {
      this.snackbar = true;
      if (
        this.checkName(this.form.firstname) &&
        this.checkName(this.form.lastname) &&
        this.checkUsername(this.form.username)
      ) {
        try {
          const result = await axios.post(
            `${process.env.VUE_APP_BASE_URL}/users/updateNames`,
            this.form,
            this.headers
          );
          if (result.data.error === "token expired") {
            this.$store.commit("SET_USER", this.$store.getters.defaultUser);
            this.$store.commit("SET_ISLOG", false);
            this.$store.commit("SET_ISSEARCH", false);
            this.$router.push({ path: "/" });
          } else {
            if (result.data.success) {
              this.$store.commit("SET_FIRSTNAME", this.form.firstname);
              this.$store.commit("SET_USERNAME", this.form.username);
              this.$store.commit("SET_LASTNAME", this.form.lastname);
            }
            this.snackText = result.data.message;
          }
        } catch (err) {
          this.snackText = "Internal server error";
        }
      } else {
        this.snackText = "Please follow the instructions";
      }
    },

    checkName(name) {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]{3,15}$/;
      return regex.test(name) ? true : false;
    },

    checkUsername(username) {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-0-9-]{5,15}$/;
      return regex.test(username) ? true : false;
    }
  }
};
</script>