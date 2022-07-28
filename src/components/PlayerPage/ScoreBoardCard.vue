<template>
  <div>
    <article class="scoreboard_card" v-if="JSON.stringify(scoreboard) != '[]'">
      <section v-if="!loading" class="log">
        <score-card
          v-for="score in scoreboard"
          class="load_hidden"
          :key="score.standing"
          :score="score"
        />
      </section>
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
        this.$store.commit("update_tab_location", 1)
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
.scoreboard_card {
  display: grid;
  grid-auto-rows: auto min-content;
  // max-height: 75vh;
  height: 100%;
  overflow-y:  hidden;
  row-gap: 10px;
}
.log {
  overflow-y: scroll;
  row-gap: 10px;
  width: 100%;
  max-height: 100%;
  }
</style>