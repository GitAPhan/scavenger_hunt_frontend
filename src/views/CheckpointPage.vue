<template>
    <div class="checkpoint_container">
        <rock-paper-scissors v-if="tab === 1" />
        <h1 v-else>Checkpoint</h1>
    </div>
</template>

<script>
import RockPaperScissors from "@/components/checkpoints/RockPaperScissors.vue"
export default {
    name: 'CheckpointPage',
    methods: {
        emit_tab_info() {
            let tabs = [
                { title: '#####', id: 1, text: 'lorem' },
                { title: 'challenge', id: 2, text: 'lorem2' },
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
    props: {
        tab: {
            type: Number,
            required: true,
        },
    },
    mounted() {
        this.emit_tab_info();
        this.check_cookies()
    },
    components: {
        RockPaperScissors,
    },
}
</script>

<style lang="scss" scoped>
.checkpoint_container {
    display: grid;
    place-items: center;
    >h1 {
        text-align: center;
    }
    height: 100%;
}
</style>