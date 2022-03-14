<template>
    <div>
        <section class="title_block">
            <h1>SCAVENGER</h1>
            <h1>HUNT</h1>
        </section>
        <login-container />
        <user-request />
        <game-request />
    </div>
</template>

<script>
import UserRequest from "@/components/RequestElement/UserRequest.vue";
import GameRequest from "@/components/RequestElement/GameRequest.vue";
import LoginContainer from '@/components/ContainerElement/LoginContainer.vue';

export default {
    name: 'landing-page',
    components: {
        UserRequest,
        GameRequest,
        LoginContainer,
    },
    methods: {
        emit_tab_info() {
            let tabs = false
            this.$emit('tab_info', tabs)
        }
    },
    mounted() {
        this.emit_tab_info();
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
    border: black .5px solid;

    > h1:nth-child(1) {
        align-self: end;
    }

    > h1:nth-child(2) {
        align-self: start;
    }
}

div {
    height: 70vh;
}
</style>