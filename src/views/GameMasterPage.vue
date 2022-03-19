<template>
    <div>
        <h1>Game Master Page</h1>
    </div>
</template>

<script>
export default {
    name: 'GameMasterPage',
    data() {
        return {
            tabs: [
                { title: 'GM1', id: 1, text: 'lorem' },
                { title: 'GM2', id: 2, text: 'lorem2' },
                { title: 'GM3', id: 3, text: 'lorem3' },
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

<style lang="scss" scoped>
</style>