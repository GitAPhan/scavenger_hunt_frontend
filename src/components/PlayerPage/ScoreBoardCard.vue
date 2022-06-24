<template>
  <div>
    <article class="scoreboard_card" v-if="JSON.stringify(scoreboard) != '[]'">
      <score-card
        v-for="score in scoreboard"
        :key="score.standing"
        :score="score"
      />
    </article>
  </div>
</template>

<script>
import ScoreCard from "@/components/PlayerPage/ScoreCard.vue";
export default {
  components: { ScoreCard },
  name: "score-board-card",
  mounted() {
    if (JSON.stringify(this.scoreboard) === "[]") {
      this.$store.dispatch("get_scoreboard");
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