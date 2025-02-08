import { useAuth } from "@/context/AuthProvider";
import { useGeneralContext } from "@/context/GeneralProvider";
import { RxCrossCircled } from "react-icons/rx";

const ReplyPreview = () => {
  const {
    showReplyPreview,
    globalMessageState,
    setShowReplyPreview,
    setGlobalMessageState,
  } = useGeneralContext();
  const handleClose = () => {
    setShowReplyPreview(false);
    setGlobalMessageState(null);
  };
  const { user } = useAuth();
  console.log(globalMessageState, "globalMessageState");
  
  return (
    showReplyPreview && (
      <div className="dark:bg-dark-chat_secondary bg-light-chat_secondary rounded-md p-2 border-l-4 dark:border-dark-chat_tertiary border-light-chat_tertiary flex items-center justify-between">
        <div>
          <h6 className="dark:text-dark-chat_tertiary text-light-chat_tertiary font-bold text-xs">
            {globalMessageState?.creator?.id === user?.uid
              ? "You"
              : globalMessageState?.creator?.name}
          </h6>
          {globalMessageState?.image && !globalMessageState?.text && (
            <h6 className="dark:text-light-primary text-dark-primary text-xs">
              📷 Image
            </h6>
          )}
          {globalMessageState?.video && !globalMessageState?.text && (
            <h6 className="dark:text-light-primary text-dark-primary text-xs">
              🎥 Video
            </h6>
          )}
          {globalMessageState?.audio && !globalMessageState?.text && (
            <h6 className="dark:text-light-primary text-dark-primary text-xs">
              🎵 Audio
            </h6>
          )}
          {globalMessageState?.text && (
            <p className="text-xs dark:text-light-primary text-dark-primary">
              {globalMessageState?.text}
            </p>
          )}
        </div>
        {globalMessageState?.image && (
          <div>
            <img
              className="rounded-md max-h-14 w-full}"
              src={globalMessageState?.image || ""}
              alt=""
            />
          </div>
        )}
        {globalMessageState?.audio && (
          <div>
            <audio controls src={globalMessageState?.audio || ""} />
          </div>
        )}
        {globalMessageState?.video && (
          <div>
            <video controls src={globalMessageState?.video || ""} />
          </div>
        )}
        <button onClick={handleClose}>
          <RxCrossCircled />
        </button>
      </div>
    )
  );
};

export default ReplyPreview;
