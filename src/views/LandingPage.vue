<template>
    <div>
        <section>
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
section {
    display: grid;
    place-items: center;
}
</style>