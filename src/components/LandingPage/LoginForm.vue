<template>
  <div class="login_form">
    <h1>login</h1>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form class="center_grid" @submit.prevent="submit">
        <v-container class="bottom_spacer">
          <validation-provider
            v-slot="{ errors }"
            name="username"
            rules="required|max:30|min:8"
          >
            <v-text-field
              :error-messages="errors"
              v-model="username"
              label="username"
              required
            />
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="password"
            rules="required|max:30|min:8"
          >
            <v-text-field
              v-model="password"
              :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show_password ? 'text' : 'password'"
              label="password"
              :error-messages="errors"
              placeholder="enter your password"
              required
              @click:append="show_password = !show_password"
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
          >enter info</v-btn
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
          @click="login"
          >l o g i n</v-btn
        >
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
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
  name: "login-form",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      loading: false,
      username: "",
      password: "",
      show_password: false,
    };
  },
  methods: {
    submit() {
      this.$refs.observer.validate();
    },
    clear() {
      this.username = "";
      this.password = "";
      this.$refs.observer.reset();
    },
    login() {
      // set button to loader
      this.loading = !this.loading;
      // create request data
      let request_data = {
        username: this.username,
        password: this.password,
      };
      // request to database
      this.$axios
        .request({
          url: "http://localhost:5000/api/login",
          method: "POST",
          data: request_data,
        })
        .then((res) => {
          this.clear();
          // set cookie with token
          this.$store.commit("update_token", res.data);
          this.$root.$emit("loginResponse");
        })
        .catch((err) => {
          this.clear();
          // error message
          let error_message = "There was an issue communicating with our servers. Please check your connections and try again. If the problem persists, please let our team know and we will address the issue ASAP."
          if (err.response != undefined) {
            error_message = err.response.data
          }
          this.$store.commit("update_error_message", error_message);
        })
        .then(() => {
          this.loading = !this.loading;
        });
    },
  },
};
</script>

<style scoped>
h1 {
  margin-right: 200px;
}
.center_grid {
  display: grid;
  place-items: center;
  max-width: 80vw;
  min-width: 300px;
}
.bottom_spacer {
  margin-bottom: 30px;
}
.login_form {
  grid-template-rows: 1fr 4fr;
}
.alert {
  position: absolute;
  top: 45vh;
}
</style>