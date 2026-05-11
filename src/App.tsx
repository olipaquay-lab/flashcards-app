import { useState, useMemo } from "react";
import "./App.css";
import { flashcards } from "./data";

function shuffle(array: any[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

type Mode = "definition_to_term" | "term_to_definition" | "mix";

export default function App() {
  const [mode, setMode] = useState<Mode>("mix");
  const [deck, setDeck] = useState(() => shuffle(flashcards));
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [good, setGood] = useState(0);
  const [bad, setBad] = useState(0);

  const filteredDeck = useMemo(() => {
    return mode === "mix"
      ? deck
      : deck.filter((c) => c.type === mode);
  }, [deck, mode]);

  if (filteredDeck.length === 0) {
    return <div className="empty">Plus de cartes dans ce mode</div>;
  }

  const safeIndex = current % filteredDeck.length;
  const card = filteredDeck[safeIndex];

  function nextCard() {
    setFlipped(false);
    setCurrent(Math.floor(Math.random() * filteredDeck.length));
  }

  function knewIt() {
    setGood((g) => g + 1);
    setDeck((prev) =>
      prev.filter((c) => c.question !== card.question).concat(card)
    );
    nextCard();
  }

  function didntKnow() {
    setBad((b) => b + 1);
    setDeck((prev) => {
      const newDeck = prev.filter((c) => c.question !== card.question);
      newDeck.splice(1, 0, card);
      return newDeck;
    });
    nextCard();
  }

  function resetGame() {
    setDeck(shuffle(flashcards));
    setCurrent(0);
    setFlipped(false);
    setGood(0);
    setBad(0);
    setMode("mix");
  }

  return (
    <div className="app">

      <header className="header">
        <h1>🩺 Flashcards médicales</h1>

        <div className="score">
          ✔ {good} · ❌ {bad}
        </div>
      </header>

      <div className="modes">
        <button onClick={() => { setMode("definition_to_term"); setCurrent(0); }}>
          Définition → Terme
        </button>

        <button onClick={() => { setMode("term_to_definition"); setCurrent(0); }}>
          Terme → Définition
        </button>

        <button onClick={() => { setMode("mix"); setCurrent(0); }}>
          Mix
        </button>
      </div>

      <div
        className={`card ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="inner">

          <div className="front">
            <div className="mode">
              {card.type === "definition_to_term"
                ? "Définition → Terme"
                : "Terme → Définition"}
            </div>

            <div className="question">{card.question}</div>
          </div>

          <div className="back">
            <div className="answer">{card.answer}</div>
          </div>

        </div>
      </div>

      <div className="actions">
        <button onClick={knewIt}>Je savais</button>
        <button onClick={didntKnow}>Je ne savais pas</button>
        <button onClick={resetGame}>Reset</button>
      </div>

    </div>
  );
}