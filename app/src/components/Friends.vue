<template>
  <div v-if="friends.length > 0" class="ma-5">
    <h2 class="ma-5" style="color: white">{{ title }}</h2>
    <v-sheet class="mx-auto" style="background-color: rgba(0,0,0,0)">
      <v-slide-group multiple show-arrows>
        <v-slide-item v-for="friend in friends" :key="friend._id">
          <div v-if="friend._id != user.uid">
            <router-link :to="{ name: 'profile', params: { id: friend._id }}">
              <v-avatar class="ma-4" color="grey" size="70" teal>
                <v-img :src="friend.picture"></v-img>
              </v-avatar>
            </router-link>
          </div>
          <div v-else>
            <router-link to="/settings">
              <v-avatar class="ma-4" color="grey" size="70" teal>
                <v-img :src="friend.picture"></v-img>
              </v-avatar>
            </router-link>
          </div>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>
<script>
export default {
  props: {
    follows: Array,
    title: String
  },
  watch: {
    follows: async function(newVal, oldVal) {
      this.$emit("update:follows", newVal);
      await this.onCreate();
    }
  },
  data() {
    return {
      friends: [],
      user: this.$store.getters.user,
      headers: {
        headers: { token: this.$store.getters.token }
      }
    };
  },
  methods: {
    async onCreate() {
      try {
        if (this.follows) {
          const result = await axios.post(
            `${process.env.VUE_APP_BASE_URL}/users/getFollowsDetails`,
            { follows: this.follows },
            this.headers
          );
          if (result.error === "token expired") {
            this.$store.commit("SET_USER", this.$store.getters.defaultUser);
            this.$store.commit("SET_ISLOG", false);
            this.$store.commit("SET_ISSEARCH", false);
            this.$router.push({ path: "/" });
          } else {
            this.friends = result.data.friends;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  async created() {
    this.onCreate();
  }
};
</script>