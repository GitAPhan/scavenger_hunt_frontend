<template>
  <div>
    <h2>id#{{ user_profile.userId }}</h2>
    <h1>{{ user_profile.username }}</h1>
    <h4>{{ user_profile.name }}</h4>
    <h3>{{ user_profile.email }}</h3>

    <h2 class="profile_title">current standing:</h2>
    <div ref="profile_card" class="profile_card">
      <h2>#{{ user_score.standing }}</h2>
      <h5>{{ user_score.username }}</h5>
      <h4>
        {{ user_score.score }}
        <h6>points</h6>
      </h4>
    </div>
    <div v-if="top_score != undefined">
      <h2 class="profile_title">your top score:</h2>
      <log-card class="log_card" :highlight="false" :card="top_score" />
    </div>
  </div>
</template>

<script>
import LogCard from "@/components/checkpoints/LogCard.vue";
export default {
  name: "profile-card",
  components: {
    LogCard,
  },
  computed: {
    token: {
      get() {
        return this.$store.state["token"];
      },
    },
    user_profile: {
      get() {
        return this.$store.state["user_profile"];
      },
    },
    user_score: {
      get() {
        return this.$store.state["user_score"];
      },
    },
    top_score: {
      get() {
        return this.$store.state["user_top_score"];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
div > .profile_card {
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  border: 1px white solid;
  background-color: rgba(0, 0, 0, 0.178);
  min-height: 55px;
  margin-bottom: 10px;
}
div > .profile_title {
  margin-top: 20px;
  + .log_card {
    width: 100%;
  }
}
</style>