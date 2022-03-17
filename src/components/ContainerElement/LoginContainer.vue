<template>
    <div>
        <transition name="transition_page_flip" mode="out-in">
            <!-- signup/login selection -->
            <section v-if="this.section_view === 0">
                <div class="spacer"></div>
                
            </section>
            <!-- login -->
            <section v-else-if="this.section_view === 1">
                
            </section>
            <!-- signup -->
            <section v-else-if="this.section_view === 2">
                
            </section>
            <!-- create/join game -->
            <section v-else-if="this.section_view === 3">
                <h3>Welcome "{{ this.$cookies.get('token').username }}"</h3>
                <validation-observer ref="observer" class="place_center">
                    <form>
                        <validation-provider
                            v-slot="{ errors }"
                            name="game_token"
                            rules="required|length:7"
                        >
                            <v-text-field
                                v-model="game_token"
                                :counter="7"
                                :error-messages="errors"
                                label="room code"
                                placeholder="enter game token"
                                required
                            ></v-text-field>
                        </validation-provider>

                        <v-btn
                            type="submit"
                            :disabled="game_token.length != 7"
                            @click="join_game"
                        >join game</v-btn>
                        <label for="create_game">or</label>
                    </form>
                    <v-btn
                        :loading="login_loading"
                        :disabled="login_loading"
                        color="primary"
                        type="submit"
                        @click="create_game"
                    >create game</v-btn>
                </validation-observer>
            </section>
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
    name: 'login-container',
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {
            section_view: 0,
            loader: null,
            switcher: null,
            
            
            // forms
            
            
            // game token
            game_token: '',
        }
    },
    props: {
        check_username_message: Object,
        user_response: Boolean,
        user_response_message: String,
    },
    watch: {
        loader() {
            const x = this.loader
            this[x] = !this[x]
            // // fake loading time
            // setTimeout(() => (this.section_view = 3), 3000)

            // // animate loading sequence *testing only*
            // setTimeout(() => (this[x] = false), 3000)
            // this.loader = null
        },
        switcher() {
            console.log(this.switcher)
            this.section_view = this.switcher
        },
        user_response() {
            // stop loader
            this.login_loading = false
            this.signup_loading = false
            this.loader = null
            // only move to next page if user_response is true
            if (this.user_response) {
                // go to token input
                // this.section_view = 3
                console.log('change section view')
            }
            this.clear()
        }
    },
    methods: {
        submit() {
            this.$refs.observer.validate()
        },
        clear() {
            this.signup_name = ''
            this.signup_username = ''
            this.signup_email = ''
            this.signup_password = ''
            this.signup_checkbox = null
            this.login_username = ''
            this.login_password = ''
            this.$refs.observer.reset()
        },
        create_game() {
            console.log(this.game_token)
            // create request data
            var token = this.$cookies.get('token')
            data = {
                "tempToken": token.tempToken,
                "loginId": token.loginId,
                "userId": token.userId,
                "gameToken": this.game_token
            }
            // to parent - Landing Page
            this.$emit("create_game_request", data)
            
            
        },
        join_game() {
            // ## // ##
            this.$router.push({
                name: 'PlayerPage'
            })
        },
        check_username() {
            if (this.signup_username.length >= 8 && this.signup_username.length <= 30) {
                this.$emit("check_username", this.signup_username)
            }
        },
        login_check() {
            if (this.$cookies.get('token').loginToken != undefined) {
                // redirect to player page if loginToken is present
                this.$router.push({
                    name: "PlayerPage", // might change depending on player or gm                  
                })
            } 
            if (this.$cookies.get('token').tempToken != undefined) {
                // user will be redirected to add game token page
                this.section_view = 3
            }
            if (this.$cookies.get('token').gameToken != undefined) {
                this.game_token = this.$cookies.get('token').gameToken
            }
        },

    },
    mounted() {
        this.login_check()
    },
}
</script>

<style lang="scss" scoped>
.login_scroll {
    height: 44vh;
    min-width: 80vw;
    overflow-y: scroll;
    overflow-x: hidden;
}

section {
    display: grid;
    place-items: center;
    height: 100%;
    padding: 10%;
}

.place_center {
    place-items: center;
    display: grid;
}

.spacer {
    height: 50%;
    grid-row: span 2;
}

form {
    display: grid;
    place-items: center;
}
// transition animations
.transition_page_flip-enter-active,
.transition_page_flip-leave-active {
    transition: all 0.45s ease-in-out;
}

.transition_page_flip-leave-to {
    opacity: 0;
    transform: translateX(-20vw);
}

.transition_page_flip-enter {
    opacity: 0;
    transform: translateX(20vw);
}

.transition_page_flip-enter-to,
.transition_page_flip-leave {
    opacity: 1;
    transform: translateX(0);
}
</style>