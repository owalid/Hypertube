<template>
  <div>
    <v-row justify="space-around">
      <div v-if="!form.picture">
        <v-avatar color="red lighten-2">
          <img
            src="https://www.assises-orl.fr/wp-content/uploads/2016/06/user-default.png"
            height="25"
          />
        </v-avatar>
      </div>
      <div v-else>
        <v-avatar>
          <img v-if="checkExtension" :src="form.picture" />
        </v-avatar>
      </div>
    </v-row>
    <v-form ref="form">
      <v-file-input
        required
        @change="onFileChanged"
        :rules="rules.picture"
        v-bind:placeholder="$t('upload_img')"
        v-bind:label="$t('avatar')"
        prepend-icon="mdi-paperclip"
      >
        <template v-slot:selection="{ text }">
          <v-chip small label color="primary">{{ text }}</v-chip>
        </template>
      </v-file-input>
      <v-divider></v-divider>
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
      <v-text-field :rules="rules.email" v-bind:label="$t('email')" v-model="form.email"></v-text-field>
      <v-text-field
        v-bind:label="$t('pwd')"
        :rules="rules.password"
        type="password"
        v-model="form.password"
      ></v-text-field>
      <v-btn class="mr-4 mt-5" @click="submit">{{$t("submit")}}</v-btn>
      <v-snackbar v-model="snackbar">
        {{ snackText }}
        <v-btn color="white" text @click="snackbar = false">{{$t("close")}}</v-btn>
      </v-snackbar>
    </v-form>
  </div>
</template>
<script>
export default {
  name: "Register",
  data() {
    const registerForm = Object.freeze({
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      picture: ""
    });
    return {
      snackbar: false,
      snackText: "",
      form: Object.assign({}, registerForm),
      rules: {
        name: [v => this.checkName(v) || this.$t("rule.name")],
        username: [v => this.checkUsername(v) || this.$t("rule.username")],
        picture: [v => v !== null || this.$t("rule.img")],
        password: [v => this.checkPassword(v) || this.$t("rule.pwd")],
        email: [v => this.checkEmail(v) || this.$t("rule.email")]
      },
      registerForm
    };
  },
  components: {},
  methods: {
    formValidation() {
      if (
        this.checkName(this.form.firstname) &&
        this.checkUsername(this.form.username) &&
        this.checkName(this.form.lastname) &&
        this.checkPassword(this.form.password) &&
        this.checkEmail(this.form.email)
      )
        return true;
      else return false;
    },

    async submit() {
      if (this.formValidation()) {
        if (this.checkExtension()) {
          try {
            this.form.picture = !this.form.picture
              ? "https://www.assises-orl.fr/wp-content/uploads/2016/06/user-default.png"
              : this.form.picture;
            const result = await axios.post(
              `${process.env.VUE_APP_BASE_URL}/auth/register`,
              this.form
            );
            if (result.data.success) {
              this.resetForm();
            }
            this.snackbar = true;
            this.snackText = result.data.message;
          } catch (err) {
            this.snackbar = true;
            this.snackText = this.$t("error.internal");
          }
        } else {
          this.snackText = true;
          this.snackText = this.$t("rule.img");
        }
      } else {
        this.snackbar = true;
        this.snackText = this.$t("error.instruct");
      }
    },

    resetForm() {
      this.form = Object.assign({}, this.registerForm);
      this.$refs.form.reset();
    },

    onFileChanged(event) {
      if (event && event.size < 1000000) {
          const vm = this;
          const reader = new FileReader();
          reader.readAsDataURL(event);
          reader.onload = () => {
            if (reader.result) {
              vm.form.picture = reader.result.toString();
            } else vm.form.picture = null;
          };
      } else {
        this.form.picture = "";
      }
    },

    checkName(name) {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]{3,15}$/;
      return regex.test(name) ? true : false;
    },

    checkUsername(username) {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-0-9-]{5,15}$/;
      return regex.test(username) ? true : false;
    },

    checkPassword(password) {
      const regex = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/;
      return regex.test(password) ? true : false;
    },

    checkEmail(email) {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return regex.test(String(email).toLowerCase());
    },

    checkExtension() {
      const format = ["jpg", "jpeg", "png"];
      const ext = this.form.picture.split(";")[0].split("/")[1];
      const defaultPicture =
        "https://www.assises-orl.fr/wp-content/uploads/2016/06/user-default.png";
      this.form.picture = (this.form.picture) ? this.form.picture : defaultPicture;
      return format.indexOf(ext) > -1 || this.form.picture === defaultPicture ? true : false;
    }
  }
};
</script>