/*
 * @Author: yangjingyuan yangjingyuan@pwrd.com
 * @Date: 2024-12-19 20:06:08
 * @LastEditors: yangjingyuan yangjingyuan@pwrd.com
 * @LastEditTime: 2024-12-20 18:17:44
 * @FilePath: \frontend\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Notify, Button } from 'vant'
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router/index'
import './styles/index.scss'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Button)
app.use(Notify)
app.mount('#app')
