const CodeData = [
  {
    id: 1,
    name: "",
    code: `  import { Route, Routes, useNavigate } from "react-router-dom";
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
    
    export default App;`,
  },
];

export default CodeData;
