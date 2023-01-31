import CodeEditor from "@uiw/react-textarea-code-editor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCode } from "../../utils/Api";
import Loader from "../Loader/Loader";
import "./CodeBlock.css";
const { io } = require("socket.io-client");

function CodeBlock() {
  let { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
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
        const formattedCode = codeBlock
          .split("/n")
          .map((line) => {
            return line.trim();
          })
          .join("\n");

        setCode(formattedCode);
        setIsLoading(false);
      }
    };
    getCodeBlock();

    socket.on("connect", () => {
      console.log("Connected to server");
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
  }, []);

  return (
    <div className="CodeBlock">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="CodeBlock__header-container">
            <h1 className="CodeBlock__header-title">Title</h1>
            <h2 className="CodeBlock__header-subtitle">
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
