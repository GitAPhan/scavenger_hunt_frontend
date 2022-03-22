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
                :key="card.checkpointId"
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
            <view-card v-for="card in checkpoint" :key="card.checkpointId + 365.4" :card="card" />
        </article>
        <!-- the tab -->
        <article class="nothing_message" v-else>
            <h1>{{ tabs[1]['title'] }}</h1>
            <h4>there are currently none available</h4>
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
                { title: 'check-in', id: 1, text: 'lorem' },
                { title: 'challenge', id: 2, text: 'lorem2' },
                { title: 'location', id: 3, text: 'lorem3' },
            ],
            is_challenge_active: false,
            challenge_type: undefined,
            // nav bar title
            nav_bar_title: 'checkpoint',
            temp_checkin_card: undefined,
        }
    },
    methods: {
        game_complete: function (game_result) {
            this.tab_location = 0
            this.is_challenge_active = false
            // clear store game info
            this.check_token = undefined
            this.game = undefined
            // store the result somewhere for the log tab            
            this.check_log = game_result
        },
        get_checkpoint_info: function () {
            // request
            let response = undefined
            this.$axios.request({
                url: 'http://localhost:5000/api/check-in',
                params: {
                    "userId": this.token.userId,
                    "checkToken": this.check_token
                }
            }).then((res) => {
                response = res.data
                // enable game
                this.challenge_type = response['gameType']
                this.game = response
                // check to see if game is active
                if (response.isActive === 1) {
                    this.is_challenge_active = true
                } else {
                    // switch to log tab
                    this.tab_location = 0
                    // show finished game result
                    this.temp_checkin_card = response
                    this.$store.commit('update_error_message', 'looks like you have already completed this game')
                    this.check_token = undefined
                    this.game = undefined

                    setTimeout(() => { this.temp_checkin_card = undefined }, 3000)
                }

            }).catch((err) => {
                this.error_message = err.response.data
                setTimeout(() => { this.error_message = undefined }, 3000)
            })
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
                this.check_log = res.data
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
                this.checkpoint = res.data
            }).catch((err) => {
                // display error message
                this.error_message = err.response.data
                setTimeout(() => { this.error_message = undefined }, 6000)
            })
        }
    },
    mounted() {
        // default tab = location
        this.tab_location = 2
        // query check for checkToken
        if (this.$route.query.checkToken != undefined) {
            this.check_token = this.$route.query.checkToken
            // switch to challenge tab if query is present
            this.tab_location = 1
        }
        // cookie check
        if (this.$cookies.get('token') != undefined) {
            if (this.$cookies.get('token').loginToken != undefined) {
                this.$router.push({
                    name: 'LandingPage',
                })
                // disable nav bar
                this.$store.commit('update_tabs', false)
            }
            // send tab info
            this.$store.commit('update_tabs', this.tabs)
            // send page name
            this.$store.commit('update_title', this.nav_bar_title)
            // checkpoint info request
            if (this.game === undefined && this.check_token != undefined) {
                this.get_checkpoint_info()
            }
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
        } else {
            this.$router.push({
                name: 'LandingPage',
            })
            this.$store.commit('update_tabs', false)
        }
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
        game: {
            get() {
                return this.$store.state['game']
            },
            set(value) {
                this.$store.commit('update_game', value)
            }
        },
        check_log: {
            get() {
                return this.$store.state['check_log']
            },
            set(value) {
                this.$store.commit('update_check_log', value)
            }
        },
        checkpoint: {
            get() {
                return this.$store.state['checkpoint']
            },
            set(value) {
                this.$store.commit('update_checkpoint', value)
            }
        },
        tab_location: {
            get() {
                return this.$store.state['tab_location']
            },
            set(value) {
                this.$store.commit('update_tab_location', value)
            }
        },
        check_token: {
            get() {
                return this.$store.state['check_token']
            },
            set(value) {
                this.$store.commit('update_check_token', value)
            }
        },
    }
}
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

