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
                data: request_data
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
    },
    watch: {
        username_to_check() {
            const x = this.username_to_check
            this.check_username(x)
        },
        login_user() {
            if (this.login_user === undefined) {
                var response = {
                    response: 'An error occured while attempting to login user',
                    status: false
                }
                this.$emit('post_response', response)
                return
            }
            const x = this.login_user
            this.db_user_request(x, "POST", "http://localhost:5000/api/login")
        }
    },
    props: {
        username_to_check: String,
        create_user: Object,
        login_user: Object,
    },
}
</script>

<style lang="scss" scoped>
.request_container {
    display: none;
}
</style>