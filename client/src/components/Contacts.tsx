import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, IconButton } from "@mui/material";
import axiosInstance from "@/lib/axiosInstance";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdContact } from "react-icons/io";
// import { user } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

function Contact({
  getChats,
  isGroup = false,
  selectedContacts,
  setSelectedContacts,
}: {
  getChats: () => void;
  isGroup?: boolean;
  selectedContacts?: string[];
  setSelectedContacts?: (contacts: string[]) => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);

  // get all contacts
  const getContacts = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/contact?email=${user?.email}`);
      setContacts(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getContacts();
  }, []);

  // create chat with another user
  const createChat = async (email: string) => {
    try {
      const chat = await axiosInstance.post("/chat", {
        isGroup: false,
        members: [user?.email, email],
      });
      getChats();
      navigate(`/chat/${chat.data.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // handle checkbox selection
  const handleCheckboxChange = (email: string) => {
    if (!setSelectedContacts || !selectedContacts) return; // Ensure setSelectedContacts is defined
    setSelectedContacts(
      selectedContacts.includes(email)
        ? selectedContacts.filter((email) => email !== email) // Remove if already selected
        : [...selectedContacts, email] // Add if not already selected
    );
  };
  return (
    <>
      {contacts.length > 0 ? (
        contacts.map((contact: { id: string; name: string; email: string }) => (
          <div
            onClick={(e) => e.preventDefault()}
            key={contact.id}
            className="flex justify-between items-center w-full"
          >
            <div className="flex gap-2 items-center">
              {isGroup && (
                <Checkbox
                  checked={selectedContacts?.includes(contact.email)}
                  onClick={() => handleCheckboxChange(contact.email)}
                />
              )}
              <IoMdContact />
              <h5 className="max-w-24 truncate">{contact.name}</h5>
            </div>
            {!isGroup && (
              <div className="">
                <Button
                  className="dark:bg-dark-chat_secondary bg-light-chat_secondary cursor-pointer"
                  sx={{ padding: 0, zoom: 0.7 }}
                  variant="contained"
                  onClick={() => createChat(contact.email)}
                >
                  Chat
                </Button>
                <IconButton>
                  <BsThreeDotsVertical />
                </IconButton>
              </div>
            )}
          </div>
        ))
      ) : (
        <h5 className="dark:text-light-primary text-dark-primary">
          No Contacts Found!
        </h5>
      )}
    </>
  );
}

export default Contact;
