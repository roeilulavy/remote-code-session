import "./CodeCard.css";

function CodeCard({ id, title, handleCardClick }) {
  return (
    <div className="CodeCard" onClick={() => handleCardClick(id)}>
      <h2 className="CodeCard__title">{title}</h2>
    </div>
  );
}

export default CodeCard;
