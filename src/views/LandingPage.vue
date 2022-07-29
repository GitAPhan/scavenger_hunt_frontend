<template>
  <div>
    <v-icon large @click="logout" id="logout_button" v-if="current_page != 0">
      mdi-chevron-left
    </v-icon>
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
          >signup</v-btn
        >
        <v-btn
          outlined
          min-width="150px"
          elevation="2"
          large
          top
          color="secondary"
          @click="current_page = 1"
          >LOGIN</v-btn
        >
        <v-btn
          outlined
          min-width="150px"
          elevation="2"
          large
          @click="current_page = 4"
          color="secondary">demo</v-btn>
      </article>
      <login-form v-else-if="current_page === 1" class="content_block" />
      <signup-form v-else-if="current_page === 2" class="content_block" />
      <div v-else-if="current_page === 4" class="content_block">
        <h1>DEMO</h1>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form class="center_grid" @submit.prevent="demo_button">
            <v-container class="bottom_spacer">
              <validation-provider
                v-slot="{ errors }"
                name="name"
                rules="required|max:30|min:4"
              >
                <v-text-field
                  :error-messages="errors"
                  v-model="name"
                  label="name"
                  required
                  v-on:keyup.enter="demo_button"
                />
              </validation-provider>
            </v-container>
            <v-btn
              outlined
              min-width="150px"
              elevation="2"
              large
              color="primary"
              v-if="invalid"
              :disabled="true"
              >enter name</v-btn
            >
            <v-btn
              outlined
              min-width="150px"
              elevation="2"
              large
              color="primary"
              v-else
              :loading="loading"
              :disabled="loading"
              @click="demo_button"
              >l o g i n</v-btn
            >
          </v-form>
        </validation-observer>
      </div>
      <game-form v-else-if="current_page === 3" class="content_block" />
    </transition>
  </div>
</template>

<script>
import LoginForm from "@/components/LandingPage/LoginForm.vue";
import GameForm from "@/components/LandingPage/GameForm.vue";
import SignupForm from "@/components/LandingPage/SignupForm.vue";
import { required, max, min } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});

extend("min", {
  ...min,
  message: "{_field_} may not be less than {length} characters",
});


export default {
  name: "landing-page",
  components: {
    LoginForm,
    GameForm,
    SignupForm,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      current_page: 0,
      name: "",
      loading: false,
    };
  },
  methods: {
    demo_button: function () {
      // set button to loader
      this.loading = !this.loading;
      // request to database
      this.$axios
        .request({
          url: "http://localhost:5000/api/users/demo",
          method: "POST",
          data: {
            "name": this.name
          },
        })
        .then((res) => {
          this.name = "";
          // set cookie with token
          this.$store.commit("update_token", res.data);
          this.$store.dispatch("login_success")
        })
        .catch((err) => {
          this.name = "";
          // error message
          let error_message =
            "There was an issue communicating with our servers. Please check your connections and try again. If the problem persists, please let our team know and we will address the issue ASAP.";
          if (err.response != undefined) {
            error_message = err.response.data;
          }
          this.$store.commit("update_error_message", error_message);
        })
        .then(() => {
          this.loading = !this.loading;
        // navigate back to checkpoint if checkToken is present
          this.$store.commit("update_tab_location", 1);
          this.$store.commit("update_check_token", "new")
          this.$router.push({
          name: "CheckpointPage",
          })
        });
    },
    login_response: function () {
      this.current_page = 3;
    },
    logout: function () {
      if (this.current_page === 3) {
        this.$store.dispatch("logout");
      }
      this.current_page = 0;
    },
  },
  mounted() {
    // if token is present *user has signed in/up
    if (this.$cookies.get("token") != undefined) {
      if (
        this.$cookies.get("token").playerToken != undefined ||
        this.$cookies.get("token").masterToken != undefined
      ) {
        // this.game_response()
        if (this.$store.state["checkToken"] != undefined) {
          // navigate back to checkpoint if checkToken is present
          this.$router
            .push({
              name: "CheckpointPage",
            })
            .then(() => {
              this.$store.commit("update_tab_location", 1);
            });
        } else {
          // navigate to game area
          this.$router.push({
            name: "PlayerPage",
          });
        }
      } else if (this.$cookies.get("token").loginToken) {
        this.current_page = 3;
      }
    }
    // listening for global emit events
    // loginResponse
    this.$root.$on("loginResponse", this.login_response);
  },
  beforeDestroy() {
    this.$root.$off("loginResponse", this.login_response);
  },
};
</script>

<style lang="scss">
#logout_button {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.title_block {
  display: grid;
  place-items: center;
  height: 30vh;
  width: 100vw;
  font-size: 30px;
  text-align: center;
  padding: 10vw;
}

.button_selection {
  display: grid;
  place-items: center;
  grid-template-rows: 4fr 1fr 3fr;
  row-gap: 5px;
  > :nth-child(1) {
    align-self: end;
  }
  > :nth-child(3) {
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