<template>
    <div class="checkpoint_container">
        <!-- challenge tab -->
        <article v-if="tab === 1 && is_challenge_active">
            <rock-paper-scissors :game="game" v-if="challenge_type === 0" />
        </article>
        <!-- checkpoint tab -->
        <article class="log_container" v-else-if="tab === 0">
            <view-card
                v-for="card in checkpoint"
                :key="card.checkpointId"
                :card="card"
            />
        </article>
        <!-- log tab -->
        <article class="log_container" v-else-if="tab === 2">
            <log-card
                v-for="card in check_log"
                :key="card.checkpointId+365.4"
                :card="card"
            />
        </article>
        <!-- the tab -->
        <article class="nothing_message" v-else>
            <h1>{{ tabs[1]['title'] }}</h1>
            <h4>there are currently none available</h4>
            <p>{{ error_message }}</p>
        </article>
    </div>
</template>

<script>
import RockPaperScissors from "@/components/checkpoints/RockPaperScissors.vue"
import LogCard from "@/components/checkpoints/LogCard.vue"
import ViewCard from "@/components/checkpoints/ViewCard.vue"

export default {
    name: 'CheckpointPage',
    data() {
        return {
            tabs: [
                { title: 'checkpoint', id: 1, text: 'lorem' },
                { title: 'challenge', id: 2, text: 'lorem2' },
                { title: 'log', id: 3, text: 'lorem3' },
            ],
            checkToken: this.$route.query.checkToken,
            is_challenge_active: false,
            challenge_type: undefined,
            error_message: undefined,
            userId: this.$cookies.get('token').userId
        }
    },
    methods: {
        emit_tab_info: function () {
            this.$emit('tab_info', this.tabs)
        },
        request_alert: function () {
            // an alert regarding a request has been broadcasted
            console.log(this.tabs)
        },
        game_complete: function (game_result) {
            this.$root.$emit('changeTab', 2)
            this.is_challenge_active = false
            // store the result somewhere for the log tab            
            this.$store.commit('update_check_log', game_result)
        },
        check_token_request: function () {

            if (this.checkToken != undefined && this.session === undefined) {
                // switch to challenge tab if query is present
                this.$root.$emit('changeTab', 1)
                let game = {
                    "playerToken": this.token.playerToken,
                    "gameToken": this.token.gameToken,
                    "checkToken": this.checkToken,
                    "userId": this.token.userId
                }
                this.$store.commit('update_game', game)
                // request
                let response = undefined
                this.$axios.request({
                    url: 'http://localhost:5000/api/check-in',
                    params: {
                        "userId": this.token.userId,
                        "checkToken": this.checkToken
                    }
                }).then((res) => {
                    response = res.data
                    // enable game
                    this.challenge_type = response['gameType']
                    this.$store.commit('update_session', response)
                    // check to see if game is active
                    if (response.isActive === 1) {
                        this.is_challenge_active = true
                    }

                }).catch((err) => {
                    this.error_message = err.response.data
                    setTimeout(() => { this.error_message = undefined }, 3000)
                })
            }
        },
        update_check_log: function () {
            // request
            this.$axios.request({
                url: "http://localhost:5000/api/check-in/log",
                params: {
                    "userId": this.token.userId
                }
            }).then((res) => {
                // update check_log state
                this.$store.commit('update_check_log', res.data)
            }).catch((err) => {
                // display error message
                this.error_message = err.response.data
                setTimeout(() => { this.error_message = undefined }, 6000)
            })
        },
        update_checkpoint: function () {
            // request
            this.$axios.request({
                url: "http://localhost:5000/api/checkpoints",
                params: {
                    "gameToken": this.token.gameToken
                }
            }).then((res) => {
                // update checkpoint state
                this.$store.commit('update_checkpoint', res.data)
            }).catch((err) => {
                // display error message
                this.error_message = err.response.data
                setTimeout(() => { this.error_message = undefined }, 6000)
            })
        }
    },
    mounted() {
        // cookie check
        if (this.$cookies.get('token') != undefined) {
            if (this.$cookies.get('token').loginToken != undefined) {
                this.$emit("unauthorized_access")
                this.$router.push({
                    name: 'LandingPage',
                })
            }
        } else {
            this.$emit("unauthorized_access")
            this.$router.push({
                name: 'LandingPage',
            })
        }
        if (this.token === null) {
            this.$store.dispatch('update_token_cookie')
        }
        // send tab info
        this.emit_tab_info()
        // if check token was passed through route query
        this.check_token_request()
        // update check log if state is empty
        if (JSON.stringify(this.check_log) === '[]') {
            this.update_check_log()
        }
        // update checkpoint if state is empty
        if (JSON.stringify(this.checkpoint) === '[]') {
            this.update_checkpoint()
        }
        // listening for global emit events
        // listen for games completing
        this.$root.$on("gameComplete", this.game_complete)
    },
    props: {
        tab: {
            type: Number,
            required: true,
        },
    },
    components: {
        RockPaperScissors,
        LogCard,
        ViewCard,
    },
    computed: {
        token() {
            return this.$store.state['token']
        },
        session() {
            return this.$store.state['session']
        },
        game() {
            return this.$store.state['game']
        },
        check_log() {
            return this.$store.state['check_log']
        },
        checkpoint() {
            return this.$store.state['checkpoint']
        }
    },
}
</script>

<style lang="scss" scoped>
.log_container {
    display: grid;
    justify-items: center;
    align-items: start;
    grid-auto-rows: auto;
    width: 100%;
    align-self: start;
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

