<template>
    <div>
        <transition name="transition_page_flip" mode="out-in">
            <section v-if="this.section_view === 0">
                <div class="spacer"></div>
                <v-btn
                    class="ma-2"
                    :loading="signup_loading"
                    :disabled="signup_loading"
                    color="primary"
                    @click="loader = 'signup_loading'"
                >
                    signup
                    <!-- <template v-slot:loader>
                        <span>Loading...</span>
                    </template>-->
                </v-btn>
                <v-btn
                    class="ma-2"
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
            </section>
            <section v-else-if="this.section_view === 3">
                <h3>login</h3>
                <form action="javascript:void(0)" id="login_form">
                    <label for="username">username</label>
                    <input name="username" type="text" ref="login_username" />
                    <label for="password">password</label>
                    <input name="password" type="password" ref="login_password" />
                    <button type="submit" form="login_form" value="Submit">LOGIN</button>
                </form>
            </section>
            <section v-else-if="this.section_view === 2">
                <h3>signup</h3>
                <validation-observer ref="observer" v-slot="{ invalid }">
                    <form @submit.prevent="submit">
                        <validation-provider
                            v-slot="{ errors }"
                            name="Name"
                            rules="required|max:10"
                        >
                            <v-text-field
                                v-model="name"
                                :counter="10"
                                :error-messages="errors"
                                label="Name"
                                required
                            ></v-text-field>
                        </validation-provider>
                        <validation-provider
                            v-slot="{ errors }"
                            name="phoneNumber"
                            :rules="{
                                required: true,
                                digits: 7,
                                regex: '^(71|72|74|76|81|82|84|85|86|87|88|89)\\d{5}$'
                            }"
                        >
                            <v-text-field
                                v-model="phoneNumber"
                                :counter="7"
                                :error-messages="errors"
                                label="Phone Number"
                                required
                            ></v-text-field>
                        </validation-provider>
                        <validation-provider
                            v-slot="{ errors }"
                            name="email"
                            rules="required|email"
                        >
                            <v-text-field
                                v-model="email"
                                :error-messages="errors"
                                label="E-mail"
                                required
                            ></v-text-field>
                        </validation-provider>
                        <validation-provider v-slot="{ errors }" name="select" rules="required">
                            <v-select
                                v-model="select"
                                :items="items"
                                :error-messages="errors"
                                label="Select"
                                data-vv-name="select"
                                required
                            ></v-select>
                        </validation-provider>
                        <validation-provider v-slot="{ errors }" rules="required" name="checkbox">
                            <v-checkbox
                                v-model="checkbox"
                                :error-messages="errors"
                                value="1"
                                label="Option"
                                type="checkbox"
                                required
                            ></v-checkbox>
                        </validation-provider>

                        <v-btn class="mr-4" type="submit" :disabled="invalid">submit</v-btn>
                        <v-btn @click="clear">clear</v-btn>
                    </form>
                </validation-observer>
            </section>
            <section v-else-if="this.section_view === 'test'">
                <h3>Welcome User!</h3>
                <form action="javascript:void(0)" id="game_token_form">
                    <label for="game_token">please enter game token to join game</label>
                    <input type="text" name="game_token" ref="game_token" />
                    <button type="submit" form="game_token_form">join game</button>
                    <label for="create_game">or</label>
                    <button type="button" name="create_game">create game</button>
                </form>
            </section>
        </transition>
    </div>
</template>

<script>
import { required, digits, email, max, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

setInteractionMode('eager')

extend('digits', {
    ...digits,
    message: '{_field_} needs to be {length} digits. ({_value_})',
})

extend('required', {
    ...required,
    message: '{_field_} can not be empty',
})

extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
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
            age_limit: 13,
            birthdate_limit: undefined,
            section_view: 0,
            loader: null,
            login_loading: false,
            signup_loading: false,
            // forms
            name: '',
            phoneNumber: '',
            email: '',
            select: null,
            items: [
                'Item 1',
                'Item 2',
                'Item 3',
                'Item 4',
            ],
            checkbox: null,
        }
    },
    watch: {
        loader() {
            const x = this.loader
            this[x] = !this[x]
            if (this.loader == 'login_loading') {
                this.section_view++
            }
            this.section_view++
            // animate loading sequence *testing only*
            setTimeout(() => (this[x] = false), 3000)
            this.loader = null
        },
    },
    methods: {
        age_restriction() {
            var max_birthdate = new Date();
            max_birthdate = max_birthdate.setFullYear(max_birthdate.getFullYear() - this.age_limit)
            this.birthdate_limit = max_birthdate
        },
        submit() {
            this.$refs.observer.validate()
        },
        clear() {
            this.name = ''
            this.phoneNumber = ''
            this.email = ''
            this.select = null
            this.checkbox = null
            this.$refs.observer.reset()
        },
    },
    mounted() {
        this.age_restriction();
    },
}
</script>

<style lang="scss" scoped>
section {
    display: grid;
    place-items: center;
    height: 100%;
    padding: 10%;
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