<template>
    <div>
        <h2>id#{{ user_profile.userId }}</h2>
        <h1>{{ user_profile.username }}</h1>
        <h4>{{ user_profile.name }}</h4>
        <h3>{{ user_profile.email }}</h3>

        <h2 class="profile_title">current standing:</h2>
        <div ref="profile_card" class="profile_card">
            <h2>#{{ user_score.standing }}</h2>
            <h5>{{ user_score.username }}</h5>
            <h4>
                {{ user_score.score }}
                <h6>points</h6>
            </h4>
        </div>
        <h2 class="profile_title">your top score:</h2>
        <div v-if="top_score != undefined" class="log_card" ref="log_card">
            <h2>{{ top_score.gameName }}</h2>
            <!-- <h3>reward:</h3> -->
            <h5>{{ top_score.pointsWon }}/{{ top_score.pointReward * top_score.roundsPlayed }} points</h5>
            <h5>{{ top_score.tokensWon }}/{{ top_score.tokenReward * top_score.rounds }} tokens</h5>
        </div>
        <h4 v-else>Wonder why you are seeing this message? Go to the checkpoint page to load your check-in log</h4>
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
                this.$store.commit('update_error_message', err.response.data)
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
        },
        top_score: {
            get() {
                return this.$store.state['user_top_score']
            }
        }
    },
    mounted() {
        if (JSON.stringify(this.user_profile) === '[]') {
            this.get_user_profile()
        }
    },
}
</script>

<style lang="scss" scoped>
div>.profile_card {
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr 1fr;
    border: 1px white solid;
    background-color: rgba(0, 0, 0, 0.178);
    min-height: 55px;
    margin-bottom: 10px;
}
div>.log_card {
    display: grid;
    place-items: center;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    max-width: 450px;
    min-height: 60px;
    border: 1px black solid;
    background-color: rgba(0, 0, 0, 0.104);
    grid-template-areas:
        "a b"
        "a c";
    :nth-child(1) {
        color: rgba(255, 255, 255, 0.685);
        grid-area: a;
    }
    :nth-child(2) {
        grid-area: b;
    }
    :nth-child(3) {
        grid-area: c;
    }
}
div>.profile_title {
    margin-top: 20px;
}
</style>