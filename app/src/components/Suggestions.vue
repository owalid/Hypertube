<template>
  <div>
    <v-sheet elevation="4" max-width="200vh">
      <v-slide-group show-arrows>
        <v-slide-item v-for="suggestion in suggestions" :key="suggestion.id">
          <v-hover v-slot:default="{ hover }">
            <v-card
              :elevation="hover ? 12 : 2"
              :class="'ma-5 ' + {'on-hover': hover }"
              width="150px"
            >
              <v-img
                :src="suggestion.medium_cover_image"
                :lazy-src="suggestion.medium_cover_image"
                aspect-ratio="1"
                height="100%"
                width="100%"
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
                          >{{ suggestion.title.charAt(0).toUpperCase() + suggestion.title.slice(1) }}</p>
                          <p class="caption font-weight-medium text-left">{{ suggestion.year }}</p>
                          <v-rating
                            :value="suggestion.rating / 10 * 5"
                            color="amber"
                            half-increments
                            dense
                            size="14"
                            readonly
                          ></v-rating>
                        </div>
                      </v-row>
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-img>
            </v-card>
          </v-hover>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
export default {
  props: {
    movie: Object
  },

  data() {
    return {
      model: null,
      suggestions: []
    };
  },

  async created() {
    try {
      const sourceId = this.movie.source.id;
      const result = await axios.get(
        `https://yts.lt/api/v2/movie_suggestions.json?movie_id=${sourceId}`
      );
      if (result.data) {
        this.suggestions = result.data.data.movies;
      }
    } catch (err) {
      console.log(err);
    }
  }
};
</script>