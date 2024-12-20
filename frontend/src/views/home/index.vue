<!--
 * @Author: yangjingyuan yangjingyuan@pwrd.com
 * @Date: 2024-12-20 18:07:03
 * @LastEditors: yangjingyuan yangjingyuan@pwrd.com
 * @LastEditTime: 2024-12-20 18:50:17
 * @FilePath: \frontend\src\views\home\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useVoiceStore } from '@/stores/voice'
import { AudioRecorder } from '@/utils/audio'
import { OpenAIClient } from '@/utils/openai-client'
import { getSessionToken } from '@/services/api'
import { showNotify  } from 'vant'

const voiceStore = useVoiceStore()
const audioRecorder = new AudioRecorder()
const openAIClient = new OpenAIClient()
const responseText = ref('')

const initializeOpenAI = async () => {
  try {
    const token = await getSessionToken()
    console.log('token', token)
    await openAIClient.initialize(token, {
      onResponse: (text) => {
        responseText.value += text
        voiceStore.setProcessing(false)
      },
      onError: (error) => {
        voiceStore.setError(error)
        showNotify({ type: 'danger', message: error })
      }
    })
  } catch (error) {
    voiceStore.setError('初始化失败')
    showNotify({ type: 'danger', message: '初始化失败' })
  }
}

const handleStartRecording = async () => {
  try {
    voiceStore.startRecording()
    const audioTrack = await audioRecorder.startRecording({
      onAudioData: (data) => {
        // 音频数据已经通过WebRTC传输
      },
      onError: (error) => {
        voiceStore.setError(error)
        showNotify({ type: 'danger', message: error })
      }
    })

    if (audioTrack) {
      openAIClient.addAudioTrack(audioTrack)
    }
  } catch (error) {
    voiceStore.setError('录音启动失败')
    showNotify({ type: 'danger', message: '录音启动失败' })
  }
}

const handleStopRecording = () => {
  audioRecorder.stopRecording()
  voiceStore.stopRecording()
}

onUnmounted(() => {
  audioRecorder.stopRecording()
  openAIClient.close()
})

// 初始化OpenAI客户端
initializeOpenAI()
</script>

<template>
  <div class="home">
    <div class="response-container" v-if="responseText">
      <p>{{ responseText }}</p>
    </div>
    <div class="voice-container">
      <van-button
        :loading="voiceStore.isProcessing"
        :type="voiceStore.isRecording ? 'danger' : 'primary'"
        size="large"
        round
        @touchstart="handleStartRecording"
        @touchend="handleStopRecording"
      >
        {{ voiceStore.isRecording ? '松开结束' : '按住说话' }}
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .response-container {
    margin: 20px;
    padding: 15px;
    width: 90%;
    background: #f5f5f5;
    border-radius: 8px;
    
    p {
      margin: 0;
      line-height: 1.5;
    }
  }
  
  .voice-container {
    margin-top: auto;
    margin-bottom: 40px;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
  }
}
</style> 