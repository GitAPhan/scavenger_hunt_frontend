<template>
    <div>
        <!-- left tab -->
        <profile-card class="player_tab" v-if="tab_location === 0" />
        <!-- middle tab -->
        <score-board-card class="player_tab" v-else-if="tab_location === 1" />
        <!-- right tab -->
        <article class="player_tab" v-else-if="tab_location === 2">
            <h1>this feature will be available in the near future</h1>
        </article>
        <!-- error tab -->
        <article class="player_tab" v-else>
            <h1>OOPS! looks like we ran into a problem</h1>
            <p>{{ error_message }}</p>
        </article>
    </div>
</template>

<script>
import ProfileCard from '@/components/PlayerPage/ProfileCard.vue'
import ScoreBoardCard from '../components/PlayerPage/ScoreBoardCard.vue'

export default {
    components: { ProfileCard, ScoreBoardCard },

    name: 'PlayerPage',
    data() {
        return {
            tabs: [
                { title: 'profile', id: 1, text: 'player1' },
                { title: 'scoreboard', id: 2, text: 'player2' },
                { title: 'hints', id: 3, text: 'player3' },
            ],
            error_message: undefined,
            // nav bar title
            nav_bar_title: 'scavenger hunt',
        }
    },
    methods: {

    },
    mounted() {
        // cookie check
        if (this.$cookies.get('token') != undefined) {
            if (this.$cookies.get('token').loginToken != undefined) {
                this.$router.push({
                    name: 'LandingPage',
                })
                // disable nav bar
                this.$store.commit('update_tabs', false)
            }
            // send tab info
            this.$store.commit('update_tabs', this.tabs)
            // send page name
            this.$store.commit('update_title', this.nav_bar_title)


        } else {
            this.$router.push({
                name: 'LandingPage',
            })
            this.$store.commit('update_tabs', false)
        }
        // change to scoreboard location first to grab scoreboard
        this.$store.commit('update_tab_location', 1)
    },
    computed: {
        scoreboard: {
            get() {
                return this.$store.state['scoreboard']
            },
            set(value) {
                this.$store.commit('update_scoreboard', value)
            }
        },
        tab_location: {
            get() {
                return this.$store.state['tab_location']
            }
        }
    }
}
</script>

<style>
.player_tab {
    max-height: 75vh;
    max-width: 100vw;
    padding: 0px 10px;
    overflow-y: scroll;
}
</style>