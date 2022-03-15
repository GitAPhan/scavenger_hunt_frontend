<template>
    <div>
        <section class="title_block">
            <h1>SCAVENGER</h1>
            <h1>HUNT</h1>
        </section>
        <login-container
            :user_response="user_response"
            :user_response_message="user_response_message"
            @create_user_request="create_user_request"
            @check_username="check_username"
            :check_username_message="check_username_message"
            class="landing_container"
        />
        <user-request
            @post_response="post_response"
            :create_user="create_user"
            :username_to_check="username_to_check"
            @update_check_username_message="update_check_username_message"
        />
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
    data() {
        return {
            username_to_check: undefined,
            check_username_message: {
                response: undefined,
                status: true
            },
            create_user: undefined,
            user_response: undefined,
            user_response_message: '',
            user_profile: undefined,
        }
    },
    methods: {
        emit_tab_info() {
            let tabs = false
            this.$emit('tab_info', tabs)
        },
        check_username(payload) {
            this.username_to_check = payload
        },
        update_check_username_message(payload) {
            this.check_username_message = payload
        },
        create_user_request(payload) {
            this.create_user = payload
        },
        post_response(response) {
            this.user_response = response.status
            if (response.status) {
                this.user_profile = response.response
            } else {
                this.user_response_message = response.response
            }
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
    border: black 0.5px solid;

    > h1:nth-child(1) {
        align-self: end;
    }

    > h1:nth-child(2) {
        align-self: start;
    }
}

.landing_container {
    height: 70vh;
    overflow: hidden;
}
</style>