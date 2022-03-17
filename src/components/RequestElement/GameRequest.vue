<template>
    <div>

    </div>
</template>

<script>
    export default {
        name: 'game-request',
        props: {
            create_game: Object,
        },
        watch: {
            create_game() {
                if (JSON.stringify(this.create_game) != '{}') {
                    // request to create new game
                    this.post(this.create_game)
                }
                
            }
        },
        methods: {
            post(request_data) {
                var response = undefined
                // request
                this.$axios.request({
                    url: "http://localhost:5000/api/games",
                    method: "POST",
                    data: request_data
                }).then((res) => {
                    response = {
                        "response": res.data,
                        "status": true
                    }
                }).catch((err) => {
                    response = {
                        "response": err.response.data,
                        "status": false
                    }
                }).then(() => {
                    this.$emit("post_response", response)
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>