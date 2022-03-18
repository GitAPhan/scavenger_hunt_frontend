<template>
    <div>
        <h1>Player Page</h1>
    </div>
</template>

<script>
export default {
    name: 'PlayerPage',
    methods: {
        emit_tab_info() {
            let tabs = [
                { title: 'profile', id: 1, text: 'player1' },
                { title: 'scoreboard', id: 2, text: 'player2' },
                { title: 'hints', id: 3, text: 'player3' },
            ]
            this.$emit('tab_info', tabs)
        },
        check_cookies() {
            if (this.$cookies.get('token') === null) {
                this.$router.push({
                    name: 'LandingPage'
                })
                this.$emit("unauthorized_access")
            }
        },
    },
    mounted() {
        this.emit_tab_info();
        this.check_cookies()
    },
}
</script>

<style>
</style>