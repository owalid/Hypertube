<template>
  <div id="backblack">
    <v-container fluid>
      <v-row v-if="resetView" align="center" style="height: 80vh">
        <v-card dark max-width="500" width="50vw" class="mx-auto text-center">
          <v-card-text>
            <v-form ref="resetForm">
              <v-text-field v-bind:label="$t('pwd')"
                prepend-icon="mdi-lock"
                v-model="form.password"
                :rules="rules.password"
                type="password"
                >
              </v-text-field>
              <v-btn class="mr-4 mt-5"
                @click="resetPassword"
                >
                {{$t('reset')}}
              </v-btn>
              <v-snackbar v-model="snackbar">
                {{ snackText }}
                <v-btn color="white" text @click="snackbar = false">{{$t('close')}}}</v-btn>
              </v-snackbar>
                <v-overlay :value="overlay">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
              </v-overlay>
            </v-form>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  name: "Activate",
  props: ['action', 'email', 'confHash'],
  data() {
    const resetForm = Object.freeze({
      email: this.email,
      confHash: this.confHash,
      password: "",
    });
    return {
      form: Object.assign({}, resetForm),
      snackText: "",
      rules: {
        password: [v => this.checkPassword(v) || this.$t('pwd')],
      },
      snackbar: false,
      overlay: false, 
      resetForm,
      headers: {
        headers: { token: this.$store.getters.token }
      },
      resetView: false
    };
  },
  methods: {
    async updateMail(email, confHash) {
      try {
        const result = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/users/updateEmail`,
          { email, confHash }, this.headers
        );
        if (result.data.success) {
          if (this.$store.getters.isLog) {
            this.$store.commit("SET_EMAIL", email);
          }
        }
      } catch (err) {
        console.log(err);
      }
      this.$router.push({ path: '/'});
    },

    async resetPassword() {
      if (this.action === 'resetPassword'
          && this.checkPassword(this.form.password)) {
        try {
          const result = await axios.post(
            `${process.env.VUE_APP_BASE_URL}/auth/resetPassword`, this.form
          );
          if (result.data.success) {
            this.overlay = !this.overlay;
          }
          this.snackText = true;
          this.snackText = result.data.message;
        } catch (err) {
          console.log(err);
        }
      }
    },

    async confirmAccount(email, confHash) {
      try {
        const result = await axios.post(`${process.env.VUE_APP_BASE_URL}/auth/confirmAccount`, { 
          email, confHash
        });
        if (result.data.success) {
          this.$router.push({ path: '/'});
        } else {
          this.snackText = true;
          this.snackText = result.data.message;
        }
      } catch (err) {
        console.log(err);
      }
    },

    checkPassword(password) {
      const regex = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/;
      return (regex.test(password) ? true : false);
    }
  },
  watch: {
    async overlay (val) {
      await val && setTimeout(() => {
        this.overlay = false
        this.$router.push({ path: '/' });
      }, 2000)
    },
  },
  
  async created() {
    if (this.action  === 'updateMail') {
      await this.updateMail(this.email, this.confHash);
    } else if (this.action === 'confirmAccount') {
      await this.confirmAccount(this.email, this.confHash);
    } else {
      this.resetView = true;
    }
  }
};
</script>
