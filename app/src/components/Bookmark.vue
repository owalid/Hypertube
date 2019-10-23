<template>
  <div>
    <v-btn v-if="!bookmark" class="ma-2" tile outlined color="red darken-3" @click="updateBookmark">
      <v-icon left>mdi-plus</v-icon>
      {{$t('bm.addto')}}
    </v-btn>
    <v-btn v-else class="ma-2" tile outlined color="red darken-3" @click="updateBookmark">
      <v-icon left>mdi-cancel</v-icon>
      {{$t('bm.del')}}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    movieId: String,
    updateBM: Function
  },
  data() {
    const bookmarkList = this.$store.getters.bookmarks;
    const bookmark = bookmarkList
      ? bookmarkList.find(x => x === this.movieId)
        ? true
        : false
      : false;
    return {
      bookmarkList,
      bookmark,
      headers: {
        headers: { token: this.$store.getters.token }
      }
    };
  },
  methods: {
    async updateBookmark() {
      try {
        if (!this.bookmark) {
          this.bookmarkList.push(this.movieId);
          this.bookmark = true;
        } else {
          const index = this.bookmarkList.indexOf(this.movieId);
          this.bookmarkList.splice(index, 1);
          this.bookmark = false;
        }
        this.$store.commit("SET_BOOKMARKS", this.bookmarkList);
        const data = {
          bookmarks: this.bookmarkList,
          userId: this.$store.getters.uid
        };
        const result = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/users/updateBookmark/`,
          data,
          this.headers
        );
        if (result.data.error === "token expired") {
          this.$store.commit("SET_USER", this.$store.getters.defaultUser);
          this.$store.commit("SET_ISLOG", false);
          this.$store.commit("SET_ISSEARCH", false);
          this.$router.push({ path: "/" });
        }
        this.updateBM();
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>