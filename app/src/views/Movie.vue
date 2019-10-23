<template>
  <div id="backblack">
    <div v-if="movie && pathsFilesSubs">
      <v-col md="12" sm="12" class="mx-auto">
        <div v-if="pathsFilesSubs !== 'no subtitle' && pathsFilesSubs.length > 0">
          <video
            id="videoPlayer"
            controls
            controlslist="nodownload"
            autoplay
            muted="muted"
            v-if="movie"
            @play="onplay"
            @ended="endMovie"
            @timeupdate="updateTime"
            :src="requestPath"
            :key="requestPath"
            type="video/mp4"
            preload="metadata"
          >
            <track
              v-for="(sub, idk) in pathsFilesSubs"
              :key="idk"
              :label="sub.lang"
              kind="subtitles"
              :srclang="sub.langShort"
              :src="require(`../assets/subtitle/${sub.fileName}`)"
            />
          </video>
        </div>
        <div v-else>
          <video
            id="videoPlayer"
            controls
            controlslist="nodownload"
            autoplay
            muted="muted"
            v-if="movie"
            @play="onplay"
            @ended="endMovie"
            @timeupdate="updateTime"
            :src="requestPath"
            :key="requestPath"
            type="video/mp4"
            preload="metadata"
          ></video>
        </div>
        <v-select
          dark
          v-model="qualitySelected"
          :items="qualityArray"
          v-bind:label="$t('movie.quality')"
          @change="changeQuality"
        ></v-select>
      </v-col>
      <v-container dark>
        <v-tabs fixed-tabs dark>
          <v-tab @click="changeTab('Info')">{{ $t('movie.info') }}</v-tab>
          <v-tab @click="changeTab('Comments')">{{ $t('movie.comments') }}</v-tab>
        </v-tabs>
        <v-sheet dark tile>
          <div v-if="currentTab === 'Info'">
            <info-movie :movie="movie"></info-movie>
          </div>
          <div v-if="currentTab === 'Comments'">
            <comments :comments="comments" :idMovie="movie._id"></comments>
          </div>
        </v-sheet>
      </v-container>
    </div>
    <div v-else>
      <v-col md="12" sm="12" class="mx-auto">
        <div class="text-center mx-auto">
          <v-progress-circular :size="100" color="red" indeterminate>{{ $t('load') }}</v-progress-circular>
        </div>
      </v-col>
    </div>
  </div>
</template>
<script>
import Comments from "@/components/Comments";
import InfoMovie from "@/components/InfoMovie";
import moment from "moment";
const parseTorrent = require("parse-torrent");

export default {
  name: "Movie",
  props: ["idMovie"],
  data() {
    return {
      i: 0,
      movie: "",
      requestPath: "",
      comments: [],
      supposedCurrentTime: 0,
      pathsFilesSubs: "",
      qualitySelected: "",
      qualityArray: [],
      currentTime: 0,
      currentTab: "Info",
      headers: {
        headers: { token: this.$store.getters.token }
      }
    };
  },
  components: {
    Comments,
    InfoMovie
  },
  async created() {
    try {
      const result = await axios.get(
        `${process.env.VUE_APP_BASE_URL}/movies/movie/${this.idMovie}`,
        this.headers
      );
      if (result.data.movie === "no movie") {
        return this.$router.push({ path: "/store" });
      }
      const res1 = await axios.post(
        `${process.env.VUE_APP_BASE_URL}/movies/updateLastViewed`,
        { id: this.idMovie },
        this.headers
      );
      if (result.data.error === "token expired" || res1 === "token expired") {
        this.$store.commit("SET_USER", this.$store.getters.defaultUser);
        this.$store.commit("SET_ISLOG", false);
        this.$store.commit("SET_ISSEARCH", false);
        this.$router.push({ path: "/" });
      } else {
        this.movie = result.data.movie;
        this.comments = this.movie.comments || [];
        this.movie.torrents.map((k, v) => {
          this.qualityArray[v] = k.quality;
        });
        this.qualitySelected = this.movie.torrents[0].quality;
        this.movie.torrents[0].hash = this.movie.torrents[0].hash
          ? this.movie.torrents[0].hash
          : this.magnetToHash(this.movie.torrents[0].url);
        this.requestPath = `${process.env.VUE_APP_BASE_URL}/player/player/${this.movie.torrents[0].hash}`;
        let data = {
          idimdb: this.movie.imdb_code,
          lang: this.$store.getters.user.lang
        };
        const res2 = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/player/subtitle`,
          data,
          this.headers
        );
        let vm = this;
        setTimeout(() => {
          vm.pathsFilesSubs = res2.data.path;
          if (!vm.pathsFilesSubs) {
            vm.pathsFilesSubs = "no subtitle";
          }
        }, 1000);
      }
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    changeTab(tab) {
      this.currentTab = tab === "Info" ? "Info" : "Comments";
    },
    async endMovie() {
      const user = this.$store.getters.user;
      const newList = user.list || [];
      const data = { id: user.uid, idMovie: this.idMovie };
      newList.push({ idMovie: this.idMovie });
      try {
        const res = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/users/updateList`,
          data,
          this.headers
        );
        this.$store.commit("SET_LIST", newList);
      } catch (e) {
        console.error(e);
      }
    },
    async changeQuality() {
      let videoPlayer = document.getElementById("videoPlayer");
      let source = videoPlayer.src;
      let currentTime = videoPlayer.currentTime;
      let newTorrent = this.movie.torrents.filter(
        k => k.quality === this.qualitySelected
      );
      newTorrent[0].hash = newTorrent[0].hash
        ? newTorrent[0].hash
        : this.magnetToHash(newTorrent[0].url);
      this.requestPath = `${process.env.VUE_APP_BASE_URL}/player/player/${newTorrent[0].hash}`;
      source = this.requestPath;
      try {
        await videoPlayer.play();
        this.currentTime = currentTime;
      } catch (err) {
        videoPlayer.currentTime = currentTime;
      }
    },
    async onplay(e) {
      let videoPlayer = e.target;
      videoPlayer.currentTime = this.currentTime;
    },
    updateTime(e) {
      let videoPlayer = e.target;
      if (!videoPlayer.seek) {
        this.currentTime = videoPlayer.currentTime;
      }
    },
    magnetToHash(magnet) {
      return parseTorrent(magnet).infoHash;
    }
  }
};
</script>
<style lang="css">
video {
  width: 100%;
  height: 100%;
}
</style>