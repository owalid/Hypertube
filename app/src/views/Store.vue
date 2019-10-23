<template>
  <div id="backblack">
    <v-col md="6" sm="8" class="mx-auto">
      <v-expansion-panels dark align="center">
        <v-expansion-panel @click="toggleSearch">
          <v-expansion-panel-header expand-icon="mdi-magnify">{{ $t('search.find') }}</v-expansion-panel-header>
          <Search
            v-if="$store.getters.isSearch"
            :movies="movies"
            :getMovies="getMovies"
            :searchParams="searchParams"
          />
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <transition name="fade-up" mode="out-in">
      <RenderSearch
        v-if="$store.getters.isSearch"
        :movies="movies"
        :getMovies="getMovies"
        :searchParams="searchParams"
      />
    </transition>
    <div v-if="!$store.getters.isSearch">
      <Friends :follows="this.$store.getters.follows" v-bind:title="$t('store.friends')" />
      <Slides :updateBM="updateBM" :movies="news" v-bind:title="$t('store.news')" />
      <Slides :updateBM="updateBM" :movies="popular" v-bind:title="$t('store.popular')" />
      <v-card class="ma-5">
        <v-row dark>
          <v-row align="center" justify="center" v-bind:style="bannerStyle">
            <v-card-title class="ma-5 subtitle-1">
              {{ foreground.title | capitalize}}
              <v-card-text class="body-1">{{ foreground.synopsis }}</v-card-text>
              <Bookmark :movieId="foreground._id" :updateBM="updateBM" />
              <div v-if="foreground._id">
                <v-btn
                  class="ma-2"
                  tile
                  outlined
                  color="red darken-3"
                  :to="{ name: 'movie', params: { idMovie: foreground._id }}"
                >
                  <v-icon left>mdi-play</v-icon>
                  {{ $t('slides.play') }}
                </v-btn>
              </div>
            </v-card-title>
          </v-row>
        </v-row>
      </v-card>
      <Slides
        :updateBM="updateBM"
        :movies="bookmarkList"
        v-bind:title="$t('store.later')"
        v-if="!$store.getters.isSearch && bookmarkList.length > 0"
      />
    </div>
  </div>
</template>
<script>
import Slides from "@/components/Slides";
import Search from "@/components/Search";
import RenderSearch from "@/components/RenderSearch";
import Bookmark from "@/components/Bookmark";
import Friends from "@/components/Friends";

export default {
  data() {
    return {
      follows: this.$store.getters.follows,
      movies: [],
      news: [],
      popular: [],
      bookmarkList: [],
      foreground: {},
      bannerStyle: {},
      searchParams: {
        years: [1950, new Date().getFullYear()],
        ratings: [0, 10],
        page: 1,
        keywords: "",
        genre: ""
      },
      headers: {
        headers: { token: this.$store.getters.token }
      }
    };
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.toUpperCase();
    }
  },
  components: {
    Slides,
    Search,
    RenderSearch,
    Friends,
    Bookmark
  },
  methods: {
    async getMovies(params) {
      try {
        if (this.$store.getters.isSearch) {
          const result = await axios.post(
            `${process.env.VUE_APP_BASE_URL}/movies/`,
            params,
            this.headers
          );
          if (result.error === "token expired") {
            this.$store.commit("SET_USER", this.$store.getters.defaultUser);
            this.$store.commit("SET_ISLOG", false);
            this.$store.commit("SET_ISSEARCH", false);
            this.$router.push({ path: "/" });
          } else {
            if (result.data.success) {
              if (result.data.movies.length > 0) {
                if (
                  (params.genre === "" || params.keywords === "") &&
                  params.page > 1
                ) {
                  this.movies.push(...result.data.movies);
                } else {
                  this.movies = result.data.movies;
                }
                this.searchParams = params;
              } else {
                this.searchParams.page = 1;
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    toggleSearch() {
      this.$store.commit("SET_ISSEARCH", !this.$store.getters.isSearch);
    },
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
          this.$store.commit("SET_ISSEARCH", false);
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
      try {
        if (!this.$store.getters.isSearch) {
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
            this.$store.commit("SET_ISSEARCH", false);
            this.$router.push({ path: "/" });
          } else {
            if (result.data.success) {
              this.news = result.data.news;
              this.popular = result.data.popular;
              this.foreground = this.popular[
                Math.floor(Math.random() * (this.popular.length - 1 + 1))
              ];
              this.bannerStyle = {
                background: `url(${this.foreground.background}) no-repeat`,
                backgroundSize: "cover"
              };
              this.bookmarkList = result.data.bookmarks;
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  watch: {
    "$store.getters.isSearch": async function(newVal, oldVal) {
      await this.onCreate();
    }
  },
  async created() {
    await this.onCreate();
  }
};
</script>
