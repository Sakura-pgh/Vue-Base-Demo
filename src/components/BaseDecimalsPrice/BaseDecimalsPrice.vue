<template>
	<article class="decimals-price">
		<em class="symbol">¥</em>
		<em class="integer">{{centTransferDollar(price).integer}}</em>
		<em class="symbol">.</em>
		<em class="decimals">{{centTransferDollar(price).decimals}}</em>
	</article>
</template>

<script>
import { centTransferDollar } from '@/utils/priceUtil'

export default {
	components: { },
	props: {
        price: {
            type: [String, Number],
            default: 0,
        }
    },
	data() {
		return {};
	},
	watch: {},
	computed: {},
	created() {
        this.centTransferDollar = centTransferDollar;
    }
};
</script>
<style lang="scss" scoped>
.decimals-price {
    font-size: 12px;
    color: $priceColor;
    line-height: 22px;
    height: 22px;
    .integer {
        margin-left: 2px;
        font-weight: 600;
        font-size: 16px;
    }
}
</style>