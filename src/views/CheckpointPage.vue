<template>
    <div>
        <h1>Checkpoint</h1>
    </div>
</template>

<script>
    export default {
        name: 'CheckpointPage',
        methods: {
            emit_tab_info() {
                let tabs = [
                    { title: 'Wtest1', id: 1, text: 'lorem' },
                    { title: 'Wtest2', id: 2, text: 'lorem2' },
                    { title: 'Wtest3', id: 3, text: 'lorem3' },
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