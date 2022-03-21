<template>
    <div v-if="card.isActive ===0" class="log_card">
        <h2>{{ card.gameName }}</h2>
        <!-- <h3>reward:</h3> -->
        <h5>{{ card.pointsWon }}/{{ card.pointReward * card.roundsPlayed }} points</h5>
        <h5>{{ card.tokensWon }}/{{ card.tokenReward * card.rounds }} tokens</h5>
    </div>
</template>

<script>
export default {
    name: 'log-card',
    props: {
        card: {
            type: Object,
            required: true
        },
    },
}
</script>

<style lang="scss" scoped>
.log_card {
    display: grid;
    place-items: center;
    width: 90%;
    max-width: 450px;
    min-height: 60px;
    border: 1px black solid;
    background-color: rgba(0, 0, 0, 0.104);
    grid-template-areas:
        "a b"
        "a c";
    :nth-child(1) {
        color: rgba(255, 255, 255, 0.685);
        grid-area: a;
    }
    :nth-child(2) {
        grid-area: b;
    }
    :nth-child(3) {
        grid-area: c;
    }
}
</style>