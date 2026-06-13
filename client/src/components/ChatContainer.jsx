import React, { useRef, useEffect, useContext, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  const { authUser, onlineUsers } = useContext(AuthContext);
  const { messages, sendMessage } = useContext(ChatContext);
  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result);
      };
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !image) return;
    await sendMessage({ text, image });
    setText("");
    setImage(null);
  };

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg flex flex-col justify-between">
      {/*--header--*/}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full object-cover" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {isOnline && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/*--chat area-- */}
      <div className="flex-1 overflow-y-scroll p-3 pb-24">
        {messages.map((msg, index) => {
          const isSentByMe = msg.senderId === authUser?._id;
          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 justify-end mb-4 ${!isSentByMe && "flex-row-reverse"}`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${isSentByMe ? "rounded-br-none" : "rounded-bl-none"}`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-center text-xs flex flex-col items-center">
                <img
                  src={
                    isSentByMe
                      ? (authUser?.profilePic || assets.avatar_icon)
                      : (selectedUser?.profilePic || assets.avatar_icon)
                  }
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
                <p className="text-gray-500 text-[10px]">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/*--bottom area--*/}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col p-3 bg-[#282142]/80 backdrop-blur-md">
        {image && (
          <div className="relative w-20 h-20 mb-2 border border-gray-600 rounded-md overflow-hidden bg-black/20">
            <img src={image} className="w-full h-full object-contain" />
            <button
              onClick={() => setImage(null)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold"
            >
              X
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Send a Message"
              className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
            />
            <input
              type="file"
              id="image"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
              hidden
            />
            <label htmlFor="image">
              <img
                src={assets.gallery_icon}
                alt=""
                className="w-5 mr-2 cursor-pointer"
              />
            </label>
          </div>
          <div onClick={handleSend}>
            <img src={assets.send_button} alt="" className="w-7 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
