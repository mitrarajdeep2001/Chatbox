import { Box, Button, IconButton, Modal } from "@mui/material";
import { IoCreateOutline, IoFilter } from "react-icons/io5";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import { IoPersonAddSharp } from "react-icons/io5";
import { TiGroup } from "react-icons/ti";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthProvider";
import { Chat } from "@/lib/types";
import Contact from "./Contacts";
import { FiCamera } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { IoMdContact } from "react-icons/io";

const ChatList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const { id } = useParams();
  const dummyData = [
    {
      id: 0,
      isGroup: false,
      groupName: "",
      lastMessage: {
        createdBy: "",
        createdAt: "12:00 AM",
        text: "",
        img: "",
        audio: "",
        video: "",
        gif: "",
      },
      createdBy: "Sam Wilson",
      createdAt: "",
      updatedAt: "",
      unseenMsgCount: 0,
    },
    {
      id: 1,
      isGroup: true,
      groupName: "Developers Studio",
      lastMessage: {
        createdBy: "Ryan Tompson",
        createdAt: "10:00 PM",
        text: "Good Night! See you soon",
        img: "",
        audio: "",
        video: "",
        gif: "",
      },
      createdBy: "",
      createdAt: "",
      updatedAt: "",
      unseenMsgCount: 10,
    },
    {
      id: 2,
      isGroup: true,
      groupName: "Web3 Developers",
      lastMessage: {
        createdBy: "Anna Johnson",
        createdAt: "6:00 PM",
        text: "Let's meet tomorrow",
        img: "",
        audio: "",
        video: "",
        gif: "",
      },
      createdBy: "",
      createdAt: "",
      updatedAt: "",
      unseenMsgCount: 6,
    },
    {
      id: 3,
      isGroup: false,
      groupName: "",
      lastMessage: {
        createdBy: "",
        createdAt: "01:00 AM",
        text: "How are you?",
        img: "",
        audio: "",
        video: "",
        gif: "",
      },
      createdBy: "Kevin Smith",
      createdAt: "",
      updatedAt: "",
      unseenMsgCount: 0,
    },
  ];
  const [chats, setChats] = useState<Chat[]>([]);
  const getChats = async () => {
    try {
      const { data } = await axiosInstance.get(`/chat?email=${user?.email}`);
      setChats(data);
    } catch (error) {
      console.log("getChats() ->>", error);
    }
  };
  useEffect(() => {
    getChats();
  }, []);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const handleContactModalOpen = () => setIsContactModalOpen(true);
  const handleGroupModalOpen = () => setIsGroupModalOpen(true);
  const handleContactModalClose = () => setIsContactModalOpen(false);
  const handleGroupModalClose = () => setIsGroupModalOpen(false);
  const [email, setEmail] = useState("");
  const [groupName, setGroupName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([
    user?.email as string,
  ]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    p: 4,
  };

  // validate email
  const validateEmail = async () => {
    if (!email.trim()) {
      setEmailError("Email is required.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address.");
      return;
    } else {
      const res = await checkUser(email);
      if (!res?.data) {
        setEmailError("User doesn't exists. Please check email and try again.");
        return false;
      }
      setEmailError("");
    }
  };

  // validate group name
  const validateGroupName = () => {
    if (!groupName.trim()) {
      setGroupNameError("Group name is required.");
      return;
    } else if (groupName.length < 3) {
      setGroupNameError("Group name must be at least 3 characters long.");
      return;
    } else if (groupName.length > 20) {
      setGroupNameError("Group name must be at most 20 characters long.");
      return;
    } else if (selectedContacts.length < 2) {
      setGroupNameError("At least 2 contacts are required.");
    } else if (imagePreview === "") {
      setGroupNameError("Group icon is required.");
    } else {
      setGroupNameError("");
    }
  };

  // add user to contact
  const addToContact = async () => {
    try {
      await axiosInstance.post(`/contact`, {
        email,
        createdBy: user?.email,
      });
      handleContactModalClose();
      setEmail("");
      setEmailError("");
      getChats();
    } catch (error) {
      console.log("addToContact() ->>", error);
    }
  };

  // check user exists
  const checkUser = async (email: string) => {
    try {
      return await axiosInstance.get(`/user/check`, {
        params: {
          email,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // handle group profile image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUri = URL.createObjectURL(file);
      setImage(file);
      setImagePreview(dataUri);
    }
  };

  const handleCloseImageUpload = () => {
    setImage(null);
    setImagePreview("");
  };

  // handle create group chat
  const handleCreateGroupChat = async () => {
    try {
      // Create a new FormData instance
      const formData = new FormData();

      // Append data to FormData
      formData.append("isGroup", JSON.stringify(true));
      formData.append("groupName", groupName);
      formData.append("members", JSON.stringify(selectedContacts)); // Assuming members is an array, JSON stringify it

      // If an image is selected, append it to FormData
      if (image) {
        formData.append("profilePic", image);
      }

      // Send the POST request with FormData
      const res = await axiosInstance.post("/chat", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
        },
      });

      // Handle the response if necessary
      console.log("Group chat created:", res.data);
      handleGroupModalClose();
      navigate(`/chat/${res.data.id}`);
      getChats();
      setGroupName("");
      setSelectedContacts([user?.email as string]);
      setImage(null);
      setImagePreview("");
      setGroupNameError("");
    } catch (error) {
      console.log("handleCreateGroupChat() ->>", error);
    }
  };

  useEffect(() => {
    validateEmail();
  }, [email]);

  useEffect(() => {
    validateGroupName();
  }, [groupName, selectedContacts, imagePreview]);

  // menu items list
  const menuItems = [
    {
      text: "New Chat",
      isHeader: true,
    },
    {
      icon: <IoPersonAddSharp className="" />,
      text: "Add new contact",
      onClick: handleContactModalOpen,
    },
    {
      icon: <TiGroup className="" />,
      text: "Create new group",
      onClick: handleGroupModalOpen,
    },
    {
      isDivider: true, // Divider item
    },
    {
      text: "All Contacts",
      isHeader: true,
    },
    {
      component: <Contact getChats={getChats} />,
      isHeader: false,
      isDivider: false,
    },
  ];

  return (
    <>
      {/* Contact creation modal */}
      <Modal
        open={isContactModalOpen}
        onClose={handleContactModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="dark:bg-dark-secondary bg-light-secondary rounded-md border-none"
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="email"
                className="text-right dark:text-light-primary text-dark-primary"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                defaultValue=""
                placeholder="johndoe@example.com"
                className="col-span-3 dark:text-light-primary text-dark-primary dark:bg-dark-tertiary bg-light-tertiary rounded-md p-2"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            {emailError && (
              <p className="text-xs text-red-600 text-center">{emailError}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              className="dark:border-dark-chat_secondary border-light-chat_secondary border dark:text-light-chat_secondary text-dark-chat_secondary"
              variant="outlined"
              onClick={handleContactModalClose}
            >
              Cancel
            </Button>
            <Button
              className="dark:bg-dark-chat_secondary bg-light-chat_secondary flex gap-2"
              variant="contained"
              disabled={Boolean(emailError)}
              onClick={addToContact}
            >
              {/* <span className="btn-loader"></span> */}
              Add
            </Button>
          </div>
        </Box>
      </Modal>
      {/* Group creation modal */}
      <Modal
        open={isGroupModalOpen}
        onClose={handleGroupModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="dark:bg-dark-secondary bg-light-secondary rounded-md border-none"
        >
          <div className="grid gap-4 py-2">
            <div className="grid grid-rows-1 items-center gap-1">
              <label
                htmlFor="group_name"
                className="dark:text-light-primary text-dark-primary"
              >
                Provide a group name
              </label>
              <input
                type="text"
                id="group_name"
                defaultValue=""
                placeholder="E.g., Super Developers"
                className="col-span-3 dark:text-light-primary text-dark-primary dark:bg-dark-tertiary bg-light-tertiary rounded-md p-2"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="dark:bg-dark-primary bg-light-primary rounded-[50%] cursor-pointer relative w-12 h-12 flex items-center justify-center">
                {/* Icon for file upload */}
                {!imagePreview ? (
                  <FiCamera className="text-2xl" />
                ) : (
                  <img
                    src={imagePreview}
                    className="w-[80%] h-[80%] rounded-[50%]"
                  />
                )}

                {/* Hidden file input */}
                <input
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  type="file"
                  onChange={handleImageUpload}
                />
              </div>
              {!imagePreview ? (
                <label
                  htmlFor="group_name"
                  className="dark:text-light-primary text-dark-primary"
                >
                  Add group icon
                </label>
              ) : (
                <label
                  htmlFor="group_name"
                  className="dark:text-light-primary text-dark-primary flex items-center"
                >
                  {image?.name}{" "}
                  <button onClick={handleCloseImageUpload}>
                    <RxCross2 />
                  </button>
                </label>
              )}
            </div>
            <div className="dark:text-light-primary text-dark-primary">
              <h5 className="uppercase">Select Contacts</h5>
              <Contact
                getChats={getChats}
                isGroup={true}
                setSelectedContacts={setSelectedContacts}
                selectedContacts={selectedContacts}
              />
            </div>
            {groupNameError && (
              <p className="text-xs text-red-600 text-center">
                {groupNameError}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              className="dark:border-dark-chat_secondary border-light-chat_secondary border dark:text-light-chat_secondary text-dark-chat_secondary"
              variant="outlined"
              onClick={handleGroupModalClose}
            >
              Cancel
            </Button>
            <Button
              className="dark:bg-dark-chat_secondary bg-light-chat_secondary flex gap-2"
              variant="contained"
              disabled={Boolean(groupNameError)}
              onClick={handleCreateGroupChat}
            >
              {/* <span className="btn-loader"></span> */}
              Create
            </Button>
          </div>
        </Box>
      </Modal>
      <div className="w-[30%] border-r-2 dark:border-dark-secondary border-light-tertiary dark:text-light-secondary text-dark-secondary p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-xl">Chats</h2>
          <div className="flex items-center">
            <IconButton
              className="relative"
              onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
            >
              <IoCreateOutline />
              {isDropdownMenuOpen && (
                <DropdownMenu top={40} menuItems={menuItems as any} />
              )}
            </IconButton>
            <IconButton>
              <IoFilter />
            </IconButton>
          </div>
        </div>
        <div className="rounded-md border-b-2 dark:border-b-dark-chat_tertiary border-b-light-chat_tertiary w-full p-2 mb-5">
          <input
            type="text"
            placeholder="Search by name or group name"
            className="w-full bg-transparent border-none outline-none"
          />
        </div>
        {chats.length > 0 ? (
          chats.map((chat) =>
            chat.isGroup ? (
              <div
                key={chat.id}
                className={
                  chat.id === id
                    ? "flex items-center justify-between mb-2 cursor-pointer dark:bg-dark-tertiary bg-light-tertiary rounded-md p-2"
                    : "flex items-center justify-between mb-2 cursor-pointer rounded-md p-2 hover:dark:bg-dark-tertiary/50 hover:bg-light-tertiary/50"
                }
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <img
                  src={chat?.groupProfilePic || ""}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-bold text-sm">{chat?.groupName}</h4>
                  {chat.lastMessage && (
                    <p className="text-xs">
                      <span>{chat.lastMessage?.createdBy + " : "}</span>
                      <span>{chat.lastMessage?.text}</span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p className="text-xs">{chat.lastMessage?.createdAt}</p>
                  {chat.unseenMsgCount > 0 && (
                    <p className="text-white bg-green-600 w-4 h-4 rounded-full flex justify-center items-center text-xs">
                      {chat.unseenMsgCount}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div
                key={chat.id}
                className={
                  chat.id === id
                    ? "flex items-center justify-between mb-2 cursor-pointer dark:bg-dark-tertiary bg-light-tertiary rounded-md p-2"
                    : "flex items-center justify-between mb-2 cursor-pointer rounded-md p-2 hover:dark:bg-dark-tertiary/50 hover:bg-light-tertiary/50"
                }
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                {chat.member?.profilePic ? (
                  <img
                    src={chat.member?.profilePic || ""}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <IoMdContact className="text-5xl dark:fill-dark-secondary fill-light-secondary" />
                )}
                <div className="flex items-center gap-2">
                  <div>
                    <h4 className="font-bold text-sm">{chat.member?.name}</h4>
                    {chat.lastMessage && (
                      <p className="text-sm">{chat.lastMessage?.text}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p className="text-xs">{chat.lastMessage?.createdAt}</p>
                  {chat.unseenMsgCount > 0 && (
                    <p className="text-white bg-green-600 w-4 h-4 rounded-full flex justify-center items-center text-xs">
                      {chat.unseenMsgCount}
                    </p>
                  )}
                </div>
              </div>
            )
          )
        ) : (
          <h5>No Chats Found!</h5>
        )}
      </div>
    </>
  );
};

export default ChatList;
