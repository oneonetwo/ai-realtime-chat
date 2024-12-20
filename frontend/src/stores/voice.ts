/*
 * @Author: yangjingyuan yangjingyuan@pwrd.com
 * @Date: 2024-12-20 18:06:40
 * @LastEditors: yangjingyuan yangjingyuan@pwrd.com
 * @LastEditTime: 2024-12-20 18:06:45
 * @FilePath: \frontend\src\stores\voice.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia'

export const useVoiceStore = defineStore('voice', {
  state: () => ({
    isRecording: false,
    isProcessing: false,
    error: null as string | null,
  }),
  
  actions: {
    startRecording() {
      this.isRecording = true
      this.error = null
    },
    
    stopRecording() {
      this.isRecording = false
    },
    
    setError(error: string) {
      this.error = error
      this.isRecording = false
    },
  },
}) 