<template>
  <div>
    <v-col md="8" sm="10" class="mx-auto">
      <v-row>
        <v-text-field
          v-model="searchParams.keywords" 
          v-bind:label="$t('search.find')"
        ></v-text-field>
        <v-btn @click="keywordSearch" class="ma-3" text icon>
          <v-icon dark>mdi-magnify</v-icon>
        </v-btn>
      </v-row>
      <v-row>
        <v-col md="6">
          <v-subheader>{{ $t('movie.date') }}: {{ searchParams.years[0] }} - {{ searchParams.years[1] }}</v-subheader>
          <v-range-slider max="2019" min="1920" v-model="searchParams.years" @change="updateResults"></v-range-slider>
        </v-col>
        <v-col md="6">
          <v-subheader>{{ $t('movie.rate') }}: {{ searchParams.ratings[0] }} - {{ searchParams.ratings[1] }}</v-subheader>
          <v-range-slider max="10" min="0" v-model="searchParams.ratings" @change="updateResults"></v-range-slider>
        </v-col>
        <v-chip-group column justify="space-around" active-class="primary--text">
          <v-chip v-for="genre in genres" :key="genre" @click="updateGenres(genre)">{{ $t(genre) }}</v-chip>
        </v-chip-group>
      </v-row>
    </v-col>
  </div>
</template>
<script>
export default {
  name: "Search",
  props: {
    movies: Array,
    getMovies: Function,
    searchParams: Object
  },
  data() {
    const currentYear = new Date().getFullYear();
    return {
      genres: [
        "Action",
        "Adventure",
        "Animation",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Family",
        "Fantasy",
        "History",
        "Horror",
        "Music",
        "Mystery",
        "Romance",
        "Sport",
        "Thriller",
        "War",
        "Western"
      ]
    };
  },
  methods: {
    updateGenres(genre) {
      this.searchParams.genre = (genre === this.searchParams.genre) ? null : genre;
      this.searchParams.genre = (!genre) ? "" : genre;
      this.searchParams.keywords = "";
      this.searchParams.page = 1;
      this.getMovies(this.searchParams);
    },

    updateResults() {
      this.getMovies(this.searchParams);
    },

    keywordSearch() {
      this.searchParams.genre = '';
      this.searchParams.page = 1;
      this.getMovies(this.searchParams);
    }
  },
  beforeMount() {
    this.getMovies(this.searchParams);
  }
};
</script>