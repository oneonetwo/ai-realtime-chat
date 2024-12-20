/*
 * @Author: yangjingyuan yangjingyuan@pwrd.com
 * @Date: 2024-12-20 18:23:21
 * @LastEditors: yangjingyuan yangjingyuan@pwrd.com
 * @LastEditTime: 2024-12-20 18:31:46
 * @FilePath: \frontend\src\services\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

interface SessionResponse {
  token: string
}

export async function getSessionToken(): Promise<string> {
  const response = await api.get('/session')
  console.log('response', response)
  return response.data.client_secret.value
} 