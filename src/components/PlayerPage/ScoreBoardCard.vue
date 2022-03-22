<template>
    <div>
        <article class="scoreboard_card" v-if="JSON.stringify(scoreboard) != '[]'">
            <score-card v-for="score in scoreboard" :key="score.standing" :score="score" />
        </article>
    </div>
</template>

<script>
import ScoreCard from '@/components/PlayerPage/ScoreCard.vue'
export default {
    components: { ScoreCard },
    name: 'score-board-card',
    methods: {
        get_scoreboard() {
            // request
            this.$axios.request({
                url: 'https://scavenger.ga/api/check-in/standing',
                params: {
                    "gameToken": this.token.gameToken
                }
            }).then((res) => {
                this.scoreboard = res.data
            }).catch((err) => {
                this.$store.commit('update_error_message', err.response.data)
            })
        }
    },
    mounted() {
        this.get_scoreboard();
    },
    computed: {
        token: {
            get() {
                return this.$store.state['token']
            }
        },
        scoreboard: {
            get() {
                return this.$store.state['scoreboard']
            },
            set(value) {
                this.$store.commit('update_scoreboard', value)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>