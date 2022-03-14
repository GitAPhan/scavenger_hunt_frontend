<template>
    <div>
        <h1>PAGE NOT FOUND!</h1>
    </div>
</template>

<script>
export default {
    name: 'PageNotFound',
    methods: {
        emit_tab_info() {
            let tabs = []
            this.$emit('tab_info', tabs)
        }
    },
    mounted() {
        this.emit_tab_info();
    },
}
</script>

<style lang="scss" scoped>
</style>