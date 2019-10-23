<template>
  <div class="ma-5">
    <h2 class="ma-5" style="color: white">{{ title }}</h2>
    <v-sheet style="background-color: rgba(0,0,0,0)" dark elevation="8" max-width="200vh">
      <v-slide-group v-model="model" show-arrows>
        <v-slide-item v-for="movie of movies" :key="movie._id" v-slot:default="{ active, toggle }">
          <v-card
            :color="active ? 'primary' : 'grey lighten-1'"
            class="ma-4"
            width="200px"
            @click="toggle"
          >
            <v-img
              :src="movie.thumbview"
              class="white--text"
              height="100%"
              width="100%"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            >
              <div v-if="viewed(movie._id)">
                <v-icon dark right color="red darken-3">mdi-eye</v-icon>
              </div>
            </v-img>
            <v-row class="fill-height" align="center" justify="center"></v-row>
          </v-card>
        </v-slide-item>
      </v-slide-group>
      <v-expand-transition>
        <v-sheet dark v-if="model != null" tile>
          <v-row class="fill-height" align="center">
            <v-row v-if="tab === 'infos'">
              <v-col col="6" class="ma-5">
                <v-card-title
                  class="ml-1 display-1 font-weight-light"
                >{{ movies[model].title | capitalize }}</v-card-title>
                <v-row class="ma-4">
                  <v-rating
                    :value="movies[model].rating / 10 * 5"
                    color="amber"
                    half-increments
                    dense
                    size="14"
                    readonly
                  ></v-rating>
                  <div class="grey--text ml-4">{{ Math.floor(movies[model].rating / 10 * 5) }}/5</div>
                </v-row>
                <!-- <v-card-text></v-card-text> TODO ADD TIME -->
                <v-card-text>{{ movies[model].year }}</v-card-text>
                <Bookmark :movieId="movies[model]._id" :updateBM="updateBM" />
                <div v-if="movies[model]._id">
                  <v-btn
                    class="ma-2"
                    tile
                    outlined
                    color="red darken-3"
                    :to="{ name: 'movie', params: { idMovie: movies[model]._id }}"
                  >
                    <v-icon left>mdi-play</v-icon>
                    {{ $t('slides.play')}}
                  </v-btn>
                </div>
              </v-col>
              <v-col col="6">
                <v-card-text>
                  <v-card-title>{{$t('slides.synopsis')}}</v-card-title>
                  <Promised :promise="trad(movies[model].synopsis)">
                    <template v-slot:pending>
                      <p>Loading...</p>
                    </template>
                    <template v-slot="data">{{data}}</template>
                    <template v-slot:rejected="error">{{ movies[model].synopsis }}</template>
                  </Promised>
                </v-card-text>
              </v-col>
            </v-row>
            <div v-else justify="center">
              <v-container justify="center" fluid>
                <v-row no-gutters justify="center">
                  <v-col xs="4" sm="4" lg="12" md="6" justify="center">
                    <Suggestions :movie="movies[model]"  />
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-row>
          <v-tabs class="mx-auto">
            <v-tab @click="changeTab('infos')">{{$t('slides.infos')}}</v-tab>
            <v-tab @click="changeTab('suggestions')">{{$t('slides.suggestion')}}</v-tab>
          </v-tabs>
        </v-sheet>
      </v-expand-transition>
    </v-sheet>
  </div>
</template>

<script>
import Suggestions from "../components/Suggestions";
import Bookmark from "@/components/Bookmark";
import { Promised } from "vue-promised";
export default {
  props: {
    movies: Array,
    title: String,
    updateBM: Function
  },
  components: {
    Promised
  },
  data() {
    return {
      selectedMovie: {},
      model: null,
      active: false,
      viewedList: this.$store.getters.user.list,
      tab: "infos",
      synopsis: ""
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
    Suggestions,
    Bookmark
  },
  methods: {
    changeTab(tab) {
      this.tab = tab;
    },

    viewed(movieId) {
      return (this.viewedList && this.viewedList.length > 0) ? (this.viewedList.find(x => x.idMovie === movieId) ? true : false) : false;
    
    },

    async trad(text) {
        const key = process.env.VUE_APP_GTRANSLATE_API;
        const target = this.$store.getters.user.lang || process.env.VUE_APP_I18N_LOCALE;
        const url =`https://translation.googleapis.com/language/translate/v2?key=${key}&target=${target}&source=en&format=text&q=` + text;
        if (target !== "us") {
          try {
            let trad = await axios.post(url);
            text = trad.data.data.translations[0].translatedText;
            return(text);
          } catch(e) {
            return(text);
          }
        } else {
          return (text)
        }
    },
  }
};
</script>
