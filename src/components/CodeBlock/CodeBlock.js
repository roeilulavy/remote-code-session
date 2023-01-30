import CodeEditor from "@uiw/react-textarea-code-editor";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./CodeBlock.css";

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

  const [code, setCode] = useState(codeString);
  const [copy, setCopy] = useState(false);

  return (
    <div className="CodeBlock">
      <div>
        <h2>dfdfdf</h2>
      </div>
      <div className="CodeBlock__header-container">
        <h1 className="CodeBlock__header-title">Title {id}</h1>
        <h2 className="CodeBlock__header-subtitle">Socket status</h2>
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
          onChange={(evn) => setCode(evn.target.value)}
          padding={15}
          readOnly={false}
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
