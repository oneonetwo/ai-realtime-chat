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
import { useChatStore } from '@/stores/chat'
import { AudioRecorder } from '@/utils/audio'
import { OpenAIClient } from '@/utils/openai-client'
import { getSessionToken } from '@/services/api'
import { showNotify } from 'vant'
import AudioVisualizer from '@/components/AudioVisualizer.vue'
import ChatMessage from '@/components/ChatMessage.vue'

const voiceStore = useVoiceStore()
const chatStore = useChatStore()
const audioRecorder = new AudioRecorder()
const openAIClient = new OpenAIClient()
const currentMessage = ref('')

const initializeOpenAI = async () => {
  try {
    const token = await getSessionToken()
    await openAIClient.initialize(token, {
      onResponse: (text) => {
        currentMessage.value += text
        if (text.includes('[DONE]')) {
          chatStore.addMessage('assistant', currentMessage.value)
          currentMessage.value = ''
          voiceStore.setProcessing(false)
        }
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
    <div class="chat-container">
      <template v-for="message in chatStore.messages" :key="message.id">
        <ChatMessage
          :type="message.type"
          :content="message.content"
        />
      </template>
      <ChatMessage
        v-if="currentMessage"
        type="assistant"
        :content="currentMessage"
      />
    </div>
    
    <div class="control-panel">
      <AudioVisualizer :is-recording="voiceStore.isRecording" />
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
  
  .chat-container {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
  }
  
  .control-panel {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }
}
</style> 