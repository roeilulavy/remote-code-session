import CodeEditor from "@uiw/react-textarea-code-editor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Offline from "../../images/offline.png";
import Online from "../../images/online.png";
import { getCode } from "../../utils/Api";
import Loader from "../Loader/Loader";
import "./CodeBlock.css";
const { io } = require("socket.io-client");

function CodeBlock() {
  let { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [socketOnline, setSocketOnline] = useState(false);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [copy, setCopy] = useState(false);
  const [isMentor, setIsMentor] = useState(true);

  useEffect(() => {
    let sid = null;

    const socket = io("http://localhost:5000");
    setSocket(socket);

    const getCodeBlock = async () => {
      const codeBlock = await getCode(id);

      if (codeBlock) {
        const formattedCode = codeBlock.code
          .split("/n")
          .map((line) => {
            return line;
          })
          .join("\n");

        setCode(formattedCode);
        setTitle(codeBlock.title);
      }
      setIsLoading(false);
    };
    getCodeBlock();

    socket.on("connect", () => {
      console.log("Connected to server");
      setSocketOnline(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setSocketOnline(false);
    });

    const newUserConnected = () => {
      socket.emit("new user", sid, (response) => {
        let obj = response.activeUsers.find((item) => {
          if (item.sessionId === sid) {
            return true;
          }
          return null;
        });

        if (obj.role !== "mentor") {
          setIsMentor(false);
        }
      });
    };

    const checkForSid = () => {
      if (!localStorage.getItem("sid")) {
        localStorage.setItem("sid", Math.floor(Math.random() * 1000000));
      }

      sid = localStorage.getItem("sid");
      newUserConnected();
    };

    checkForSid();

    socket.on("code-update", (code) => setCode(code));
    return () => {
      socket.disconnect();
    };
  }, [id]);

  return (
    <div className="CodeBlock">
      {isLoading ? (
        <Loader />
      ) : !code ? (
        <h1 className="CodeBlock__header-title">Not found!</h1>
      ) : (
        <>
          <div className="CodeBlock__header-container">
            <h1 className="CodeBlock__header-title">{title}</h1>
            <h2 className="CodeBlock__header-subtitle">
              {socketOnline ? (
                <img
                  className="CodeBlock__header-status"
                  src={Online}
                  alt="Socket online"
                />
              ) : (
                <img
                  className="CodeBlock__header-status"
                  src={Offline}
                  alt="Socket offline"
                />
              )}
              {isMentor ? "View mode" : "Edit mode"}
            </h2>
            {copy ? (
              <button className="CodeBlock__header-button">
                <span className="CodeBlock__header-button-span">
                  <ion-icon name="checkmark-sharp"></ion-icon>
                </span>
                Copied!
              </button>
            ) : (
              <button
                className="CodeBlock__header-button"
                onClick={() => {
                  navigator.clipboard.writeText("");
                  setCopy(true);
                  setTimeout(() => {
                    setCopy(false);
                  }, 3000);
                }}
              >
                <span className="CodeBlock__header-button-span">
                  <ion-icon name="clipboard-outline"></ion-icon>
                </span>
                Copy code
              </button>
            )}
          </div>

          <div className="CodeBlock__code-container">
            <CodeEditor
              value={code}
              language="javascript"
              placeholder="Please enter JS code."
              onChange={(e) =>
                socket.emit("code-update", { code: e.target.value })
              }
              readOnly={isMentor ? true : false}
              padding={15}
              style={{
                maxHeight: "80vh",
                fontSize: 16,
                backgroundColor: "#1e1e1e",
                overflow: "auto",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default CodeBlock;
