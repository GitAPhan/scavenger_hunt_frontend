<template>
    <div>
        <h3>signup</h3>
        <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit" class="place_center">
                <div class="login_scroll">
                    <validation-provider
                        v-slot="{ errors }"
                        name="username"
                        rules="required|max:30|min:8"
                    >
                        <v-text-field
                            v-model="username"
                            :counter="30"
                            :error-messages="errors"
                            label="username"
                            @keyup="check_username"
                            :hint="username_message"
                            placeholder="used to sign-in"
                            :error="is_username_avail ? false : true"
                            required
                        ></v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="name" rules="min:5|max:20">
                        <v-text-field
                            v-model="name"
                            :counter="20"
                            :error-messages="errors"
                            label="Alias"
                            placeholder="display name"
                        ></v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="email" rules="required|email">
                        <v-text-field
                            v-model="email"
                            :error-messages="errors"
                            label="E-mail"
                            placeholder="enter valid email"
                            required
                        ></v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="password" rules="required|min:8">
                        <v-text-field
                            v-model="password"
                            :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show_password ? 'text' : 'password'"
                            label="password"
                            hint="8-64 characters"
                            placeholder="enter desired password"
                            :error-messages="errors"
                            required
                            :counter="64"
                            @click:append="show_password = !show_password"
                        ></v-text-field>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" rules="required" name="checkbox">
                        <v-checkbox
                            v-model="checkbox"
                            :error-messages="errors"
                            value="1"
                            label="I am over the age of 13"
                            type="checkbox"
                            required
                        ></v-checkbox>
                    </validation-provider>
                </div>
                <v-alert
                    v-if="is_error"
                    border="left"
                    color="red"
                    dismissible
                    elevation="5"
                    icon="$mdiAccount"
                    type="error"
                >{{ error_message }}</v-alert>
                <v-btn
                    outlined
                    min-width="150px"
                    elevation="2"
                    large
                    top
                    color="primary"
                    v-if="invalid"
                    :disabled="true"
                >signup</v-btn>
                <v-btn
                    outlined
                    min-width="150px"
                    elevation="2"
                    large
                    top
                    color="primary"
                    v-else
                    type="submit"
                    :loading="loading"
                    :disabled="loading"
                    @click="signup"
                >s i g n u p</v-btn>
            </form>
        </validation-observer>
    </div>
</template>

<script>
import { required, max, min } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

setInteractionMode('eager')

extend('required', {
    ...required,
    message: '{_field_} can not be empty',
})

extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
})

extend('min', {
    ...min,
    message: '{_field_} may not be less than {length} characters',
})

export default {
    name: 'signup-form',
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {
            loading: false,
            // signup
            name: '',
            username: '',
            email: '',
            checkbox: null,
            password: '',
            // show password toggler
            show_password: false,
            username_message: "",
            is_username_avail: true,
            // error message
            is_error: false, // used for alert
            error_message: undefined
        }
    },
    methods: {
        submit: function () {
            this.$refs.observer.validate()
        },
        clear: function () {
            this.name = ''
            this.username = ''
            this.email = ''
            this.password = ''
            this.checkbox = null
            this.$refs.observer.reset()
        },
        check_username: function () {
            if (this.username.length > 7 && this.username.length < 31) {
                // request
                this.$axios.request({
                    url: "http://localhost:5000/api/login",
                    params: {
                        "username": this.username
                    }
                }).then((res) => {
                    this.username_message = res.data
                    this.is_username_avail = true
                }).catch((err) => {
                    this.username_message = err.response.data
                    this.is_username_avail = false
                })
            }
        },

        signup: function () {
            // set button to loader
            this.loading = !this.loading
            // create request data
            let request_data = {
                "username": this.username,
                "email": this.email,
                "isOver13": this.checkbox,
                "password": this.password
            }
            // add name to request
            if (this.name.length > 4 && this.name.length < 20) {
                request_data['displayName'] = this.name
            }

            // request
            this.$axios.request({
                url: "http://localhost:5000/api/users",
                method: "POST",
                data: request_data
            }).then((res) => {
                this.clear()
                // set cookie with temp token
                this.$cookies.set('token', res.data)
                this.$emit('post_response', res.data)
            }).catch((err) => {
                this.clear()
                this.error_message = err.response.data
            }).then(() => {
                this.loading = !this.loading
            })
        },
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

.place_center {
    display: grid;
    place-items: center;
}
</style>