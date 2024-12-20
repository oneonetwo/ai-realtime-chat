<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isRecording: boolean
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
const BAR_COUNT = 30
const bars = Array(BAR_COUNT).fill(0)

const animate = () => {
  if (!canvasRef.value || !props.isRecording) return
  
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  
  // 生成动态波形
  for (let i = 0; i < BAR_COUNT; i++) {
    if (props.isRecording) {
      bars[i] = Math.random() * 50 + 10
    } else {
      bars[i] = Math.max(0, bars[i] - 2)
    }
    
    const x = (canvasRef.value.width / BAR_COUNT) * i
    const height = bars[i]
    
    ctx.fillStyle = '#646cff'
    ctx.fillRect(
      x,
      canvasRef.value.height / 2 - height / 2,
      4,
      height
    )
  }
  
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <canvas
    ref="canvasRef"
    width="300"
    height="60"
    class="audio-visualizer"
  />
</template>

<style lang="scss" scoped>
.audio-visualizer {
  width: 300px;
  height: 60px;
  margin: 20px 0;
}
</style> 