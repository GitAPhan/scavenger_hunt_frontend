<template>
    <div>
        <v-navigation-drawer v-if="$store.state['token']" v-model="drawer" absolute temporary>
            <v-list-item>
                <v-list-item-avatar>
                    <v-img src="https://images.unsplash.com/photo-1630051822408-b80dde2f5681?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>{{ $store.state['token'].username }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense>
                <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    name: 'nav-drawer',
    data() {
        return {
            items: [
                { title: 'Dashboard', icon: 'mdi-shield-home-outline', to: '/player' },
                { title: 'Store', icon: 'mdi-shopping-outline', to: '/store' },
                { title: 'Checkpoint', icon: 'mdi-map-marker-check-outline', to: '/checkpoint' },
                { title: 'GM Panel', icon: 'mdi-shield-crown-outline', to: '/gamemaster' },
            ],
        }
    },
    computed: {
        drawer: {
            get () {
                return this.$store.state['drawer']
            },
            set (value) {
                this.$store.commit('update_drawer', value)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
</style>