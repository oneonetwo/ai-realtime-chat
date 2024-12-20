interface OpenAIConfig {
  onResponse: (text: string) => void
  onError: (error: string) => void
}

export class OpenAIClient {
  private pc: RTCPeerConnection | null = null
  private audioElement: HTMLAudioElement | null = null
  private dataChannel: RTCDataChannel | null = null
  private token: string = ''

  async initialize(token: string, config: OpenAIConfig) {
    this.token = token
    
    try {
      // 创建 WebRTC 连接
      this.pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      })

      // 设置远程音频播放
      this.audioElement = document.createElement('audio')
      this.audioElement.autoplay = true
      
      this.pc.ontrack = (event) => {
        if (this.audioElement) {
          this.audioElement.srcObject = event.streams[0]
        }
      }
       // Add local audio track for microphone input in the browser
       console.log('navigator.mediaDevices', navigator)
        const ms = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        console.log('ms', ms)
        this.pc.addTrack(ms.getTracks()[0]);

      // 创建数据通道
      this.dataChannel = this.pc.createDataChannel('oai-events')
      this.dataChannel.onmessage = (event) => {
        config.onResponse(event.data)
      }

      // 创建并设置本地描述
      const offer = await this.pc.createOffer()
      await this.pc.setLocalDescription(offer)

      if (!this.pc.localDescription?.sdp) {
        throw new Error('Failed to create local description')
      }

      // 发送 SDP offer 到 OpenAI
      const baseUrl = 'https://api.openai.com/v1/realtime'
      const model = 'gpt-4o-realtime-preview-2024-12-17'
      const response = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          'Authorization': `Bearer ${this.token}`
        },
        body: this.pc.localDescription.sdp
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      // 设置远程描述
      const answerSdp = await response.text()
      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: answerSdp
      }
      
      await this.pc.setRemoteDescription(answer)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      config.onError(`初始化失败: ${errorMessage}`)
      this.close()
      throw error
    }
  }

  addAudioTrack(track: MediaStreamTrack) {
    if (this.pc) {
      this.pc.addTrack(track)
    }
  }

  close() {
    if (this.dataChannel) {
      this.dataChannel.close()
      this.dataChannel = null
    }

    if (this.pc) {
      this.pc.close()
      this.pc = null
    }

    if (this.audioElement) {
      this.audioElement.srcObject = null
      this.audioElement = null
    }
  }
} 