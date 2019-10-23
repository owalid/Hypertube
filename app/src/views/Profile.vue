<template>
  <div id="backblack">
    <v-row justify="space-around" class="ma-5">
      <v-avatar color="grey" size="100" teal>
        <v-img :src="userDetails.picture"></v-img>
      </v-avatar>
      <v-list-item color="rgba(0, 0, 0, .4)" dark class="text-center">
        <v-list-item-content>
          <v-list-item-title class="title">{{ userDetails.firstname }} {{ userDetails.lastname }}</v-list-item-title>
          <v-list-item-subtitle>{{ userDetails.username }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <div class="text-center">
        <v-btn @click="followOrUnfollow" v-if="!follow" class="ma-2" rounded color="red darken-4">
          <v-icon left>mdi-plus</v-icon>
          {{$t('profil.follow')}}
        </v-btn>
        <v-btn @click="followOrUnfollow" v-else class="ma-2" rounded color="red darken-4">
          <v-icon left>mdi-minus</v-icon>
          {{$t('profil.unfollow')}}
        </v-btn>
      </div>
    </v-row>
    <Slides
      v-if="userDetails.bookmarks.length > 0"
      :movies="userDetails.bookmarks"
      :updateBM="updateBM"
      v-bind:title="$t('profil.playlist')"
    />
    <Slides
      v-if="userDetails.bookmarks.length > 0"
      :movies="userDetails.list"
      v-bind:title="$t('profil.recent')"
    />

    <Friends
      v-if="userDetails.follows.length > 0"
      :follows="userDetails.follows"
      v-bind:title="$t('profil.friends')"
    />
  </div>
</template>
<script>
import Slides from "@/components/Slides";
import Friends from "@/components/Friends";

export default {
  data() {
    return {
      follow: false,
      follows: [],
      hisFriend: [],
      userDetails: {
        username: "",
        firstname: "",
        lastname: "",
        list: [],
        follows: [],
        bookmarks: [],
        picture: ""
      },
      headers: {
        headers: { token: this.$store.getters.token }
      }
    };
  },
  props: ["id"],
  components: {
    Slides,
    Friends
  },
  watch: {
    id: async function(newVal, oldVal) {
      this.$emit("update:id", newVal);
      await this.onCreate();
    }
  },
  methods: {
    async updateBM() {
      try {
        const data = {
          _id: this.$store.getters.uid,
          bookmarks: this.$store.getters.bookmarks
        };
        const result = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/movies/getSuggestions`,
          data,
          this.headers
        );
        if (result.error === "token expired") {
          this.$store.commit("SET_USER", this.$store.getters.defaultUser);
          this.$store.commit("SET_ISLOG", false);
          this.$router.push({ path: "/" });
        } else {
          if (result.data.success) {
            this.bookmarkList = result.data.bookmarks;
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async onCreate() {
      this.follows = this.$store.getters.follows;
      this.follow = this.follows
        ? this.follows.find(x => x === this.id)
          ? true
          : false
        : false;
      if (this.id === this.$store.getters.uid) {
        this.$router.push({ path: "/settings" });
      } else {
        try {
          const result = await axios.get(
            `${process.env.VUE_APP_BASE_URL}/users/getUserDetails/${this.id}`,
            this.headers
          );
          if (result.error === "token expired") {
            const defaultUser = {
              uid: "",
              username: "",
              firstname: "",
              lastname: "",
              picture: "",
              email: "",
              list: [],
              token: ""
            };
          }
          if (result.data.success) {
            this.userDetails = result.data.userDetails;
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    async followOrUnfollow() {
      try {
        if (!this.follow) {
          this.follows.push(this.id);
          this.follow = true;
        } else {
          this.follows = this.follows.filter(v => v !== this.id);
          this.follow = false;
        }
        this.$store.commit("SET_FOLLOWS", this.follows);
        const data = {
          follows: this.follows,
          uid: this.$store.getters.uid
        };
        const result = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/users/follow/`,
          data,
          this.headers
        );
        if (result.data.error === "token expired") {
          this.$store.commit("SET_USER", this.$store.getters.defaultUser);
          this.$store.commit("SET_ISLOG", false);
          this.$store.commit("SET_ISSEARCH", false);
          this.$router.push({ path: "/" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },

  async created() {
    await this.onCreate();
  }
};
</script>
