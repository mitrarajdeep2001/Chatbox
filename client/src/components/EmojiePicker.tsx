import React from "react";
import { Modal } from "@mui/material";
import Picker from "@emoji-mart/react";
import { useTheme } from "@/context/ThemeProvider";

interface EmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: any) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  open,
  onClose,
  onEmojiSelect,
}) => {
  const { theme } = useTheme();
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="emoji-picker-modal"
      aria-describedby="select-an-emoji"
    >
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "35%",
          transform: "translate(-50%, -50%)",
          borderRadius: "10px",
        }}
      >
        <Picker
          onEmojiSelect={onEmojiSelect}
          theme={theme} // "dark" or "light"
        />
      </div>
    </Modal>
  );
};

export default EmojiPicker;
