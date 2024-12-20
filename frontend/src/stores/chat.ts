/*
 * @Author: yangjingyuan yangjingyuan@pwrd.com
 * @Date: 2024-12-20 19:23:56
 * @LastEditors: yangjingyuan yangjingyuan@pwrd.com
 * @LastEditTime: 2024-12-20 19:24:01
 * @FilePath: \frontend\src\stores\chat.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: number
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])

  function addMessage(type: 'user' | 'assistant', content: string) {
    messages.value.push({
      id: Date.now().toString(),
      type,
      content,
      timestamp: Date.now()
    })
  }

  function clearHistory() {
    messages.value = []
  }

  return {
    messages,
    addMessage,
    clearHistory
  }
}) 