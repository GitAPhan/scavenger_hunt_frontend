<template>
    <div>
        <h2>id#{{user_profile.userId}}</h2>
        <h1>{{user_profile.username}}</h1>
        <h4>{{user_profile.name}}</h4>
        <h3>{{user_profile.email}}</h3>

        <div ref="profile_card" class="profile_card">
        <h2>#{{ user_score.standing }}</h2>
        <h5>{{ user_score.username }}</h5>
        <h4>
            {{ user_score.score }}
            <h6>points</h6>
        </h4>
    </div>
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
        },
        user_score: {
            get() {
                return this.$store.state['user_score']
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
.profile_card {
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr 1fr;
    border: 1px white solid;
    background-color: rgba(0, 0, 0, 0.178);
    min-height: 55px;
    margin-bottom: 10px;
}
</style>