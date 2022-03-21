<template>
    <div>
        <h2>id#{{user_profile.userId}}</h2>
        <h1>{{user_profile.username}}</h1>
        <h4>{{user_profile.name}}</h4>
        <h3>{{user_profile.email}}</h3>
    </div>
</template>

<script>
export default {
    name: 'profile-card',
    methods: {
        get_user_profile() {
            // request
            this.$axios.request({
                url: 'http://localhost:5000/api/users',
                params: {
                    "userId": this.token.userId
                }
            }).then((res) => {
                this.user_profile = res.data
            }).catch((err) => {
                console.log(err.response.data)
                // error message 
            })
        }
    },
    computed: {
        token: {
            get() {
                return this.$store.state['token']
            }
        },
        user_profile: {
            get() {
                return this.$store.state['user_profile']
            },
            set(value) {
                this.$store.commit('update_user_profile', value)
            }
        }
    },
    mounted () {
        if (JSON.stringify(this.user_profile) === '[]') {
            this.get_user_profile()
        }
    },
}
</script>

<style lang="scss" scoped>
</style>