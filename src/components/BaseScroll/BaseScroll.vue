<template>
	<div ref="wrapper" class="list-wrapper">
		<div class="scroll-content" ref="scrollContent">
			<div ref="listWrapper">
				<slot></slot>
			</div>
			<!--上拉-->
			<slot name="pullup" :isPullUpLoad="isPullUpLoad">
				<div class="pullup-wrapper" v-if="pullup">
					<div class="before-trigger" v-if="!isPullUpLoad">
						<span>{{pullUpTxt}}</span>
					</div>
					<div class="after-trigger" v-else>
						<BaseScrollLoading class="loading"/>
						<span>正在加载...</span>
					</div>
				</div>
			</slot>
		</div>
		<!--下拉-->
		<slot
			name="pulldown"
			:pullDownStyle="pullDownStyle"
			:beforePullDown="beforePullDown"
			:isPullingDown="isPullingDown"
			:bubbleY="bubbleY"
		>
			<div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pulldown">
				<div class="before-trigger" v-if="beforePullDown">
					<BaseScrollBubble :y="bubbleY"/>
				</div>
				<div class="after-trigger" v-else>
					<div v-if="isPullingDown" class="loading">
						<BaseScrollLoading/>
					</div>
					<div v-else>
						<span>{{refreshTxt}}</span>
					</div>
				</div>
			</div>
		</slot>
	</div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import BaseScrollLoading from "./components/BaseScrollLoading.vue";
import BaseScrollBubble from "./components/BaseScrollBubble.vue";

const DIRECTION_H = "horizontal";
const DIRECTION_V = "vertical";
const getRect = el => {
	if (el instanceof window.SVGElement) {
		let rect = el.getBoundingClientRect();
		return {
			top: rect.top,
			left: rect.left,
			width: rect.width,
			height: rect.height
		};
	} else {
		return {
			top: el.offsetTop,
			left: el.offsetLeft,
			width: el.offsetWidth,
			height: el.offsetHeight
		};
	}
};

