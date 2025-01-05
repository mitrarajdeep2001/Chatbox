import { useWebRTC } from "@/context/WebRTCProvider";
import { Button, ButtonGroup } from "@mui/material";
import { useRef, useEffect } from "react";

const Stream = ({
  myStream,
  remoteStream,
}: {
  myStream: MediaStream | null;
  remoteStream: MediaStream | null;
}) => {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const {handleEndCall} = useWebRTC();

  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [myStream, remoteStream]);

  console.log(myStream, 'myStream', remoteStream, 'remoteStream');
  
  return myStream || remoteStream ? (
    <div className="fixed top-0 left-0 z-50 w-full h-full bg-black flex justify-center items-center">
      {myStream && (
        <video
          ref={myVideoRef}
          autoPlay
          controls={false}
          className="absolute bottom-5 right-5 z-50 w-[200px] h-[200px] object-cover rounded-xl"
        />
      )}
      {remoteStream && (
        <video
          ref={remoteVideoRef}
          autoPlay
          controls={false}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}
      <ButtonGroup
        className="absolute bottom-0 left-[50%] m-4"
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button sx={{bgcolor: "red"}} onClick={handleEndCall}>End</Button>
      </ButtonGroup>
    </div>
  ) : null;
};

export default Stream;
