import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import io from "socket.io-client";

import DashboardLayout
  from "../layouts/DashboardLayout";


// SOCKET
const socket =
  io("http://localhost:5000");


function TeamChat() {

  const { id } =
    useParams();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [message,
    setMessage] =
    useState("");

  const [messages,
    setMessages] =
    useState([]);

  // CLEAR GLOBAL NOTIFICATION
  useEffect(() => {

    localStorage.removeItem(
      "global_team_notification"
    );

  }, []);

  // JOIN ROOM
  useEffect(() => {

    socket.emit(
      "join_team",
      id
    );

    console.log(
      "Joined room:",
      id
    );

  }, [id]);

  // LOAD OLD MESSAGES
  useEffect(() => {

    const loadHandler =
      (oldMessages) => {

        console.log(
          "Loaded old messages"
        );

        setMessages(
          oldMessages
        );

      };

    socket.on(
      "load_messages",
      loadHandler
    );

    return () => {

      socket.off(
        "load_messages",
        loadHandler
      );

    };

  }, []);

  // RECEIVE NEW MESSAGE
  useEffect(() => {

    const receiveHandler =
      (data) => {

        console.log(
          "Received:",
          data
        );

        setMessages(
          (prev) => [

            ...prev,

            data,

          ]
        );

        // GLOBAL NOTIFICATION
        if (
          window.location.pathname !==
          `/teams/${data.teamId}/chat`
        ) {

          localStorage.setItem(
            "global_team_notification",
            "true"
          );

        }

      };

    socket.on(
      "receive_message",
      receiveHandler
    );

    return () => {

      socket.off(
        "receive_message",
        receiveHandler
      );

    };

  }, []);

  // SEND MESSAGE
  const sendMessage = () => {

    if (!message.trim())
      return;

    const messageData = {

      teamId: id,

      sender:
        user?.name,

      text: message,

    };

    // SEND TO SERVER
    socket.emit(
      "send_message",
      messageData
    );

    setMessage("");

  };

  return (
    <DashboardLayout>

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-5xl font-bold mb-3">

            Team Chat

          </h1>

          <p className="text-gray-400 text-lg">

            Collaborate with your team in real-time.

          </p>

        </div>

        {/* CHAT BOX */}
        <div className="bg-[#0f172a] border border-white/10 rounded-3xl h-[70vh] flex flex-col overflow-hidden">

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {messages.length === 0 ? (

              <div className="h-full flex items-center justify-center text-gray-500">

                No messages yet.

              </div>

            ) : (

              messages.map(
                (
                  msg,
                  index
                ) => (

                  <div
                    key={index}
                    className={`max-w-md p-4 rounded-2xl ${
                      msg.sender ===
                      user?.name

                        ? "ml-auto bg-blue-600 text-white"

                        : "bg-white/10 text-white"
                    }`}
                  >

                    <div className="flex items-center justify-between gap-4 mb-2">

                      <h3 className="font-semibold text-sm">

                        {msg.sender}

                      </h3>

                      <span className="text-xs opacity-70">

                        {
                          new Date(
                            msg.createdAt
                          ).toLocaleTimeString()
                        }

                      </span>

                    </div>

                    <p>

                      {msg.text}

                    </p>

                  </div>

                )
              )

            )}

          </div>

          {/* INPUT */}
          <div className="border-t border-white/10 p-5 flex gap-4">

            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              className="flex-1 bg-[#020617] border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 transition-all px-8 rounded-2xl font-semibold"
            >

              Send

            </button>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default TeamChat;