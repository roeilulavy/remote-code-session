import CodeEditor from "@uiw/react-textarea-code-editor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CodeBlock.css";
const { io } = require("socket.io-client");

function CodeBlock() {
  let { id } = useParams();

  const codeString = `  import { Route, Routes, useNavigate } from "react-router-dom";
  import "./App.css";
  import CodeBlock from "./CodeBlock/CodeBlock";
  import Home from "./Home/Home";
  import Navbar from "./NavBar/Navbar";
  
  function App() {
    const Navigate = useNavigate();
  
    return (
      <div className="App">
        <Navbar />
  
        <Routes>
          <Route path="/" element={<Home handleCardClick={handleCardClick} />} />
  
          <Route path="/codeblock/:id" element={<CodeBlock />} />
  
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    );
  }
  
  export default App;`;

  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState(codeString);
  const [copy, setCopy] = useState(false);
  const [isMentor, setIsMentor] = useState(true);

  useEffect(() => {
    let sid = null;

    const socket = io("http://localhost:5000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // socket.on("mentor", () => {
    //   console.log("User is a mentor");
    // });

    // socket.on("student", () => {
    //   console.log("User is a student");
    // });

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
      <div className="CodeBlock__header-container">
        <h1 className="CodeBlock__header-title">Title {id}</h1>
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
              navigator.clipboard.writeText(codeString);
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
          language="jsx"
          placeholder="Please enter JS code."
          onChange={(e) => socket.emit("code-update", { code: e.target.value })}
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
    </div>
  );
}

export default CodeBlock;
