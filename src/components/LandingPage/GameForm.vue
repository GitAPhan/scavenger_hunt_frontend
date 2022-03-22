<template>
    <div>
        <h3>Welcome {{ this.$cookies.get('token').username }}</h3>
        <transition name="transition_form_flip" mode="out-in">
            <validation-observer ref="observer" class="place_center" v-slot="{ invalid }">
                <div v-if="is_join_game">
                    <h2>JOIN GAME</h2>
                    <p>Please enter the room code in order to join game</p>
                </div>
                <div v-else>
                    <h2>CREATE GAME</h2>
                    <p>What would you like the name of the game to be?</p>
                </div>
                <v-form class="center_grid" @submit.prevent="submit">
                    <validation-provider
                        v-if="is_join_game"
                        v-slot="{ errors }"
                        name="room_code"
                        rules="required|length:6"
                        class="text_field"
                    >
                        <v-text-field
                            v-model="room_code"
                            :counter="6"
                            :error-messages="errors"
                            label="code"
                            name="room_code"
                            placeholder="enter room code"
                            required
                            full-width
                        ></v-text-field>
                    </validation-provider>
                    <validation-provider
                        v-else
                        v-slot="{ errors }"
                        name="game_name"
                        rules="required|min:5|max:50"
                        class="text_field"
                    >
                        <v-text-field
                            v-model="game_name"
                            :counter="50"
                            :error-messages="errors"
                            label="name"
                            name="game_name"
                            placeholder="display name"
                            required
                            full-width
                        ></v-text-field>
                    </validation-provider>
                    <div class="center_grid" v-if="is_join_game">
                        <v-btn
                            v-if="invalid"
                            outlined
                            min-width="150px"
                            elevation="1"
                            large
                            type="submit"
                            :disabled="true"
                        >enter code</v-btn>
                        <v-btn
                            v-else
                            outlined
                            min-width="150px"
                            elevation="3"
                            large
                            color="primary"
                            type="submit"
                            :loading="loading"
                            :disabled="loading"
                            @click="join_game"
                        >join game</v-btn>
                    </div>
                    <div class="center_grid" v-else>
                        <v-btn
                            v-if="invalid"
                            outlined
                            min-width="150px"
                            elevation="1"
                            large
                            type="submit"
                            :disabled="true"
                        >enter name</v-btn>
                        <v-btn
                            v-else
                            outlined
                            min-width="150px"
                            elevation="3"
                            large
                            color="primary"
                            type="submit"
                            :loading="loading"
                            :disabled="loading"
                            @click="create_game"
                        >create game</v-btn>
                    </div>
                </v-form>
                <!-- or -->
                <h4>OR</h4>
                <v-btn
                    outlined
                    min-width="150px"
                    elevation="2"
                    large
                    color="secondary"
                    :loading="loading"
                    :disabled="loading"
                    type="submit"
                    v-if="is_join_game"
                    @click="switch_option"
                >create game?</v-btn>
                <v-btn
                    outlined
                    min-width="150px"
                    elevation="2"
                    large
                    color="secondary"
                    :loading="loading"
                    :disabled="loading"
                    type="submit"
                    v-else
                    @click="switch_option"
                >join game?</v-btn>
            </validation-observer>
        </transition>
    </div>
</template>

<script>
import { required, email, length, max, min, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

setInteractionMode('eager')

extend('required', {
    ...required,
    message: '{_field_} can not be empty',
})

extend('length', {
    ...length,
    message: '{_field_} must be 7 characters',
})

extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
})

extend('min', {
    ...min,
    message: '{_field_} may not be less than {length} characters',
})

extend('regex', {
    ...regex,
    message: '{_field_} {_value_} does not match {regex}',
})

extend('email', {
    ...email,
    message: 'Email must be valid',
})
export default {
    name: 'game-form',
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {
            loading: false,
            room_code: '',
            game_name: '',
            is_join_game: true,
        }
    },
    methods: {
        clear: function () {
            this.loading = !this.loading
            this.room_code = ''
            this.game_name = ''
            this.$refs.observer.reset()
        },
        switch_option: function () {
            this.loading = !this.loading
            this.is_join_game = !this.is_join_game
            this.clear()
        },
        submit: function () {
            this.$refs.observer.validate()
        },
        request_success: function (payload) {
            this.clear()
            // update cookie
            this.$store.commit('update_token', payload)
            if (this.$store.state['check_token'] != undefined) {
                // navigate back to checkpoint if checkToken is present
                this.$store.commit('update_tab_location', 1)
                this.$router.push({
                    name: 'CheckpointPage'
                })
            } else {
                // navigate to game area
                this.$router.push({
                    name: 'PlayerPage'
                })
            }
        },
        request_error: function (payload) {
            this.clear()
            // user displayed error
            this.$store.commit('update_error_message', payload)
        },
        create_game: function () {
            // loader on
            this.loading = !this.loading
            var request_data = {
                "gameName": this.game_name,
            }
            var request_key = ["loginToken", "loginId", "userId"]
            for (var i = 0; i < request_key.length; i++) {
                request_data[request_key[i]] = this.token[request_key[i]]
            }
            // request
            this.$axios.request({
                url: "https://scavenger.ga/api/games",
                method: "POST",
                data: request_data
            }).then((res) => {
                this.request_success(res.data)
            }).catch((err) => {
                this.request_error(err.response.data)
            })
        },
        join_game: function () {
            // loader on
            this.loading = !this.loading
            // request
            this.$axios.request({
                url: "https://scavenger.ga/api/login",
                method: "PATCH",
                data: {
                    "loginToken": this.token['loginToken'],
                    "loginId": this.token['loginId'],
                    "userId": this.token['userId'],
                    "gameToken": this.room_code
                }
            }).then((res) => {
                this.request_success(res.data)
            }).catch((err) => {
                this.request_error(err.response.data)
            })
        },
    },
    computed: {
        token() {
            return this.$store.state['token']
        },
    },
}
</script>

<style>
.alert_box {
    position: absolute;
}
.center_grid {
    display: grid;
    place-items: center;
    max-width: 80vw;
    min-width: 300px;
}
.text_field {
    width: 80%;
    max-width: 300px;
}
.place_center {
    display: grid;
    place-items: center;
}
// transition animations
.transition_form_flip-enter-active,
.transition_form_flip-leave-active {
    transition: all 0.45s ease-in-out;
}

.transition_form_flip-leave-to {
    opacity: 0;
    transform: translateX(-20vw);
}

.transition_form_flip-enter {
    opacity: 0;
    transform: translateX(20vw);
}

.transition_form_flip-enter-to,
.transition_form_flip-leave {
    opacity: 1;
    transform: translateX(0);
}
</style>