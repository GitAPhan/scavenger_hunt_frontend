<template>
    <div>
        <section class="title_block">
            <h1>SCAVENGER</h1>
            <h1>HUNT</h1>
        </section>
        <login-container />
    </div>
</template>

<script>
import LoginContainer from '@/components/ContainerElement/LoginContainer.vue';

export default {
    name: 'landing-page',
    components: {
        LoginContainer,
    },
}
</script>

<style lang="scss" scoped>
.title_block {
    display: grid;
    place-items: center;
    height: 30vh;
    row-gap: 0px;
    font-size: 30px;

    >h1:nth-child(1) {
        align-self: end;
    }

    >h1:nth-child(2) {
        align-self: start;
    }
}

div {
    height: 70vh;
}
</style>