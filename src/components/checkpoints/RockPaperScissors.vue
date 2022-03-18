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
                <img v-if="comp === 1" src="rock_right.png" alt="rock" />
                <img v-else-if="comp === 2" src="paper_right.png" alt="paper" />
                <img v-else-if="comp === 3" src="scissors_right.png" alt="scissors" />
            </transition>
        </article>
        <!-- your choice -->
        <article class="game_buttons">
            <v-btn-toggle v-model="choice" tile color="deep-purple accent-3" group>
                <v-btn :disabled="loading" min-width="90px" value="ROCK">ROCK</v-btn>

                <v-btn :disabled="loading" min-width="90px" value="PAPER">PAPER</v-btn>

                <v-btn :disabled="loading" min-width="90px" value="SCISSORS">SCISSORS</v-btn>
            </v-btn-toggle>
            <v-btn elevation="2" @click="loader" :loading="loading" :disabled="loading" outlined large text tile>submit choice</v-btn>
        </article>
        <!-- scoreboard/round info -->
        <article class="game_scoreboard">
            <h3>score:</h3>
            <h2>200</h2>
            <h3>round:</h3>
            <h2>1/3</h2>
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
            let token = this.$cookies.get('token')
            let request_data = {
                "playerToken": token.playerToken,
                "gameToken": token.gameToken,
                "gameType": 0, //rock paper scissors is type 0
                "playerChoice": this.choice
            }
            // request
            this.$axios.request({
                url: "http://localhost:5000/api/check-in",
                method: 'POST',
                data: request_data
            }).then((res) => {
                response = res.data
            }).catch((err) => {
                response = err.response.data
            })
            console.log(response)
        }
    },
}
</script>

<style>
.game_scoreboard {
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr 1fr 1fr;
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