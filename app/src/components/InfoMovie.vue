<template>
  <div>
    <v-row dark>
      <v-col cols="4" class="pl-6" align="center">
        <v-img
          :src="movie.thumbview"
          :lazy-src="movie.thumbview"
          max-height="500"
          max-width="550"
          aspect-ratio="0"
          class="grey lighten-2"
        ></v-img>
      </v-col>
      <v-col dark>
        <div
          class="ml-1 display-1 red--text text--darken-3 font-weight-light"
        >{{ movie.title | capitalize }}</div>
        <v-col>{{ movie.synopsis }}</v-col>
        <v-divider></v-divider>
        <v-container dark>
          <v-row>
            <v-col>
              <div class="pa-4">
                <div dark class="fill-height pa-2" align="center">
                  <v-row>
                    <h2 class="subtitle-2 pr-2 red--text text--darken-3">{{ $t('movie.genre') }}:</h2>
                  </v-row>
                  <v-row>
                    <span class="overline" v-for="(genre, idx) in movie.genres" :key="idx">
                      {{ $t(genre.charAt(0).toUpperCase() + genre.slice(1)) }}
                      <span class="pr-1"></span>
                      <span class="overline" v-if="idx < movie.genres.length - 1">|</span>
                      <span class="pl-1"></span>
                    </span>
                  </v-row>
                </div>
                <div dark class="fill-height pa-2" align="center">
                  <v-row>
                    <h2 class="subtitle-2 pr-2 red--text text--darken-3">{{ $t('movie.actors') }}:</h2>
                  </v-row>
                  <v-row>
                    <span class="overline">{{infoMovie.Actors}}</span>
                  </v-row>
                </div>
                <div dark class="fill-height pa-2" align="center">
                  <v-row>
                    <h2 class="subtitle-2 pr-2 red--text text--darken-3">{{ $t('movie.prod') }}:</h2>
                  </v-row>
                  <v-row>
                    <span class="overline">{{infoMovie.Production}}</span>
                  </v-row>
                </div>
                <div dark class="fill-height pa-2" align="center">
                  <v-row>
                    <h2 class="subtitle-2 pr-2 red--text text--darken-3">{{ $t('movie.award') }}:</h2>
                  </v-row>
                  <v-row>
                    <span class="overline">{{infoMovie.Awards}}</span>
                  </v-row>
                </div>
                <div dark class="fill-height pa-2" align="center">
                  <v-row>
                    <h2 class="subtitle-2 pr-2 red--text text--darken-3">{{ $t('movie.director') }}:</h2>
                  </v-row>
                  <v-row>
                    <span class="overline">{{infoMovie.Director}}</span>
                  </v-row>
                </div>
              </div>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
              <div class="pa-4">
                <div dark class="fill-height pa-2" align="center">
                  <v-row>
                    <h2 class="subtitle-2 pr-2 red--text text--darken-3">{{ $t('movie.date') }}:</h2>
                  </v-row>
                  <v-row>
                    <span class="overline">{{movie.year}}</span>
                  </v-row>
                </div>
                <div dark class="fill-height pa-2" align="center">
                  <v-row>
                    <h2 class="subtitle-2 pr-2 red--text text--darken-3">{{ $t('movie.country') }}:</h2>
                  </v-row>
                  <v-row>
                    <span class="overline">{{infoMovie.Country}}</span>
                  </v-row>
                </div>
                <div dark class="fill-height pa-2" align="center">
                  <v-row>
                    <h2 class="subtitle-2 pr-2 red--text text--darken-3">{{ $t('movie.duration') }}:</h2>
                  </v-row>
                  <v-row>
                    <span class="overline">{{infoMovie.Runtime}}</span>
                  </v-row>
                </div>
                <div dark class="fill-height pa-2" align="center">
                  <v-row>
                    <h2
                      class="subtitle-2 pr-2 red--text text--darken-3"
                    >{{ $t('movie.boxoffice') }}:</h2>
                  </v-row>
                  <v-row>
                    <span class="overline">{{infoMovie.BoxOffice}}</span>
                  </v-row>
                </div>
                <div dark class="fill-height pa-2" align="center">
                  <v-row>
                    <h2 class="subtitle-2 pr-2 red--text text--darken-3">{{ $t('movie.rate') }}:</h2>
                  </v-row>
                  <v-row>
                    <v-rating
                      :value="10 - movie.rating"
                      color="amber"
                      half-increments
                      dense
                      size="14"
                      readonly
                    ></v-rating>
                  </v-row>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "InfoMovie",
  props: {
    movie: Object
  },
  data() {
    return {
      infoMovie: ""
    };
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.toUpperCase();
    }
  },
  async created() {
    this.infoMovie = await axios.get(
      `http://www.omdbapi.com/?i=${this.movie.imdb_code}&apikey=${process.env.VUE_APP_API_KEY_OMDB}`
    );
    this.infoMovie = this.infoMovie.data;
    const key = process.env.VUE_APP_GTRANSLATE_API;
    const target = this.$store.getters.user.lang || process.env.VUE_APP_I18N_LOCALE;
    const url =`https://translation.googleapis.com/language/translate/v2?key=${key}&target=${target}&source=en&format=text&q=` + this.movie.synopsis;
    if (target !== "us") {
      try {
        let trad = await axios.post(url);
        this.movie.synopsis = trad.data.data.translations[0].translatedText;
      } catch(e) {
       this.movie.synopsis = this.movie.synopsis;
      }
    }
  }
};
</script>