<template>
  <div class="game_container">
    <h2 class="make_float">{{ game_message }}{{ game.gameName }}</h2>
    <!-- game result -->
    <article class="result_window" v-if="last_round != undefined">
      <h3>{{ round_result }}</h3>
      <h4>You: {{ last_round.player }}</h4>
      <h4>Computer: {{ last_round.computer }}</h4>
    </article>
    <!-- animated view -->
    <article v-else class="game_window">
      <!-- computer choice -->
      <section>
        <!-- computer selection animation -->
        <span v-if="comp === undefined">
          <transition name="swap" mode="out-in">
            <img v-if="animation === 1" src="rock_left.png" alt="rock" />
            <img v-else-if="animation === 3" src="paper_left.png" alt="paper" />
            <img
              v-else-if="animation === 5"
              src="scissors_left.png"
              alt="scissors"
            />
          </transition>
        </span>
        <!-- actual choice -->
        <span>
          <img v-if="comp === 'ROCK'" src="rock_left.png" alt="rock" />
          <img v-else-if="comp === 'PAPER'" src="paper_left.png" alt="paper" />
          <img
            v-else-if="comp === 'SCISSORS'"
            src="scissors_left.png"
            alt="scissors"
          />
        </span>
      </section>
      <!-- player choice -->
      <!-- <transition name="swap" mode="out-in"> -->
      <img v-if="choice === 'ROCK'" src="rock_right.png" alt="rock" />
      <img v-else-if="choice === 'PAPER'" src="paper_right.png" alt="paper" />
      <img
        v-else-if="choice === 'SCISSORS'"
        src="scissors_right.png"
        alt="scissors"
      />
      <!-- </transition> -->
    </article>
    <!-- your choice -->
    <article class="game_buttons">
      <v-btn-toggle v-model="choice" tile color="deep-purple accent-3" group>
        <v-btn :disabled="loading" min-width="90px" value="ROCK">ROCK</v-btn>

        <v-btn :disabled="loading" min-width="90px" value="PAPER">PAPER</v-btn>

        <v-btn :disabled="loading" min-width="90px" value="SCISSORS"
          >SCISSORS</v-btn
        >
      </v-btn-toggle>
      <v-btn
        v-if="choice === undefined"
        elevation="2"
        :disabled="true"
        outlined
        large
        text
        tile
        >make a choice</v-btn
      >
      <v-btn
        v-else
        elevation="2"
        @click="submit_choice"
        :loading="loading"
        :disabled="loading"
        outlined
        large
        text
        tile
        >submit choice</v-btn
      >
    </article>
    <!-- scoreboard/round info -->
    <article class="game_scoreboard">
      <h3>score:</h3>
      <h2>rounds:</h2>
      <h3>tokens:</h3>
      <h3>{{ game.pointsWon }}</h3>
      <h2>{{ game.roundsPlayed }}/{{ game.rounds }}</h2>
      <h3>{{ game.tokensWon }}</h3>
    </article>
    <!-- challenge info -->
    <article class="game_info">
      <p>
        GAME: rock paper scissors
        <br />
        PRIZE: {{ game.tokenReward }} tokens &
        {{ game.pointReward }} points/round
      </p>
    </article>
  </div>
</template>

<script>
export default {
  name: "rock-paper-scissors",
  data() {
    return {
      choice: undefined,
      comp: undefined,
      game_message: "You've reached ",
      loading: false,
      animation: 0,
      last_round: undefined,
      round_result: undefined,
    };
  },
  watch: {
    last_round() {
      if (this.last_round != undefined) {
        if (this.last_round.isWin === 1) {
          this.round_result = "nice WIN!";
        } else if (this.last_round.isWin === 0) {
          this.round_result = "is a TIE is better than a lost?";
        } else {
          this.round_result = "too bad! Looks like you LOST!";
        }
      }
    },
  },
  methods: {
    loader() {
      this.loading = !this.loading;
      // animation to show computer choosing
    },
    clear() {
      (this.choice = undefined),
        (this.comp = undefined),
        (this.loading = !this.loading);
    },
    submit_choice() {
      // loader
      this.loader();
      let response = undefined;
      // prepare request data
      let request_data = {
        checkToken: this.check_token,
        playerToken: this.token.playerToken,
        gameToken: this.token.gameToken,
        gameType: this.game.gameType,
        playerChoice: this.choice,
      };
      // request
      this.$axios
        .request({
          url: "http://localhost:5000/api/check-in",
          method: "POST",
          data: request_data,
        })
        .then((res) => {
          response = res.data;
          this.game = response;
          this.comp = response.lastRound.computer;
          setTimeout(() => {
            this.last_round = response.lastRound;
            setTimeout(() => {
              this.last_round = undefined;
            }, 2000);
          }, 1500);

          // win check
          if (response.isActive === 0) {
            // win code
            setTimeout(() => {
              delete response.lastRound;
              console.log('game complete, global emit')
              this.$root.$emit("gameComplete", response);
            }, 2500);
          }
        })
        .catch((err) => {
          this.$store.commit("update_error_message", err.response.data);
        });
      setTimeout(() => {
        this.clear();
      }, 2500);
    },
  },
  mounted() {
    if (this.token === undefined) {
      this.$store.dispatch("update_token_cookie");
    }
    if (this.comp === undefined) {
      var counter = setInterval(() => {
        this.animation++;
        if (this.animation === 6) {
          this.animation = 0;
        }
      }, 500);
    } else {
      clearInterval(counter);
    }
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
    check_token: {
      get() {
        return this.$store.state["check_token"];
      },
    },
  },
};
</script>

<style>
.game_info {
  display: grid;
  place-items: center;
  text-align: center;
}
.game_scoreboard {
  margin: 50px 0px;
  display: grid;
  place-items: center;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
}
.make_float {
  position: absolute;
  top: 0px;
}
.game_buttons {
  display: grid;
  place-items: center;
}
.game_container {
  display: grid;
  place-items: center;
  height: 100%;
  width: 100%;
}
.game_container > article > h3,
h2 {
  display: inline-block;
}
.game_window {
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 120px;
}
.result_window {
  display: grid;
  place-items: center;
  width: 100%;
  height: 120px;
}
img {
  height: 75px;
}
/* // transition settings // */
.swap-enter-active {
  transition: all 0.75s ease-in-out;
}
.swap-leave-active {
  transition: all 0.45s ease-in-out;
}

.swap-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.swap-enter {
  opacity: 0;
  transform: translateX(20px);
}

.swap-enter-to,
.swap-leave {
  opacity: 1;
  transform: translateX(0);
}
</style>