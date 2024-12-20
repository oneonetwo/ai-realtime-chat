export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording({ onAudioData, onError }: {
    onAudioData: (data: Blob) => void;
    onError: (error: string) => void;
  }) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onAudioData(event.data);
        }
      };

      this.mediaRecorder.onerror = () => {
        onError('录音出错');
      };

      this.mediaRecorder.start(100); // 每100ms触发一次ondataavailable事件
    } catch (error) {
      onError('无法访问麦克风');
      throw error;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }
} 