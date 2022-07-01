<template>
  <div class="checkpoint_container">
    <!-- challenge tab -->
    <article v-if="tab_location === 1 && is_challenge_active">
      <rock-paper-scissors v-if="challenge_type === 0" />
    </article>
    <!-- checkin tab -->
    <article class="log_container" v-else-if="tab_location === 0">
      <log-card
        :highlight="false"
        v-for="card in check_log"
        :key="card.checkpointId + 0.98"
        :card="card"
      />
      <log-card
        :highlight="true"
        v-if="temp_checkin_card != undefined"
        :card="temp_checkin_card"
      />
    </article>
    <!-- location tab -->
    <article class="log_container" v-else-if="tab_location === 2">
      <view-card
        v-for="card in checkpoint"
        :key="card.checkpointId + 365.4"
        :card="card"
        class=""
      />
    </article>
    <!-- ongoing games tab -->
    <article
      class="log_container"
      v-else-if="
        tab_location === 1 &&
        JSON.stringify(open_checkpoints) != '[]' &&
        !is_challenge_active
      "
    >
      <v-card class="mx-auto" :rounded="true" :raised="true">
        <v-card-title>Open Checkpoints</v-card-title>
        <v-container>
          <v-row v-for="check in open_checkpoints" :key="check.check_token">
            <v-col align="center">
              <v-btn
                color="light-blue"
                @click="open_checkpoints_button(check.check_token)"
                >{{ check.name }}</v-btn
              ></v-col
            ></v-row
          >
        </v-container>
      </v-card>
    </article>
    <!-- the tab -->
    <article class="nothing_message" v-else>
      <h1>{{ tabs[1]["title"] }}</h1>
      <h4>there are currently none available</h4>
    </article>
  </div>
</template>

<script>
import RockPaperScissors from "@/components/checkpoints/RockPaperScissors.vue";
import LogCard from "@/components/checkpoints/LogCard.vue";
import ViewCard from "@/components/checkpoints/ViewCard.vue";

