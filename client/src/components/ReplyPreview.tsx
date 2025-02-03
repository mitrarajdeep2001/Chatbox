import { useGeneralContext } from "@/context/GeneralProvider"
import { RxCrossCircled } from "react-icons/rx";

const ReplyPreview = () => {
    const {showReplyPreview, globalMessageState, setShowReplyPreview, setGlobalMessageState} = useGeneralContext()
    const handleClose = () => {
        setShowReplyPreview(false);
        setGlobalMessageState(null);
    }
  return (
    showReplyPreview && (
      <div className="dark:bg-dark-chat_secondary bg-light-chat_secondary rounded-md p-2 border-l-4 dark:border-dark-chat_tertiary border-light-chat_tertiary flex items-center justify-between">
        <p className="text-sm dark:text-light-primary text-dark-primary">
            {globalMessageState?.text}
        </p>
        <button onClick={handleClose}>
            <RxCrossCircled />
        </button>
      </div>
    )
  );
}

export default ReplyPreview