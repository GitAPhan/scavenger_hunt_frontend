<template>
    <div class="game_container">
        <h2 class="make_float">{{ game_message }}</h2>
        <!-- animated view -->
        <article class="game_window">
            <!-- player choice -->
            <transition name="swap" mode="out-in">
                <img v-if="choice === 'ROCK'" src="rock_left.png" alt="rock" />
                <img v-else-if="choice === 'PAPER'" src="paper_left.png" alt="paper" />
                <img v-else-if="choice === 'SCISSORS'" src="scissors_left.png" alt="scissors" />
                <!-- computer choice -->
            </transition>
            <transition name="swap" mode="out-in">
                <img v-if="comp === 'ROCK'" src="rock_right.png" alt="rock" />
                <img v-else-if="comp === 'PAPER'" src="paper_right.png" alt="paper" />
                <img v-else-if="comp === 'SCISSORS'" src="scissors_right.png" alt="scissors" />
            </transition>
        </article>
        <!-- your choice -->
        <article class="game_buttons">
            <v-btn-toggle v-model="choice" tile color="deep-purple accent-3" group>
                <v-btn :disabled="loading" min-width="90px" value="ROCK">ROCK</v-btn>

                <v-btn :disabled="loading" min-width="90px" value="PAPER">PAPER</v-btn>

                <v-btn :disabled="loading" min-width="90px" value="SCISSORS">SCISSORS</v-btn>
            </v-btn-toggle>
            <v-btn
                v-if="choice === undefined"
                elevation="2"
                :disabled="true"
                outlined
                large
                text
                tile
            >make a choice</v-btn>
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
            >submit choice</v-btn>
        </article>
        <!-- scoreboard/round info -->
        <article class="game_scoreboard">
            <h3>score:</h3>
            <h2>rounds:</h2>
            <h3>tokens:</h3>
            <h3>{{ session.pointsWon }}</h3>
            <h2>{{ session.roundsPlayed }}/{{ session.rounds }}</h2>
            <h3>{{ session.tokensWon }}</h3>
        </article>
        <!-- challenge info -->
        <article class="game_info">
            <p>
                GAME: rock paper scissors
                <br />
                PRIZE: {{ session.tokenReward }} tokens & {{ session.pointReward }} points/round
            </p>
        </article>
    </div>
</template>

<script>
export default {
    name: 'rock-paper-scissors',
    data() {
        return {
            choice: undefined,
            comp: undefined,
            game_message: 'make your choice!',
            loading: false,
        }
    },
    methods: {
        loader() {
            this.loading = !this.loading
            // animation to show computer choosing
        },
        clear() {
            this.choice = undefined,
            this.comp = undefined,
            this.game_message = 'make your choice'
            this.loading = !this.loading
        },
        submit_choice() {
            // loader
            this.loader()
            let response = undefined
            // prepare request data
            let request_data = {
                "checkToken": this.session.checkToken,
                "playerToken": this.session.playerToken,
                "gameToken": this.session.gameToken,
                "gameType": this.session.gameType,
                "playerChoice": this.choice
            }
            console.log(request_data)
            // request
            this.$axios.request({
                url: "http://localhost:5000/api/check-in",
                method: 'POST',
                data: request_data
            }).then((res) => {
                response = res.data
                this.$cookies.set('session', response)
                this.$store.commit('update_session', response)
                this.comp = response.lastRound.computer
                console.log(response)
            }).catch((err) => {
                response = err.response.data
            })
            setTimeout(() => { this.clear() }, 2000)
        }
    },
    mounted () {
        if (this.token === undefined) {
            this.$store.dispatch('update_token_cookie')
        }
        if (this.session === undefined) {
            this.$store.dispatch('update_session_cookie')
        }
        console.log('mounted')
        console.log(this.session)
        console.log(this.token)
    },
    computed: {
        token() {
            return this.$store.state['token']
        },
        session() {
            return this.$store.state['session']
        }
    },
}
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
    top: -40px;
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
img {
    height: 75px;
}
/* // transition settings // */
.swap-enter-active,
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