<template>
  <div>
    <article class="scoreboard_card" v-if="JSON.stringify(scoreboard) != '[]'">
      <score-card
        v-for="score in scoreboard"
        :key="score.standing"
        :score="score"
      />
      <v-btn
        elevation="3"
        block
        x-large
        :loading="loading"
        @click="update_scoreboard"
        color="rgba(0, 0, 0, 0.178)">
        UPDATE SCOREBOARD
      </v-btn>
    </article>
  </div>
</template>

<script>
import ScoreCard from "@/components/PlayerPage/ScoreCard.vue";
export default {
  components: { ScoreCard },
  data() {
    return {
      loading: false
    }
  },
  name: "score-board-card",
  methods: {
    update_scoreboard() {
      this.$store.dispatch("get_scoreboard");
      this.$store.dispatch("get_user_profile")
      this.$store.dispatch('get_check_log')
      this.loading = !this.loading
      setTimeout(()=>{
        this.loading = !this.loading
        this.$store.commit("update_tab_location", 0)
      }, 1500)
    }
  },
  mounted() {
    if (JSON.stringify(this.scoreboard) === "[]") {
      this.update_scoreboard()
    }
  },
  computed: {
    token: {
      get() {
        return this.$store.state["token"];
      },
    },
    scoreboard: {
      get() {
        return this.$store.state["scoreboard"];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
</style>