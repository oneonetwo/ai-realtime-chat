async function init(): Promise<void> {
    // 从服务器获取临时密钥
    const tokenResponse = await fetch("/session");
    const data: { client_secret: { value: string } } = await tokenResponse.json();
    const EPHEMERAL_KEY: string = data.client_secret.value;
  
    // 创建WebRTC点对点连接
    const pc: RTCPeerConnection = new RTCPeerConnection();
  
    // 设置远程音频播放
    // 创建音频元素并设置自动播放
    const audioEl: HTMLAudioElement = document.createElement("audio");
    audioEl.autoplay = true;
    // 当收到音轨时，将其设置为音频元素的源
    pc.ontrack = e => audioEl.srcObject = e.streams[0];
  
    // 添加本地麦克风音轨
    // 获取用户的麦克风权限和音频流
    const ms: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    // 将音轨添加到对等连接中
    pc.addTrack(ms.getTracks()[0]);
  
    // 设置数据通道用于收发事件
    const dc: RTCDataChannel = pc.createDataChannel("oai-events");
    // 添加消息监听器
    dc.addEventListener("message", (e: MessageEvent) => {
      // 这里可以接收到服务器的实时事件
      console.log(e);
    });
  
    // 使用会话描述协议(SDP)启动会话
    // 创建连接请求
    const offer: RTCSessionDescriptionInit = await pc.createOffer();
    // 设置本地描述
    await pc.setLocalDescription(offer);
  
    // 设置API基础URL和模型
    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-realtime-preview-2024-12-17";
    // 发送SDP请求到OpenAI服务器
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp"
      },
    });
  
    // 处理服务器返回的SDP应答
    const answer: RTCSessionDescriptionInit = {
      type: "answer",
      sdp: await sdpResponse.text(),
    };
    // 设置远程描述，完成连接建立
    await pc.setRemoteDescription(answer);
  }
  
  // 调用初始化函数
  init();