
<template>
  <div>
    <v-toolbar dark>
      <v-toolbar-title>
        <router-link to="/">
          <img :src="require('../assets/long_logo.png')" height="25" />
        </router-link>
      </v-toolbar-title>
      <v-toolbar-items align="center">
        <v-select
          v-model="$i18n.locale"
          :items="langs"
          dark
          solo
          flat
          class="pa-1"
          max-width="20"
          size="1"
          @change="updateLang($i18n.locale)"
        >
          <template slot="selection" slot-scope="data">
            <v-avatar>
              <v-img
                :src="require(`../assets/flag/${data.item.value}.png`)"
                max-height="25"
                max-width="25"
              ></v-img>
            </v-avatar>
          </template>
          <template slot="item" slot-scope="data">
            <v-avatar>
              <v-img
                :src="require(`../assets/flag/${data.item.value}.png`)"
                max-height="25"
                max-width="25"
              ></v-img>
            </v-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="data.item.text"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-select>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <div class="flex-grow-1"></div>
      <v-toolbar-items>
        <v-btn text dark class="caption" @click="home">
          {{$t('home')}}
          <v-icon dark right>mdi-home</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn text dark class="caption" @click="logout">
          {{$t('logout')}}
          <v-icon dark right>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar-items>
      <router-link to="/settings">
        <v-avatar>
          <img :src="this.$store.getters.picture" />
        </v-avatar>
      </router-link>
    </v-toolbar>
  </div>
</template>
<script>
export default {
  name: "NavBar",
  data() {
    return {
      isLog: this.$store.getters.isLog,
      picture: this.$store.getters.picture,
      noSearch: false,
      headers: {
        headers: { token: this.$store.getters.token }
      },
      langs: [
        {
          text: "Francais",
          value: "fr"
        },
        {
          text: "English",
          value: "us"
        },
        {
          text: "Español",
          value: "es"
        },
        {
          text: "Deutsch",
          value: "de"
        },
        {
          text: "简体中文",
          value: "zh"
        },
        {
          text: "русский",
          value: "ru"
        }
      ]
    };
  },
  components: {},
  methods: {
    logout() {
      this.$store.commit("SET_USER", this.$store.getters.defaultUser);
      this.$store.commit("SET_ISLOG", false);
      this.$store.commit("SET_ISSEARCH", false);
      this.$router.push({ path: "/" });
    },

    home() {
      const isSearch = this.$store.getters.isSearch;
      if (isSearch) {
        this.$store.commit("SET_ISSEARCH", !isSearch);
      }
      this.$router.push({
        name: "store"
      });
    },
    navigateSettings() {
      this.$router.push({ path: "/settings" });
    },
    async updateLang(lang) {
      this.$store.commit("SET_LANG", lang);
      try {
        const data = {
          lang: lang,
          uid: this.$store.getters.uid
        };
        const result = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/users/updateLang/`,
          data,
          this.headers
        );
        if (result.data.error === "token expired") {
          this.$store.commit("SET_USER", this.$store.getters.defaultUser);
          this.$store.commit("SET_ISLOG", false);
          this.$store.commit("SET_ISSEARCH", false);
          this.$router.push({ path: "/" });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>