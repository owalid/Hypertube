<template>
  <div id="back">
    <v-container fluid>
      <v-row align="center" class="ma-5">
        <v-card dark max-width="500" width="30rem" height="100%" class="mx-auto">
          <v-tabs fixed-tabs>
            <v-tab @click="changeTab('login')">{{$t('login')}}</v-tab>
            <v-tab @click="changeTab('register')">{{$t('register')}}</v-tab>
          </v-tabs>
          <v-card-text align="center">
            <div v-if="currentTab === 'login'">
              <Login />
            </div>
            <div v-if="currentTab === 'register'">
              <Register />
            </div>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Login from "@/components/Login";
import Register from "@/components/Register";
import { decodeToken } from "@/verifToken";
import jwt from "jsonwebtoken";

export default {
  props: ["token"],
  data() {
    return {
      currentTab: "login"
    };
  },
  components: {
    Login,
    Register
  },
  methods: {
    changeTab(tab) {
      this.currentTab = tab === "login" ? "login" : "register";
    }
  },
  created() {
    if (this.token) {
      try {
        const decode = decodeToken(this.token);
        this.$store.commit("SET_USER", decode);
        this.$i18n.locale = this.$store.getters.user.lang;
        this.$store.commit("SET_ISLOG", true);
        this.$store.commit("SET_TOKEN", this.token);
        this.$router.push({ name: "store" });
      } catch (e) {
        this.$router.push({ path: "/" });
      }
    }
  }
};
</script>