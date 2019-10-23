<template>
  <div>
    <v-card-title class="justify-center">{{ user.firstname }} {{ user.lastname }}</v-card-title>
    <v-row justify="space-around">
      <div v-if="!form.picture">
        <v-avatar color="red lighten-2">
          <v-icon dark>mdi-account-circle</v-icon>
        </v-avatar>
      </div>
      <div v-else>
        <v-row align="center" justify="center">
          <v-img
            v-if="checkExtension()"
            :src="form.picture"
            aspect-ratio="1"
            class="grey lighten-2 ma-5"
            width="15rem"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-row>
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
        class="mt-5"
      ></v-file-input>
      <v-btn class="mr-4 mt-5" @click="uploadAvatar">{{$t('upload')}}</v-btn>
      <v-snackbar v-model="snackbar">
        {{ snackText }}
        <v-btn color="white" text @click="snackbar = false">{{$t('close')}}</v-btn>
      </v-snackbar>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "UpdateAvatar",
  data() {
    const avatarForm = Object.freeze({
      uid: this.$store.getters.uid,
      picture: this.$store.getters.user.picture
    });
    return {
      headers: {
        headers: { token: this.$store.getters.token }
      },
      user: this.$store.getters.user,
      snackbar: false,
      snackText: "",
      form: Object.assign({}, avatarForm),
      rules: {
        picture: [v => v !== null || "Select a picture"]
      },
      avatarForm
    };
  },
  components: {},
  methods: {
    async uploadAvatar() {
      this.snackbar = true;
      if (this.form.picture) {
        if (this.checkExtension()) {
          try {
            const result = await axios.post(
              `${process.env.VUE_APP_BASE_URL}/users/uploadAvatar`,
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
                this.snackText = result.data.message;
                this.$store.commit("SET_PICTURE", this.form.picture);
              }
            }
          } catch (err) {
            this.snackText = "Internal server error";
          }
        } else {
          this.snackText = "Wrong file extension";
        }
      } else {
        this.snackText = "Please select a picture";
      }
    },

    resetForm() {
      this.form = Object.assign({}, this.avatarForm);
      this.$refs.form.reset();
    },

    onFileChanged(event) {
      if (event && event.size < 1000000) {
        const vm = this;
        const reader = new FileReader();
        reader.readAsDataURL(event);
        reader.onload = () => {
          if (reader.result) vm.form.picture = reader.result.toString();
          else vm.form.picture = null;
        };
      } else {
        this.snackbar = true;
        this.snackText = "Wrong file extension";
      }
    },

    checkExtension() {
      const format = ["jpg", "jpeg", "png"];
      const ext = this.form.picture.split(";")[0].split("/")[1];
      const isUrl = this.form.picture.split(":")[0];
      return format.indexOf(ext) > -1 || isUrl == "https" ? true : false;
    }
  }
};
</script>