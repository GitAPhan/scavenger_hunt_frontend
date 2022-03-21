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
            token: this.$cookies.get('token'),
            // nav bar title
            nav_bar_title: 'scavenger hunt',
        }
    },
    methods: {
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
        // cookie check
        if (this.token != undefined) {
            if (this.token.loginToken != undefined) {
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

            
        } else {
            this.$router.push({
                name: 'LandingPage',
            })
            this.$store.commit('update_tabs', false)
        }
    },
}
</script>

<style>
</style>