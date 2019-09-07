<template>
	<article class="mine-view">
        <p>暂未开放，敬请期待</p>
    </article>
</template>

<script>
import { Toast } from "vant";
import { getGoosTypesInfo } from '@/api/api';
export default {
	components: { [Toast.name]: Toast },
	props: {},
	data() {
		return {};
	},
	methods: {
        //获取首页信息
        _getGoosTypesInfo() {
            getGoosTypesInfo().then(res => {
                let {data} = res;
                console.log(data);
            });
        },
    },
	created() {
        this._getGoosTypesInfo();
    },
	mounted() {}
};
</script>
<style lang="scss" scoped>
/*@import "../../style/file/fileName.scss";*/
</style>