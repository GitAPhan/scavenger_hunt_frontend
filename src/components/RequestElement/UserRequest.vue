<template>
    <div class="request_container">

    </div>
</template>

<script>
    export default {
        name: 'user-request',
        methods: {
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
            }
        },
        props: {
            username_to_check: String,
        },
    }
</script>

<style lang="scss" scoped>
.request_container {
    display: none;
}
</style>