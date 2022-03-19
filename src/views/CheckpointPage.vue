<template>
    <div class="checkpoint_container">
        <article v-if="tab === 1 && is_challenge_active">
            <rock-paper-scissors :game="game" v-if="challenge_type === 0" />
        </article>
        <article v-else-if="tab === 0">
            <h1>{{ tabs[0]['title'] }}</h1>
        </article>
        <article v-else-if="tab === 2">
            <h1>{{ tabs[2]['title'] }}</h1>
        </article>
        <article v-else>
            <h1>{{ tabs[1]['title'] }}</h1>
            <h4>is not available</h4>
            <p>{{ error_message }}</p>
        </article>
    </div>
</template>

<script>
import RockPaperScissors from "@/components/checkpoints/RockPaperScissors.vue"
export default {
    name: 'CheckpointPage',
    data() {
        return {
            tabs: [
                { title: '#####', id: 1, text: 'lorem' },
                { title: 'challenge', id: 2, text: 'lorem2' },
                { title: 'log', id: 3, text: 'lorem3' },
            ],
            checkToken: this.$route.query.checkToken,
            is_challenge_active: false,
            challenge_type: undefined,
            error_message: undefined,
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
        check_token_request: function () {

            if (this.checkToken != undefined && this.session === undefined) {
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
                    this.is_challenge_active = true
                }).catch((err) => {
                    response = err.response.data
                    this.error_message = response
                })

            } 
        },
    },
    mounted() {
        if (this.token === undefined) {
            this.$store.dispatch('update_token_cookie')
        }
        // if check token was passed through route query
        this.check_token_request()
        // send tab info
        this.emit_tab_info()
        // cookie check
        if (this.$cookies.get('token') != undefined) {
            if (this.$cookies.get('token').playerToken === undefined) {
                this.$router.push({
                    name: 'LandingPage',
                })
                this.$emit("unauthorized_access")
            }
        } else {
            this.$router.push({
                name: 'LandingPage',
            })
            this.$emit("unauthorized_access")
        }
        // listening for global emit events
        // request alerts
        this.$root.$on('requestAlert', this.request_alert)
    },
    props: {
        tab: {
            type: Number,
            required: true,
        },
    },
    components: {
        RockPaperScissors,
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
    },
}
</script>

<style lang="scss" scoped>
.checkpoint_container {
    display: grid;
    place-items: center;
    height: 100%;
}
</style>