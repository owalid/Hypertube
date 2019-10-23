<template>
  <div>
    <v-row class="ma-5">
      <v-col
        v-for="movie in movies"
        :key="movie.id"
        class="d-flex child-flex"
        md="2"
        sm="6"
        xs="12"
      >
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }" height="250px">
            <v-img
              :src="movie.thumbview"
              :lazy-src="movie.thumbview"
              aspect-ratio="1"
              height="100%"
              class="grey lighten-2"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal display-3 white--text"
                  style="height: 100%; font-size:10px"
                >
                  <v-card-text>
                    <v-row class="fill-height flex-column text-center" justify="space-between">
                      <div>
                        <p
                          class="ma-0 body-1 font-weight-bold text-left"
                        >{{ movie.title.charAt(0).toUpperCase() + movie.title.slice(1) }}</p>
                        <p class="caption font-weight-medium text-left">{{ movie.year }}</p>
                        <v-rating
                          :value="movie.rating / 10 * 5"
                          color="amber"
                          half-increments
                          dense
                          size="14"
                          readonly
                        ></v-rating>
                      </div>
                      <div class="align-self-center" v-if="movie._id">
                        <v-btn
                          :to="{ name: 'movie', params: { idMovie: movie._id }}"
                          class="ma-5"
                          fab
                          dark
                          color="red darken-3"
                        >
                          <v-icon dark>mdi-play</v-icon>
                        </v-btn>
                        <!-- <v-btn :class="{ 'show-btns': hover }" color="transparent">
                          <v-icon :class="{ 'show-btns': hover }" color="transparent">mdi-play</v-icon>
                        </v-btn>-->
                      </div>
                    </v-row>
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-img>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "RenderSearch",
  props: {
    movies: Array,
    getMovies: Function,
    searchParams: Object
  },

  mounted() {
    this.scroll();
  },

  methods: {
    scroll() {
      if (this.$store.getters.isSearch) {
        window.onscroll = async () => {
          const bottom =
            document.documentElement.scrollTop + window.innerHeight ===
            document.documentElement.offsetHeight;
          if (bottom) {
            const params = this.searchParams;
            params.page++;
            await this.getMovies(params);
          }
        };
      }
    }
  }
};
</script>