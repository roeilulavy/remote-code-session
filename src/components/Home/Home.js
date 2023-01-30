import { useEffect, useState } from "react";
import cards from "../../utils/Api";
import CodeCard from "../CodeCard/CodeCard";
import "./Home.css";

function Home({ handleCardClick }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(cards);
  }, []);

  return (
    <div className="Home">
      <header>
        <h1 className="Home__title">Choose code block</h1>
      </header>

      <section>
        {data.length > 0 ? (
          <div className="Home__cards-container">
            {data.map((code, index) => (
              <CodeCard
                key={index}
                id={code.id}
                title={code.title}
                handleCardClick={handleCardClick}
              />
            ))}
          </div>
        ) : (
          <h2>Not found!</h2>
        )}
      </section>
    </div>
  );
}

export default Home;
