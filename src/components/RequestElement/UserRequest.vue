<template>
    <div class="request_container"></div>
</template>

<script>
export default {
    name: 'user-request',
    methods: {
        db_user_request(request_data, request_method, request_url) {
            var response = undefined
            // request
            this.$axios.request({
                url: request_url,
                method: request_method,
                request_data
            }).then((res) => {
                response = {
                    response: res.data,
                    status: true
                }
            }).catch((err) => {
                response = {
                    response: err.response.data,
                    status: false
                }
            }).then(() => {
                if (request_method === 'POST') {
                    this.$emit('post_response', response)
                }
            })
        },
        login_users() {
            print()
        },
        check_username(username) {
            var response = undefined
            // request
            this.$axios.request({
                url: "http://localhost:5000/api/login",
                params: {
                    "username": username
                }
            }).then((res) => {
                response = {
                    response: res.data,
                    status: true
                }

            }).catch((err) => {
                response = {
                    response: err.response.data,
                    status: false
                }
            }).then(() => {
                this.$emit('update_check_username_message', response)
            })
        }
    },
    watch: {
        username_to_check() {
            const x = this.username_to_check
            this.check_username(x)
        },
        create_user() {
            if (this.create_user === undefined ) {
                var response = {
                    response: 'An error occured while attempting create user',
                    status: false
                }
                this.$emit('post_response', response)
                return
            }
            const x = this.create_user
            this.db_user_request(x, 'POST', 'http://localhost:5000/api/users')
        }
    },
    props: {
        username_to_check: String,
        create_user: Object,
    },
}
</script>

<style lang="scss" scoped>
.request_container {
    display: none;
}
</style>