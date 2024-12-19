import React from "react";
import { RxCrossCircled } from "react-icons/rx";
import AudioPlayer from "./AudioPlayer";

// Props interface for TypeScript (optional)
interface MediaPreviewProps {
  mediaSrc: string; // The source of the media to preview
  mediaType: "image" | "audio" | "video"; // The type of media (image or audio or video)
  onClose: () => void; // Function to handle closing the preview
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaSrc,
  mediaType,
  onClose,
}) => {
  // console.log(mediaSrc, mediaType, "mediaSrc, mediaType");

  if (!mediaSrc) return null; // Don't render if there's no media to preview

  return (
    <div className="absolute bottom-[52px] w-1/2 dark:bg-dark-secondary bg-light-secondary rounded-md">
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 z-20 cursor-pointer"
        onClick={onClose}
      >
        <RxCrossCircled className="text-xl" />
      </button>

      {/* Conditional Rendering for Media */}
      {mediaType === "audio" ? (
        <AudioPlayer
          audioUrl={mediaSrc}
          height={100}
          onPlay={() => console.log("Playing")}
          onPause={() => console.log("Paused")}
        />
      ) : mediaType === "video" ? (
        <video
          src={mediaSrc}
          controls
          className="w-full max-h-[calc(100vh-200px)] rounded-lg"
        />
      ) : (
        <img
          src={mediaSrc}
          alt="Preview"
          className="w-full max-h-96 rounded-lg object-cover"
        />
      )}
    </div>
  );
};

export default MediaPreview;
