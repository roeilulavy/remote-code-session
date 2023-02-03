import CodeEditor from "@uiw/react-textarea-code-editor";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Offline from "../../images/offline.png";
import Online from "../../images/online.png";
import * as Anim from "../../images/success-anim.json";
import { getCode } from "../../utils/Api";
import Loader from "../Loader/Loader";
import "./CodeBlock.css";
const { io } = require("socket.io-client");

function CodeBlock() {
  let { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isSocketOnline, setIsSocketOnline] = useState(false);
  const [isMentor, setIsMentor] = useState(true);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [copy, setCopy] = useState(false);
  const [task, setTask] = useState("");
  const [solution, setSolution] = useState("");
  const [checkButtonState, setCheckButtonState] = useState("Check your code");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    let sid = null;

    // const socket = io("https://real-time-coding.onrender.com");
    const socket = io("localhost:5000");
    setSocket(socket);

    const getCodeBlock = async () => {
      const codeBlock = await getCode(id);

      if (codeBlock) {
        setTitle(codeBlock.title);

        const formattedCode = codeBlock.code
          .split("	") // split on TAB
          .map((line) => {
            return line;
          })
          .join("\n");

        setCode(formattedCode);

        const formattedTask = codeBlock.task
          .split("/n") // split on TAB
          .map((line) => {
            return line;
          })
          .join("\n");

        setTask(formattedTask);
        setSolution(codeBlock.solution);
      }
      setIsLoading(false);
    };
    getCodeBlock();

    socket.on("connect", () => {
      console.log("Connected to server");
      setIsSocketOnline(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsSocketOnline(false);
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

  const checkLiveSolution = (e) => {
    let codeToCheck = e
      .split(" ")
      .join("")
      .split("\n")
      .join("")
      .split("	")
      .join("");
    let solutionToCheck = solution
      .split(" ")
      .join("")
      .split("\n")
      .join("")
      .split("	")
      .join("");

    if (codeToCheck === solutionToCheck) {
      setCheckButtonState("Success!");
      setIsPopupOpen(true);
    }
  };

  const checkSolution = () => {
    setCheckButtonState("Checking code");

    let codeToCheck = code
      .split(" ")
      .join("")
      .split("\n")
      .join("")
      .split("	")
      .join("");
    let solutionToCheck = solution
      .split(" ")
      .join("")
      .split("\n")
      .join("")
      .split("	")
      .join("");

    if (codeToCheck === solutionToCheck) {
      setCheckButtonState("Success!");
      setIsPopupOpen(true);
    } else {
      setCheckButtonState("Try agin");
    }
  };

  return (
    <div className="CodeBlock">
      {isLoading ? (
        <Loader />
      ) : !code ? (
        <h1 className="CodeBlock__header-title">Not found!</h1>
      ) : (
        <>
          {isPopupOpen && (
            <div className="CodeBlock__popup-container">
              <div className="CodeBlock__popup">
                <h1 className="CodeBlock__popup-title">Success!</h1>
                <Lottie
                  className="CodeBlock__popup-lottie"
                  animationData={Anim}
                />
                <button
                  className="CodeBlock__popup-button"
                  onClick={() => setIsPopupOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="CodeBlock__header-container">
            <h1 className="CodeBlock__header-title">{title}</h1>
            <h2 className="CodeBlock__header-subtitle">
              {isSocketOnline ? (
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
              onChange={(e) => {
                socket.emit("code-update", { code: e.target.value });
                setCode(e.target.value);
                checkLiveSolution(e.target.value);
              }}
              // readOnly={isMentor ? true : false}
              padding={15}
              style={{
                maxHeight: "60vh",
                fontSize: 16,
                backgroundColor: "#1e1e1e",
                overflow: "auto",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              }}
            />
          </div>

          <div className="CodeBlock__question-container">
            <h1 className="CodeBlock__question-title">Task</h1>

            <button
              className="CodeBlock__question-button"
              onClick={checkSolution}
            >
              <span className="CodeBlock__question-button-span">
                {checkButtonState === "Check your code" ? (
                  <ion-icon name="code-outline"></ion-icon>
                ) : checkButtonState === "Checking code" ? (
                  <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
                ) : checkButtonState === "Try agin" ? (
                  <ion-icon name="alert-circle-outline"></ion-icon>
                ) : (
                  checkButtonState === "Success!" && (
                    <ion-icon name="checkmark-done-outline"></ion-icon>
                  )
                )}
              </span>
              {checkButtonState}
            </button>
          </div>

          <div className="CodeBlock__task-container">
            <textarea
              className="CodeBlock__task-text"
              disabled={true}
              value={task}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default CodeBlock;
