class WebRTCService {
  webrtc: any;
  constructor() {
    if (!this.webrtc) {
      this.webrtc = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  createOffer = async (): Promise<RTCSessionDescriptionInit | undefined> => {
    try {
      if (this.webrtc) {
        const offer = await this.webrtc.createOffer();
        await this.webrtc.setLocalDescription(offer);
        return this.webrtc.localDescription;
      }
    } catch (error) {
      console.log("createOffer() ->>", error);
    }
  };

  createAnswer = async (
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit | undefined> => {
    try {
      if (this.webrtc) {
        await this.webrtc.setRemoteDescription(offer);
        const answer = await this.webrtc.createAnswer();
        await this.webrtc.setLocalDescription(answer);
        return this.webrtc.localDescription;
      }
    } catch (error) {
      console.log("createAnswer() ->>", error);
    }
  };

  setRemoteDescription = async (
    answer: RTCSessionDescriptionInit
  ): Promise<void> => {
    try {
      if (this.webrtc) {
        console.log(
          "Setting remote description",
          answer,
          this.webrtc.signalingState
        );
        await this.webrtc.setRemoteDescription(answer);
      }
    } catch (error) {
      console.log("setRemoteDescription() ->>", error);
    }
  };
}

export default new WebRTCService();
