import { formatTime } from "@/lib/utils";
import { Slider } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { IoMdVolumeHigh, IoMdVolumeLow, IoMdVolumeOff } from "react-icons/io";
import { MdForward10, MdOutlineReplay10 } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

interface AudioPlayerProps {
  audioUrl: string; // URL of the audio file
  waveColor?: string; // Color of the sound wave
  progressColor?: string; // Color of the progress indicator
  height?: number; // Height of the waveform
  onPlay?: () => void; // Callback when the audio starts playing
  onPause?: () => void; // Callback when the audio is paused
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  waveColor = "#06cf9c",
  progressColor = "#1c6c5e",
  height = 128,
  onPlay,
  onPause,
}) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5); // Volume state (0 to 1)
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor,
      progressColor,
      height,
    });

    // Load the audio file
    wavesurfer.load(audioUrl);
    wavesurfer.setVolume(volume);
    wavesurferRef.current = wavesurfer;

    // Event listeners
    wavesurfer.on("play", () => {
      setIsPlaying(true);
      onPlay && onPlay();
    });

    wavesurfer.on("pause", () => {
      setIsPlaying(false);
      onPause && onPause();
    });

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
      onPause && onPause();
    });

    wavesurfer.on("audioprocess", () => {
      setCurrentTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on("ready", () => {
      setDuration(wavesurfer.getDuration());
    });

    return () => {
      // Clean up WaveSurfer instance
      wavesurfer.destroy();
    };
  }, [audioUrl, waveColor, progressColor, height, onPlay, onPause, volume]);

  // handles play or pause the audio
  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      if (wavesurferRef.current.isPlaying()) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  };

  // handles replay the audio by 10 seconds
  const handleReplay = () => {
    if (wavesurferRef.current) {
      const newTime = Math.max(wavesurferRef.current.getCurrentTime() - 10, 0);
      wavesurferRef.current.seekTo(newTime / duration); // WaveSurfer's seekTo accepts a fraction of the duration
    }
  };

  // handles forward the audio by 10 seconds
  const handleForward = () => {
    if (wavesurferRef.current) {
      const newTime = Math.min(
        wavesurferRef.current.getCurrentTime() + 10,
        duration
      );
      wavesurferRef.current.seekTo(newTime / duration); // WaveSurfer's seekTo accepts a fraction of the duration
    }
  };

  // handles volume changes
  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    const volumeValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(volumeValue);
    setIsMuted(volumeValue === 0);
    // Only set volume on WaveSurfer, ensuring no disruption to playback state
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(volumeValue);
    }
  };

  // handles mute and unmute actions
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      wavesurferRef.current?.setVolume(volume);
    } else {
      setIsMuted(true);
      wavesurferRef.current?.setVolume(0);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Container for WaveSurfer waveform */}
      <div className="flex w-full justify-center items-center gap-10 dark:text-light-primary text-dark-primary">
        <div>{formatTime(currentTime)}</div>
        <div ref={waveformRef} className="w-1/2" />
        <div>{formatTime(duration)}</div>
      </div>

      <div className="flex justify-center items-center gap-20 w-[50%]">
        {/* Audio controls */}
        <div className="flex items-center gap-10">
          {/* Replay 10 seconds button */}
          <button onClick={handleReplay}>
            <MdOutlineReplay10 />
          </button>
          {/* Play/Pause button */}
          <button onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          {/* Forward 10 seconds button */}
          <button onClick={handleForward}>
            <MdForward10 />
          </button>
        </div>
        {/* Volume controls */}
        <div className="flex items-center gap-5 w-1/4">
          {/* Volume icons with toggle functionality */}
          <button onClick={toggleMute}>
            {isMuted ? (
              <IoMdVolumeOff />
            ) : volume > 0.5 ? (
              <IoMdVolumeHigh />
            ) : (
              <IoMdVolumeLow />
            )}
          </button>
          <Slider
            aria-label="Volume"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.01}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
