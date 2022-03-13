<template>
    <div>
        <section v-if="this.section_view === 0">
            <button type="button">signup</button>
            <button type="button">LOGIN</button>
        </section>
        <section v-else-if="this.section_view === 1">
            <h3>login</h3>
            <form action="javascript:void(0)" id="login_form">
                <label for="username">username</label>
                <input name="username" type="text" ref="login_username">
                <label for="password">password</label>
                <input name="password" type="password" ref="login_password">
                <button type="submit" form="login_form" value="Submit">LOGIN</button>
            </form>
        </section>
        <section v-else-if="this.section_view === 2">
            <h3>signup</h3>
            <form action="javascript:void(0)" id="create_user">
                <label for="username">username</label>
                <input type="text" name="username" placeholder="6-30 alphanumeric characters" ref="signup_username">
                <label for="name">alias</label>
                <input type="text" name="name" placeholder="optional display name" ref="signup_name">
                <label for="email">email</label>
                <input type="email" name="email" placeholder="please enter valid email" ref="signup_email">
                <label for="birthdate">birthdate</label>
                <input type="date" name="birthdate" :max="this.birthdate_limit" ref="signup_birthdate">
                <label for="password">password</label>
                <input type="password" name="password" placeholder="8-64 alphanumeric">
                <input type="password" name="password_verify" placeholder="re-enter your password" ref="signup_password">
                <button type="submit" form="create_user" value="Submit">signup</button>
            </form>
        </section>
        <section v-else>
            <h3>Welcome User!</h3>
            <form action="javascript:void(0)" id="game_token_form">
                <label for="game_token">please enter game token to join game </label>
                <input type="text" name="game_token" ref="game_token">
                <button type="submit" form="game_token_form">join game</button>
                <label for="create_game">or</label>
                <button type="button" name="create_game">create game</button>
            </form>
        </section>
        <!-- <button-input />
        <form-input /> -->
        <user-request />
        <game-request />
    </div>
</template>

<script>
import UserRequest from "@/components/RequestElement/UserRequest.vue";
import GameRequest from "@/components/RequestElement/GameRequest.vue";
// import ButtonInput from "@/components/VisualElement/ButtonInput.vue";
// import FormInput from "@/components/VisualElement/FormInput.vue";

export default {
    name: 'login-container',
    components: {
        UserRequest,
        GameRequest,
        // ButtonInput,
        // FormInput,
    },
    data() {
        return {
            age_limit: 13,
            birthdate_limit: undefined,
            section_view: 1
        }
    },
    methods: {
        age_restriction() {
            var max_birthdate = new Date();
            max_birthdate = max_birthdate.setFullYear(max_birthdate.getFullYear()-this.age_limit)
            this.birthdate_limit = max_birthdate
        }
    },
    mounted () {
        this.age_restriction();
    },
}
</script>

<style lang="scss" scoped>
section {
    display: grid;
    place-items: center;
    height: 70%;
    margin: 10%;
}

form {
    display: grid;
    place-items: center;
}
</style>