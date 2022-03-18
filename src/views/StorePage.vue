<template>
    <div>
        <h1>Store</h1>
    </div>
</template>

<script>
export default {
    name: 'StorePage',
    methods: {
        emit_tab_info() {
            let tabs = [
                { title: 'trade', id: 1, text: 'lorem' },
                { title: 'shop', id: 2, text: 'lorem2' },
                { title: 'log', id: 3, text: 'lorem3' },
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

<style lang="scss" scoped>
</style>