export default {
  name: "CheckpointPage",
  data() {
    return {
      tabs: [
        { title: "check-in", id: 1, text: "lorem" },
        { title: "challenge", id: 2, text: "lorem2" },
        { title: "location", id: 3, text: "lorem3" },
      ],
      is_challenge_active: false,
      challenge_type: undefined,
      // nav bar title
      nav_bar_title: "checkpoint",
      temp_checkin_card: undefined,
      open_checkpoints: [],
    };
  },
  methods: {
    game_complete: function (game_result) {
      console.log(this.check_log);
      this.tab_location = 0;
      this.is_challenge_active = false;
      // clear store game info
      this.check_token = undefined;
      this.game = undefined;
      // store the result somewhere for the log tab

      // duplicate entry when leaving page and return to checkpoint page to complete game
      // check to eliminate duplicate entry
      if (
        !this.check_log.some(function (check) {
          return check.checkpointId === game_result.checkpointId;
        })
      ) {
        this.check_log = game_result;
      } else {
        console.log("duplicate entry for game completion")
      }
      this.challenge_type = undefined;
      console.log(this.check_log);
      console.log(game_result);
      let checkpoint_id = game_result.checkpointId;
      if (
        typeof this.open_checkpoints.find(
          (o) => o.checkpoint_id === checkpoint_id
        ) === "object"
      ) {
        // delete completed game from open checkpoints
        let removed_item = this.open_checkpoints.splice(
          this.open_checkpoints
            .map(function (o) {
              return o.checkpoint_id;
            })
            .indexOf(checkpoint_id),
          1
        );
        removed_item;
      }
    },
    get_checkpoint_info: function () {
      // request
      let response = undefined;
      this.$axios
        .request({
          url: "http://localhost:5000/api/check-in",
          params: {
            userId: this.token.userId,
            checkToken: this.check_token,
          },
        })
        .then((res) => {
          response = res.data;
          // enable game
          this.challenge_type = response["gameType"];
          this.game = response;
          // check to see if game is active
          if (response.isActive === 1) {
            this.is_challenge_active = true;
          } else {
            // switch to log tab
            this.tab_location = 0;
            // show finished game result
            this.temp_checkin_card = response;
            this.$store.commit(
              "update_error_message",
              "looks like you have already completed this game"
            );
            this.check_token = undefined;
            this.game = undefined;

            setTimeout(() => {
              this.temp_checkin_card = undefined;
            }, 3000);
          }
        })
        .catch((err) => {
          this.error_message = err.response.data;
          setTimeout(() => {
            this.error_message = undefined;
          }, 3000);
        });
    },
    open_checkpoints_button: function (token) {
      this.check_token = token;
      this.get_checkpoint_info();
    },
    update_checkpoint: function () {
      // request
      this.$axios
        .request({
          url: "http://localhost:5000/api/checkpoints",
          params: {
            gameToken: this.token.gameToken,
          },
        })
        .then((res) => {
          // update checkpoint state
          this.checkpoint = res.data;
        })
        .catch((err) => {
          // display error message
          this.error_message = err.response.data;
          setTimeout(() => {
            this.error_message = undefined;
          }, 6000);
        });
    },
    check_for_open_checkpoints: function () {
      // request
      this.$axios
        .request({
          url: "http://localhost:5000/api/checkpoints/status",
          params: {
            userId: this.token.userId,
          },
        })
        .then((res) => {
          this.open_checkpoints = res.data;
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
  },
  mounted() {
    // default tab = location
    if (this.check_token === undefined) {
      this.tab_location = 2;
    }
    // query check for checkToken
    if (this.$route.query.checkToken != undefined) {
      this.check_token = this.$route.query.checkToken;
      // switch to challenge tab if query is present
      this.tab_location = 1;
    }
    // cookie check
    if (this.$cookies.get("token") != undefined) {
      if (this.$cookies.get("token").loginToken != undefined) {
        this.$router.push({
          name: "LandingPage",
        });
        // disable nav bar
        this.$store.commit("update_tabs", false);
      }
      // send tab info
      this.$store.commit("update_tabs", this.tabs);
      // send page name
      this.$store.commit("update_title", this.nav_bar_title);
      // update check log if state is empty
      if (JSON.stringify(this.check_log) === "[]") {
        this.$store.dispatch("get_check_log");
      }
      // update checkpoint if state is empty
      if (JSON.stringify(this.checkpoint) === "[]") {
        this.update_checkpoint();
      }
      // checkpoint info request
      if (this.game === undefined && this.check_token != undefined) {
        this.get_checkpoint_info();
      } else if (this.game != undefined && this.check_token != undefined) {
        if (this.tab_location != 1) {
          this.tab_location = 1;
        }
        if (!this.is_challenge_active) {
          this.is_challenge_active = true;
        }
        if (this.challenge_type === undefined) {
          this.challenge_type = this.game.gameType;
        }
        console.log("restart existing game");
      }
      // check to see if there are any open checkpoints
      if (this.game === undefined && this.check_token === undefined) {
        this.check_for_open_checkpoints();
      }
    } else {
      this.$router.push({
        name: "LandingPage",
      });
      // error message
      this.$store.commit(
        "update_error_message",
        "please sign in first to continue..."
      );
      this.$store.commit("update_tabs", false);
    }
  },
  created() {
    // listen for games completing
    this.$root.$on("gameComplete", this.game_complete);
  },
  beforeDestroy() {
    this.$root.$off("gameComplete", this.game_complete);
  },
  components: {
    RockPaperScissors,
    LogCard,
    ViewCard,
  },
  computed: {
    token() {
      return this.$store.state["token"];
    },
    game: {
      get() {
        return this.$store.state["game"];
      },
      set(value) {
        this.$store.commit("update_game", value);
      },
    },
    check_log: {
      get() {
        return this.$store.state["check_log"];
      },
      set(value) {
        this.$store.commit("update_check_log", value);
      },
    },
    checkpoint: {
      get() {
        return this.$store.state["checkpoint"];
      },
      set(value) {
        this.$store.commit("update_checkpoint", value);
      },
    },
    tab_location: {
      get() {
        return this.$store.state["tab_location"];
      },
      set(value) {
        this.$store.commit("update_tab_location", value);
      },
    },
    check_token: {
      get() {
        return this.$store.state["check_token"];
      },
      set(value) {
        this.$store.commit("update_check_token", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.log_container {
  display: grid;
  justify-items: center;
  align-items: start;
  grid-auto-rows: auto;
  row-gap: 10px;
  width: 100%;
  align-self: start;
  overflow-y: scroll;
  max-height: 75vh;
}
.nothing_message {
  text-align: center;
}
.checkpoint_container {
  display: grid;
  place-items: center;
  height: 100%;
}
</style>

