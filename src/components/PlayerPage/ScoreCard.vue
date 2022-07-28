<template>
    <div ref="profile_card" class="profile_card">
        <h2>#{{ score.standing }}</h2>
        <h5>{{ score.username }}</h5>
        <h4>
            {{ score.score }}
            <h6>points</h6>
        </h4>
    </div>
</template>

<script>
export default {
    name: 'score-card',
    props: {
        score: {
            type: Object,
            required: true
        },
    },
    mounted() {
        // check to see if score card belongs to player
        if (this.token.userId === this.score.userId) {
            let card = this.$refs.profile_card
            card.style.border = "4px black solid";            
            this.$store.commit('update_user_score', this.score)
        }
    },
    computed: {
        token() {
            return this.$store.state['token']
        },
    }
}
</script>

<style lang="scss" scoped>
.profile_card {
    width: 100%;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr 1fr;
    border: 1px white solid;
    background-color: rgba(0, 0, 0, 0.178);
    min-height: 55px;
    margin-bottom: 10px;
}
</style>