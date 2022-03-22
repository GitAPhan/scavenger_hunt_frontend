<template>
    <div>
        <span v-if="error_message != undefined" class="error_container">
            <v-alert
                class="error_alert"
                color="red"
                dense
                dismissible
                elevation="9"
                icon="mdi-alert-outline"
                shaped
                text
                transition="slide-x-transition"               
                type="error"
            >{{ error_message }}</v-alert>
        </span>
        <v-app-bar
            app
            color="primary"
            dark
            src="http://unsplash.it/300?random&gravity=center"
            short
            v-if="tabs != 0"
        >
            <template v-slot:img="{ props }">
                <v-img
                    v-bind="props"
                    gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
                ></v-img>
            </template>

            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-app-bar-title>{{ title }}</v-app-bar-title>

            <v-spacer></v-spacer>

            <v-btn icon @click="$store.dispatch('logout')">
                <v-icon v-if="tab_location % 2 === 0">mdi-logout-variant</v-icon>
                <v-icon v-else>mdi-skull-scan-outline</v-icon>
            </v-btn>
            <template v-slot:extension>
                <v-tabs v-model="tab_location" fixed-tabs>
                    <v-tabs-slider color="yellow"></v-tabs-slider>

                    <v-tab v-for="tab in tabs" :key="tab.text">{{ tab.title }}</v-tab>
                </v-tabs>
            </template>
        </v-app-bar>

        <v-tabs-items v-model="tab_location">
            <v-tab-item v-for="tab in tabs" :key="tab.id">
                <v-card flat>
                    <v-card-text v-text="tab.text"></v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
export default {
    name: 'nav-bar',
    computed: {
        token: {
            get() {
                return this.$store.state['token']
            },
            set(value) {
                this.$store.commit('update_token', value)
            }
        },
        tab_location: {
            get() {
                return this.$store.state['tab_location']
            },
            set(value) {
                this.$store.commit('update_tab_location', value)
            }
        },
        drawer: {
            get() {
                return this.$store.state['drawer']
            },
            set(value) {
                this.$store.commit('update_drawer', value)
            }
        },
        tabs() {
            return this.$store.state['tabs']
        },
        title() {
            return this.$store.state['title']
        },
        error_message: {
            get() {
                return this.$store.state['error_message']
            },
        }
    },
}
</script>

<style scoped>
.error_container {    
    display: grid;
    place-items: center;
    top: 105px;
    position: absolute;
    z-index: 100;
    width: 100%;
}
.error_alert {
    max-width: 90%;
    min-width: 300px;
}
</style>