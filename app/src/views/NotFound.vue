<template>
  <v-container 
    id="back"
    fill-height
    style="height: calc(100vh - 58px);"
  >
    <v-layout align-center>
      <v-flex text-center>
        <h1 class="display-2 white--text">{{$t('404.title')}}</h1>
        <p>{{$t('404.desc')}}</p>
        <v-btn
          to='/'
          outlined
          color="white"
        >
          {{$t('404.redirect')}}
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: "NotFound"
};
</script>