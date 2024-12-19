import { Message } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { FiMic } from "react-icons/fi";
import { IoSendOutline } from "react-icons/io5";
import AudioPlayer from "./AudioPlayer";
import MediaPreview from "./MediaPreview";

const TypingBoxWithMic = ({
  message,
  updateMessage,
  sendMessage,
}: {
  message: Message;
  updateMessage: (key: string, value: string) => void;
  sendMessage: () => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordingTimer, setRecordingTimer] = useState(0); // Timer in seconds
  const [recordingInterval, setRecordingInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Temporary array to hold audio chunks during recording
  let tempAudioChunks: Blob[] = [];

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      // Reset chunks
      tempAudioChunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          tempAudioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(tempAudioChunks, { type: "audio/webm" });

        // Ensure the audioBlob is valid
        if (audioBlob.size === 0) {
          console.error("Audio blob is empty. Recording failed.");
          return;
        }

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        updateMessage("audio", url);
        stopTimer();
      };

      recorder.start();
      setIsRecording(true);
      startTimer();
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      stopTimer();
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      startTimer();
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); // Stop recording
      setIsRecording(false);
      stopTimer();
    }
  };

  // Delete recorded audio
  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl); // Revoke the Blob URL
    }
    setAudioUrl(null);
    updateMessage("audio", "");
    resetTimer();
  };

  // Start the timer
  const startTimer = () => {
    const interval = setInterval(() => {
      setRecordingTimer((prev) => prev + 1);
    }, 1000);
    setRecordingInterval(interval);
  };

  // Stop the timer
  const stopTimer = () => {
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
  };

  // Reset the timer
  const resetTimer = () => {
    stopTimer();
    setRecordingTimer(0);
  };

  // Cleanup: revoke URL and stop the timer on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      stopTimer();
    };
  }, [audioUrl]);

  return (
    <div className="flex items-center w-full">
      {audioUrl ? (
        <div className="flex items-center gap-4 w-full">
          <MediaPreview
            mediaSrc={audioUrl}
            mediaType="audio"
            onClose={deleteRecording}
          />
          <p className="text-xs dark:text-light-primary text-dark-primary dark:bg-dark-secondary bg-light-secondary rounded px-2 py-1 uppercase">
            Recording Preview
          </p>
        </div>
      ) : isRecording ? (
        <div className="flex items-center gap-4 w-full">
          <span className="text-sm text-gray-500">
            {formatTime(recordingTimer)}
          </span>
          <Button onClick={pauseRecording}>Pause</Button>
          <Button onClick={resumeRecording}>Resume</Button>
          <Button sx={{ color: "red" }} onClick={stopRecording}>
            Stop
          </Button>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Type a message"
          value={message.text || ""}
          onChange={(e) => updateMessage("text", e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          className="w-full bg-transparent border-none outline-none dark:text-light-primary text-dark-primary"
        />
      )}
      {message.audio || message.text ? (
        <Button onClick={sendMessage}>
          <IoSendOutline />
        </Button>
      ) : (
        <Button onClick={startRecording}>
          <FiMic />
        </Button>
      )}
    </div>
  );
};

export default TypingBoxWithMic;
