# vue-base-demo

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for test
```
yarn run build:test
```

> 基于 vue + vue-router + vuex + axios + vant 的一个基础项目配置

**demo地址：https://github.com/Sakura-pgh/Vue-Base-Demo**

## ajax解决方案
通过对 axios 二次封装，来更适合我们调用

## UI组件库解决方案
UI组件库选择有赞的Vant，该组件成熟稳定较为丰富，适用于移动端。

## vuex持久化解决方案
使用插件 vuex-persistedstate 来将vuex中的数据存于sessionStorage或localStorage中，或实现部分模块数据存于localStorage，其余存于sessionStorage

## 页面滚动解决方案
通过对 better-scroll 进行二次封装，来进行更便捷的使用

## style样式解决方案
采用SASS风格的代码，编写页面重置的 reset.scss 和 mixin 的 mixin.scss，和公共颜色等变量的 param.scss。
并在 vue.config.js 中配置相关参数，以便无需使用@import在每个scss文件中引入变量或者mixin，也可以避免大量@import导致build变慢。

## 环境变量解决方案
通过新建 .env.testEnvironment 等环境变量文件，来实现不同环境调用不同接口或差异化打包等功能

## 页面适配解决方案
采用 postcss-px-to-viewport 将 px 转换成 vw，使用postcss的插件实现vw适配移动端

## 代码风格校验
通过详细的自定义配置 .eslintrc.js 来实现团队代码的风格校验

<br />

## ...未完待续

