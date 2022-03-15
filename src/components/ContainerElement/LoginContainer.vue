<template>
    <div>
        <transition name="transition_page_flip" mode="out-in">
            <!-- signup/login selection -->
            <section v-if="this.section_view === 0">
                <div class="spacer"></div>
                <v-btn bottom color="primary" @click="switcher = 2">
                    signup
                    <!-- <template v-slot:loader>
                        <span>Loading...</span>
                    </template>-->
                </v-btn>
                <v-btn top color="primary" @click="switcher = 1">
                    LOGIN
                    <!-- <template v-slot:loader>
                        <span>Loading...</span>
                    </template>-->
                </v-btn>
            </section>
            <!-- login -->
            <section v-else-if="this.section_view === 1">
                <h3>login</h3>
                <v-form>
                    <v-container>
                        <v-text-field v-model="login_username" label="username" required />

                        <v-text-field
                            v-model="login_password"
                            :append-icon="show_login_password ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show_login_password ? 'text' : 'password'"
                            label="password"
                            placeholder="enter your password"
                            required
                            @click:append="show_login_password = !show_login_password"
                        />
                    </v-container>
                    <v-btn
                        :loading="login_loading"
                        :disabled="login_loading"
                        color="primary"
                        @click="loader = 'login_loading'"
                    >
                        LOGIN
                        <!-- <template v-slot:loader>
                        <span>Loading...</span>
                        </template>-->
                    </v-btn>
                </v-form>
            </section>
            <!-- signup -->
            <section v-else-if="this.section_view === 2">
                <h3>signup</h3>
                <validation-observer ref="observer" v-slot="{ valid }">
                    <form @submit.prevent="submit">
                        <div class="login_scroll">
                            <validation-provider
                                v-slot="{ errors }"
                                name="username"
                                rules="required|max:30|min:8"
                            >
                                <v-text-field
                                    v-model="signup_username"
                                    :counter="30"
                                    :error-messages="errors"
                                    label="username"
                                    @keyup="check_username"
                                    :hint="check_username_message"
                                    placeholder="used to sign-in"
                                    required
                                ></v-text-field>
                            </validation-provider>
                            <validation-provider v-slot="{ errors }" name="name" rules="max:12">
                                <v-text-field
                                    v-model="signup_name"
                                    :counter="12"
                                    :error-messages="errors"
                                    label="Alias"
                                    placeholder="display name"
                                    required
                                ></v-text-field>
                            </validation-provider>
                            <validation-provider
                                v-slot="{ errors }"
                                name="email"
                                rules="required|email"
                            >
                                <v-text-field
                                    v-model="signup_email"
                                    :error-messages="errors"
                                    label="E-mail"
                                    placeholder="enter valid email"
                                    required
                                ></v-text-field>
                            </validation-provider>
                            <validation-provider
                                v-slot="{ errors }"
                                name="password"
                                rules="required|min:8"
                            >
                                <v-text-field
                                    v-model="signup_password"
                                    :append-icon="show_signup_password ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="show_signup_password ? 'text' : 'password'"
                                    label="password"
                                    hint="8-64 characters"
                                    placeholder="enter desired password"
                                    :error-messages="errors"
                                    required
                                    :counter="64"
                                    @click:append="show_signup_password = !show_signup_password"
                                ></v-text-field>
                            </validation-provider>
                            <validation-provider
                                v-slot="{ errors }"
                                rules="required"
                                name="checkbox"
                            >
                                <v-checkbox
                                    v-model="signup_checkbox"
                                    :error-messages="errors"
                                    value="1"
                                    label="I am over the age of 13"
                                    type="checkbox"
                                    required
                                ></v-checkbox>
                            </validation-provider>
                        </div>
                        <v-btn v-if="!valid" :disabled="true">signup</v-btn>
                        <v-btn
                            v-else
                            type="submit"
                            :loading="signup_loading"
                            :disabled="signup_loading"
                            @click="loader = 'signup_loading'"
                        >signup</v-btn>
                        <v-btn @click="clear">clear</v-btn>
                    </form>
                </validation-observer>
            </section>
            <!-- create/join game -->
            <section v-else-if="this.section_view === 3">
                <h3>Welcome User!</h3>
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
            login_loading: false,
            signup_loading: false,
            // forms
            // signup
            signup_name: '',
            signup_username: '',
            signup_email: '',
            signup_checkbox: null,
            signup_password: '',
            // signin
            login_username: '',
            login_password: '',
            // show password toggler
            show_signup_password: false,
            show_login_password: false,
            // game token
            game_token: '',
        }
    },
    props: {
        check_username_message: String,
    },
    watch: {
        loader() {
            const x = this.loader
            this[x] = !this[x]
            // fake loading time
            setTimeout(() => (this.section_view = 3), 3000)

            // animate loading sequence *testing only*
            setTimeout(() => (this[x] = false), 3000)
            this.loader = null
        },
        switcher() {
            console.log(this.switcher)
            this.section_view = this.switcher
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
            this.$refs.observer.reset()
        },
        signup() {
            this.section_view = 3
        },
        create_game() {
            console.log(this.signup_name)
            console.log(this.signup_email)
            console.log(this.signup_username)
            console.log(this.signup_password)
            console.log(this.signup_checkbox)
            console.log(this.game_token)
            this.$router.push({
                name: 'PlayerPage'
            })
        },
        join_game() {
            this.create_game()
        },
        check_username() {
            if (this.signup_username.length >= 8) {
                this.$emit("check_username", this.signup_username)
            }
        }
    },
    mounted() {

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