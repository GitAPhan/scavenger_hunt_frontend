<template>
    <div>
        <h1>Player Page</h1>
    </div>
</template>

<script>
export default {
    name: 'PlayerPage',
    data() {
        return {
            tabs: [
                { title: 'profile', id: 1, text: 'player1' },
                { title: 'scoreboard', id: 2, text: 'player2' },
                { title: 'hints', id: 3, text: 'player3' },
            ],
            token: this.$cookies.get('token')
        }
    },
    methods: {
        emit_tab_info: function () {
            this.$emit('tab_info', this.tabs)
        },
        react_to_cookie_update: function () {
            // new cookie has been set
            this.token = this.$cookies.get('token')
        },
        request_alert: function () {
            // an alert regarding a request has been broadcasted
            console.log(this.tabs)
        }
    },
    mounted() {
        // send tab info
        this.emit_tab_info()
        // cookie check
        if (this.token != undefined) {
            if (this.token.loginToken != undefined) {
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
        // tokenSet
        this.$root.$on('tokenSet', this.react_to_cookie_update);
        // request alerts
        this.$root.$on('requestAlert', this.request_alert)
    },
}
</script>

<style>
</style>