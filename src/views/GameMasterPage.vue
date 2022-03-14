<template>
    <div>
        <h1>Game Master Page</h1>
    </div>
</template>

<script>
    export default {
        name: 'GameMasterPage',
        methods: {
            emit_tab_info() {
                let tabs = [
                    { title: 'test1', id: 1, text: 'lorem' },
                    { title: 'test2', id: 2, text: 'lorem2' },
                    { title: 'test3', id: 3, text: 'lorem3' },
                ]
                this.$emit('tab_info', tabs)
            }
        },
        mounted () {
            this.emit_tab_info();
        },
    }
</script>

<style lang="scss" scoped>

</style>