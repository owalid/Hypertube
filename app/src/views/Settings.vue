<template>
  <div id="backblack">
    <v-container fluid>
      <v-row align="center" style="height: 80vh" class="ma-5">
        <v-card dark max-width="500" width="35rem" class="mx-auto">
          <v-tabs fixed-tabs>
            <v-tab @click="changeTab('avatar')">{{$t('avatar')}}</v-tab>
            <v-tab @click="changeTab('names')">{{$t('names')}}</v-tab>
            <v-tab v-if="!$store.getters.strategy" @click="changeTab('security')">{{$t('pwd')}}</v-tab>
          </v-tabs>
          <v-card-text>
            <div v-if="currentTab === 'avatar'">
              <UpdateAvatar />
            </div>
            <div v-if="currentTab === 'names'">
              <UpdateNames />
            </div>
            <div v-if="currentTab === 'security'">
              <UpdateSecurity />
            </div>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import UpdateAvatar from "@/components/settings/UpdateAvatar";
import UpdateNames from "@/components/settings/UpdateNames";
import UpdateSecurity from "@/components/settings/UpdateSecurity";

export default {
  data() {
    return {
      currentTab: "Settings"
    };
  },
  components: {
    UpdateAvatar,
    UpdateNames,
    UpdateSecurity
  },
  methods: {
    changeTab(tab) {
      if (tab === "avatar") {
        this.currentTab = "avatar";
      } else if (tab === "names") {
        this.currentTab = "names";
      } else {
        this.currentTab = "security";
      }
    }
  },

  data() {
    return {
      currentTab: "avatar"
    };
  }
};
</script>
