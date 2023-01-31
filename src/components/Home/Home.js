import { useEffect, useState } from "react";
import { fetchCodes } from "../../utils/Api";
import CodeCard from "../CodeCard/CodeCard";
import Loader from "../Loader/Loader";
import "./Home.css";

function Home({ handleCardClick }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCards = async () => {
      const cards = await fetchCodes();

      if (cards) {
        setData(cards);
      }

      setIsLoading(false);
    };
    getCards();
  }, []);

  return (
    <div className="Home">
      <header>
        <h1 className="Home__title">Choose code block</h1>
      </header>

      {isLoading ? (
        <Loader />
      ) : (
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
      )}
    </div>
  );
}

export default Home;
