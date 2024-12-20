<!--
 * @Author: yangjingyuan yangjingyuan@pwrd.com
 * @Date: 2024-12-19 20:06:08
 * @LastEditors: yangjingyuan yangjingyuan@pwrd.com
 * @LastEditTime: 2024-12-20 18:05:19
 * @FilePath: \frontend\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // 移动端适配
  const htmlDom = document.getElementsByTagName('html')[0]
  htmlDom.style.fontSize = window.innerWidth / 37.5 + 'px'
})
</script>

<template>
  <router-view />
</template>

<style lang="scss">
:root {
  --van-primary-color: #646cff;
}
</style>
