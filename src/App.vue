<template>
	<div id="app"  v-wechat-title="title">
		<router-view />
	</div>
</template>

<script>
import Vue from 'vue';

export default {
	name: 'App',
    components: {},
    data () {
        return {
            title: '',
        }
    },
    methods: {},
    watch: {
        $route: function(route) {
            this.title = route.meta.name;
            console.log(this.title);
        },
    },
    created () {
    }
};
</script>