export default {
	name: "scroll",
	components: {
		BaseScrollLoading,
		BaseScrollBubble
	},
	props: {
		/**
		 * 列表的数据
		 */
		data: {
			type: Array,
			default: function() {
				return [];
			}
		},
		/**
		 * 1 滚动的时候会非实时（屏幕滑动超过一定时间后）派发scroll事件，会截流。
		 * 2 滚动的时候实时实时派发scroll事件，不会截流。
		 * 3 除了实时派发scroll事件，在swipe和滚动动画运行过程中实时的情况下仍然能实时派发scroll事件
		 */
		probeType: {
			type: Number,
			default: 1
		},
		/**
		 * better-scroll 默认会阻止浏览器的原生 click 事件。
		 * 当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true
		 */
		click: {
			type: Boolean,
			default: true
		},
		/**
         * 是否监听滚动 scroll 事件
         * 回调参数为{Object} {x, y} 滚动的实时坐标
         */
		listenScroll: {
			type: Boolean,
			default: false
		},
		listenBeforeScroll: {
			type: Boolean,
			default: false
		},
		/**
		 * 是否派发滚动到底部的事件，用于上拉加载
		 */
		pullup: {
			type: Boolean,
			default: false
		},
		/**
		 * 是否派发顶部下拉的事件，用于下拉刷新
		 */
		pulldown: {
			type: Boolean,
			default: false
		},
		/**
		 * 开启纵向还是横向滚动
		 */
		direction: {
			type: String,
			default: DIRECTION_V
		},
		scrollbar: {
			type: null,
			default: false
		},
		startY: {
			type: Number,
			default: 0
		},
		refreshDelay: {
			type: Number,
			default: 20
        },
        // 有些场景我们需要支持横向和纵向同时滚动，而不仅限制在某个方向，这个时候我们只要设置 freeScroll 为 true 即可。
		freeScroll: {
			type: Boolean,
			default: false
		},
		mouseWheel: {
			type: Boolean,
			default: false
        },
        // 当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画
		bounce: {
			default: true
		},
		zoom: {
			default: false
		},
		scrollContentWidth: {
			default: ""
		},

		down: {
			contentinit: "下拉可以刷新",
			contentdown: "下拉可以刷新",
			contentover: "释放立即刷新",
			contentrefresh: "正在刷新..."
		}
	},
	data() {
		return {
			beforePullDown: true,
			isRebounding: false,
			isPullingDown: false,
			isPullUpLoad: false,
			pullUpDirty: true,
			pullDownStyle: "",
			bubbleY: 0
		};
	},
	computed: {
		// 上拉加载显示
		pullUpTxt() {
			const moreTxt =
				(this.pullUpLoad &&
					this.pullUpLoad.txt &&
					this.pullUpLoad.txt.more) ||
				this.defaultLoadTxtMore;

			const noMoreTxt =
				(this.pullUpLoad &&
					this.pullUpLoad.txt &&
					this.pullUpLoad.txt.noMore) ||
				this.defaultLoadTxtNoMore;

			return this.pullUpDirty ? moreTxt : noMoreTxt;
		},
		// 上拉刷新成功显示
		refreshTxt() {
			return this.pullDownRefresh && this.pullDownRefresh.txt;
		}
	},
	watch: {
		// 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
		data() {
			setTimeout(() => {
				this.forceUpdate(true);
			}, this.refreshDelay);
		}
	},
	created() {
		(this.pullDownRefresh = {
			threshold: 90,
			stop: 40,
			txt: "刷新成功"
		}),
			!this.pulldown ? (this.pullDownRefresh.stop = 0) : "";
		// 上拉距离设置
		(this.pullUpLoad = {
			threshold: 0,
			txt: {
				more: "加载更多~",
				noMore: "没有更多数据~"
			}
		}),
			(this.pullDownInitTop = -50);
		this.defaultLoadTxtMore = "加载更多~";
		this.defaultLoadTxtNoMore = "没有更多数据~";
	},
	mounted() {
		setTimeout(() => {
			this.initScroll();
		}, 20);
	},
	methods: {
		// 滚动初始化
		initScroll() {
			if (!this.$refs.wrapper) {
				return;
            }
            // 避免数据过少无法上拉加载数据
			if (
				this.$refs.listWrapper &&
				(this.pullDownRefresh || this.pullUpLoad)
			) {
				this.$refs.listWrapper.style.minHeight = `${getRect(
					this.$refs.wrapper
				).height + 1}px`;
				this.$refs.listWrapper.style.display = `flex`;
				this.$refs.listWrapper.style.flexDirection = `column`;
				this.scrollContentWidth
					? (this.$refs.scrollContent.style.minWidth = `${
							this.scrollContentWidth
					  }px`)
					: "";
			}
			// better-scroll插件配置初始化
			let options = {
				probeType: this.probeType,
				click: this.click,
				scrollY: this.freeScroll || this.direction === DIRECTION_V,
				scrollX: this.freeScroll || this.direction === DIRECTION_H,
				scrollbar: this.scrollbar,
				pullDownRefresh: this.pullDownRefresh,
				pullUpLoad: this.pullUpLoad,
				startY: this.startY,
				freeScroll: this.freeScroll,
				mouseWheel: this.mouseWheel,
				bounce: this.bounce,
				zoom: this.zoom
			};

			// better-scroll的初始化
			this.scroll = new BScroll(this.$refs.wrapper, options);

			// 是否派发滚动事件
			if (this.listenScroll) {
				this.scroll.on("scroll", pos => {
					this.$emit("scroll", pos);
				});
			}

			// 是否派发列表滚动开始的事件
			if (this.listenBeforeScroll) {
				this.scroll.on("beforeScrollStart", () => {
					this.$emit("beforeScrollStart");
				});
			}

			// 是否派发顶部下拉事件，用于下拉刷新
			if (this.pulldown) {
				this._initPullDownRefresh();
			}

			// 否派发顶部上拉加载事件
			if (this.pullup) {
				this._initPullUpLoad();
			}
		},
		// 代理better-scroll的disable方法
		disable() {
			this.scroll && this.scroll.disable();
		},
		// 代理better-scroll的enable方法
		enable() {
			this.scroll && this.scroll.enable();
		},
		// 代理better-scroll的refresh方法
		refresh() {
			this.scroll && this.scroll.refresh();
		},
		// 代理better-scroll的scrollTo方法 滚动到指定的位置
		scrollTo() {
			this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
		},
		// 代理better-scroll的scrollToElement方法 滚动到指定的目标元素
		scrollToElement() {
			this.scroll &&
				this.scroll.scrollToElement.apply(this.scroll, arguments);
		},
		destroy() {
			this.scroll.destroy();
		},
		forceUpdate(dirty) {
			if (this.pullDownRefresh && this.isPullingDown) {
				this.isPullingDown = false;
				this._reboundPullDown().then(() => {
					this._afterPullDown();
				});
			} else if (this.pullUpLoad && this.isPullUpLoad) {
				this.isPullUpLoad = false;
				this.scroll.finishPullUp();
				this.pullUpDirty = dirty;
				this.refresh();
			} else {
				this.refresh();
			}
		},
		pullUpDirtyReset(dirty) {
			this.pullUpDirty = dirty;
		},
		_initPullDownRefresh() {
			this.scroll.on("pullingDown", () => {
				this.beforePullDown = false;
				this.isPullingDown = true;
				this.$emit("pullingDown");
			});

			this.scroll.on("scroll", pos => {
				if (!this.pullDownRefresh) {
					return;
				}
				if (this.beforePullDown) {
					this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop);
					this.pullDownStyle = `top:${Math.min(
						pos.y + this.pullDownInitTop,
						10
					)}px`;
				} else {
					this.bubbleY = 0;
				}

				if (this.isRebounding) {
					this.pullDownStyle = `top:${10 -
						(this.pullDownRefresh.stop - pos.y)}px`;
				}
			});
		},
		_initPullUpLoad() {
			this.scroll.on("pullingUp", () => {
				this.isPullUpLoad = true;
				this.$emit("pullingUp");
				// let _this = this;
				//					setTimeout(function() {
				// 						_this.$emit('pullingUp');
				//					}, 30000);
			});
		},
		_reboundPullDown() {
			const { stopTime = 600 } = this.pullDownRefresh;
			return new Promise(resolve => {
				setTimeout(() => {
					this.isRebounding = true;
					this.scroll.finishPullDown();
					resolve();
				}, stopTime);
			});
		},
		_afterPullDown() {
			setTimeout(() => {
				this.pullDownStyle = `top:${this.pullDownInitTop}px`;
				this.beforePullDown = true;
				this.isRebounding = false;
				this.refresh();
			}, this.scroll.options.bounceTime);
		}
	}
};
</script>

<style scoped lang="scss">
.list-wrapper {
	position: relative;
	height: 100%;
	overflow: hidden;
	background-color: #f4f4f4;
	.scroll-content {
		position: relative;
		z-index: 1;
	}
	.list-content {
		position: relative;
		z-index: 10;
		background: #fff;
		.list-item {
			height: 60px;
			line-height: 60px;
			font-size: 18px;
			padding-left: 20px;
			border-bottom: 1px solid #e5e5e5;
		}
	}
	.pulldown-wrapper {
		position: absolute;
		width: 100%;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all;
		color: #999;
		.after-trigger {
			margin-top: 10px;
		}
	}
	.pullup-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 44px;
		color: #999;
		font-size: 12px;
		.after-trigger {
			display: flex;
			align-items: center;
			.loading {
				margin-right: 10px;
			}
		}
	}
}
</style>
