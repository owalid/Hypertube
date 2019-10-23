<template>
  <v-col col="6" align="center">
    <v-row class="fill-height" align="center">
      <v-col col="12">
        <p class="title">{{ $t('movie.comments') }}</p>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-text-field
      v-bind:label="$t('movie.yourcmt')"
      v-model="comment"
      v-on:keyup.enter="postComment"
    ></v-text-field>
    <v-btn color="darken-1" text @click="postComment">{{ $t('movie.commentbtn') }}</v-btn>
    <div v-if="comments || comments.length > 0">
      <div v-for="(comment, idk) in comments" :key="idk" align="left">
        <v-row class="fill-height">
          <v-col cols="12">
            <div class="subtitle-1">
              <div v-if="comment.uid != user.uid">
                <router-link :to="{ name: 'profile', params: { id: comment.uid }}">
                  <v-avatar class="ma-4" color="grey" size="30" teal>
                    <v-img :src="comment.picture"></v-img>
                  </v-avatar>
                </router-link>
              </div>
              <div v-else>
                <v-avatar class="ma-4" color="grey" size="30" teal>
                  <v-img :src="comment.picture"></v-img>
                </v-avatar>
              </div>
              <span class="red--text">{{comment.username}}</span>
              .
              <span class="font-weight-bold subtitle-2">
                {{
                moments
                .tz(comment.dateComment, comment.dateComment[comment.dateComment.length - 1] === 'Z' ? "YYYY-MM-DDTHH:mm:ss.msZ" : "YYYY-MM-DDTHH:mm:ss.mss", "Europe/Paris")
                .fromNow()
                }}
              </span>
            </div>
            <div class="font-weight-bold">{{comment.comment}}</div>
          </v-col>
        </v-row>
      </div>
    </div>
    <div v-else>
      <v-row class="fill-height" align="center">
        <h2 class="subtitle">{{ $t('movie.nocmt') }}</h2>
      </v-row>
    </div>
  </v-col>
</template>
<script>
import moment from "moment-timezone";

export default {
  name: "comments",
  props: {
    comments: Array,
    idMovie: String
  },
  data() {
    // const user =;
    return {
      comment: "",
      moments: "",
      user: this.$store.getters.user,
      rules: {
        required: [v => v.length > 0 || this.$t("error.requirednocmt")]
      },
      headers: {
        headers: { token: this.$store.getters.token }
      }
    };
  },
  created() {
    this.moments = moment;
    moment.tz.setDefault("Europe/Paris");
    moment.locale(
      this.$store.getters.user.lang || process.env.VUE_APP_I18N_LOCALE
    );
  },
  methods: {
    async postComment() {
      if (this.comment) {
        try {
          const params = {
            id: this.idMovie,
            uid: this.user.uid,
            picture: this.user.picture,
            username: this.user.username,
            comment: this.comment,
            dateComment: this.moments
              .tz(this.moments(), "Europe/Paris")

              .format("YYYY-MM-DDTHH:mm:ss.ms")
          };
          const result = await axios.post(
            `${process.env.VUE_APP_BASE_URL}/movies/comment`,
            params,
            this.headers
          );
          if (result.data.error === "token expired") {
            this.$store.commit("SET_USER", this.$store.getters.defaultUser);
            this.$store.commit("SET_ISLOG", false);
            this.$store.commit("SET_ISSEARCH", false);
            this.$router.push({ path: "/" });
          } else {
            this.comments.push(params);
            this.comment = "";
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
};
</script>