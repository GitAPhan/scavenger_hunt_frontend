<template>
    <div>
        <section class="title_block">
            <h1>SCAVENGER</h1>
            <h1>HUNT</h1>
        </section>
        <transition name="transition_article_flip" mode="out-in">
            <article v-if="current_page === 0" class="content_block button_selection">
                <v-btn
                    outlined
                    min-width="150px"
                    elevation="2"
                    large
                    bottom
                    color="primary"
                    @click="current_page = 2"
                >signup</v-btn>
                <v-btn
                    outlined
                    min-width="150px"
                    elevation="2"
                    large
                    top
                    color="secondary"
                    @click="current_page = 1"
                > LOGIN</v-btn>
            </article>
            <login-form
                @post_response="login_response"
                v-else-if="current_page === 1"
                class="content_block"
            />
            <signup-form
                @post_response="login_response"
                v-else-if="current_page === 2"
                class="content_block"
            />
            <game-form 
                :request_data="game_request" 
                @game_response="game_response"
                v-else class="content_block" 
            />
        </transition>
    </div>
</template>

<script>
import LoginForm from "@/components/LandingPage/LoginForm.vue"
import GameForm from "@/components/LandingPage/GameForm.vue"
import SignupForm from "@/components/LandingPage/SignupForm.vue"

export default {
    name: 'landing-page',
    components: {
        LoginForm,
        GameForm,
        SignupForm,
    },
    data() {
        return {
            current_page: 0,
            game_request: {},
        }
    },
    methods: {
        login_response: function (payload) {
            this.current_page = 3
            this.game_request = payload
        },
        game_response: function (payload) {
            console.log(payload)
            // navigate to game area
            this.$router.push({
                name: 'PlayerPage'
            })
        }
    },
    mounted() {
        // if temp token is present *user has signed in/up
        if (this.$cookies.get('token') != undefined) {
            if (this.$cookies.get('token').tempToken != undefined) {
                this.current_page = 3
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.title_block {
    display: grid;
    place-items: center;
    height: 30vh;
    width: 100vw;
    row-gap: 0px;
    font-size: 30px;
    border: black 0.5px solid;

    > h1:nth-child(1) {
        align-self: end;
    }

    > h1:nth-child(2) {
        align-self: start;
    }
}

.button_selection {
    display: grid;
    place-items: center;
    grid-template-rows: 2fr 1fr;
    row-gap: 20px;
    > :nth-child(1) {
        align-self: end;
    }
    > :nth-child(2) {
        align-self: start;
    }
}

.content_block {
    display: grid;
    place-items: center;
    height: 70vh;
    width: 100vw;
    overflow: hidden;
    padding: 10vw;
}
/* // transition settings // */
.transition_article_flip-enter-active,
.transition_article_flip-leave-active {
  transition: all 0.45s ease-in-out;
}

.transition_article_flip-leave-to {
  opacity: 0;
  transform: translateX(-20vw);
}

.transition_article_flip-enter {
  opacity: 0;
  transform: translateX(20vw);
}

.transition_article_flip-enter-to,
.transition_article_flip-leave {
  opacity: 1;
  transform: translateX(0);
}
</style>