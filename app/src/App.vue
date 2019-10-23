<template>
  <v-app id="backblack">
    <div v-if="$store.getters.isLog">
      <NavBar />
    </div>
    <transition :name="transitionName" mode="out-in">
      <router-view />
    </transition>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar";
import router from "./router";

export default {
  name: "App",
  components: {
    NavBar
  },
  data: () => ({
    transitionName: ""
  }),
  watch: {
    $route(to, from) {
      let routeFrom = router.resolve(from).route;
      let routeTo = router.resolve(to).route;
      if (routeFrom.name === "settings" && routeTo.name === "store") {
        this.transitionName = "fade-right";
      } else {
        this.transitionName = routeTo.meta.transition_route;
      }
    }
  },
  created() {}
};
</script>


<style lang="css">
@import "./style/style.css";
</style>

<style lang='sass'>
  @import "./style/transition.scss"
</style>
