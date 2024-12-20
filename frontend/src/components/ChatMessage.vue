<script setup lang="ts">
defineProps<{
  type: 'user' | 'assistant'
  content: string
}>()

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="message" :class="type">
    <div class="avatar">
      {{ type === 'user' ? '👤' : '🤖' }}
    </div>
    <div class="content">
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message {
  display: flex;
  margin: 10px 0;
  padding: 0 15px;
  gap: 10px;
  
  &.user {
    flex-direction: row-reverse;
    
    .content {
      background: var(--van-primary-color);
      color: white;
      border-radius: 15px 15px 0 15px;
    }
  }
  
  &.assistant {
    .content {
      background: #f5f5f5;
      border-radius: 15px 15px 15px 0;
    }
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
  
  .content {
    max-width: 70%;
    padding: 10px 15px;
    
    p {
      margin: 0;
      line-height: 1.5;
      word-break: break-word;
    }
  }
}
</style> 