<!--
 * @Author: yangjingyuan yangjingyuan@pwrd.com
 * @Date: 2024-12-20 18:07:03
 * @LastEditors: yangjingyuan yangjingyuan@pwrd.com
 * @LastEditTime: 2024-12-20 18:09:44
 * @FilePath: \frontend\src\views\home\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useVoiceStore } from '@/stores/voice'
import { AudioRecorder } from '@/utils/audio'
import { showNotify } from 'vant'

const voiceStore = useVoiceStore()
const audioRecorder = new AudioRecorder()

const handleStartRecording = async () => {
  try {
    voiceStore.startRecording()
    await audioRecorder.startRecording({
      onAudioData: (data) => {
        // TODO: 处理音频数据，发送到服务器
        console.log('Audio data received:', data.length)
      },
      onError: (error) => {
        voiceStore.setError(error)
        showNotify({ type: 'danger', message: error })
      }
    })
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
})
</script>

<template>
  <div class="home">
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
  
  .voice-container {
    margin-top: 40vh;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
  }
}
</style> 