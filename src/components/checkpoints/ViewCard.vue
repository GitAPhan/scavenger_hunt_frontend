<template>
    <div class="log_card">
        <h2>{{ card.gameName }}</h2>
        <!-- <h3>reward:</h3> -->
        <h5>{{ card.tokenReward }} tokens/round</h5>
        <h5>{{ card.pointReward }} points/round</h5>
        <h5>{{ card.rounds }} rounds</h5>
    </div>
</template>

<script>
export default {
    name: 'view-card',
    props: {
        card: {
            type: Object,
            required: true
        },
    }
}
</script>

<style lang="scss" scoped>
.log_card {
    display: grid;
    place-items: center;
    width: 90%;
    max-width: 450px;
    border: 1px black solid;
    background-color: rgba(0, 0, 0, 0.104);
    grid-template-areas:
        "a b"
        "a c"
        "a d";
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
    :nth-child(4) {
        grid-area: d;
    }
}
</style>