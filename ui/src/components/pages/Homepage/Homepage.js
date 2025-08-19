import React from "react";
import "../../App.css";
import Features from "../../modules/Features/Features";
import { useNavigate } from "react-router-dom";

function Homepage() {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/generator`;
    navigate(path);
  };

  return (
    <div>
      <header className="App-header">
        <h1 className="title">Saga Sage</h1>
        <p className="subtitle">Your AI Co-DM</p>
        <button className="button" onClick={routeChange}>
          Try it now!
        </button>
      </header>
      <section className="section">
        <h2 className="section-title">What is Saga Sage?</h2>
        <p className="section-text">
          Saga Sage is a powerful tool for Dungeons and Dragons players and
          Dungeon Masters. Using the latest in artificial intelligence
          technology, Saga Sage will allow you to generate new settings, quests,
          characters, items, encounters, roll tables and more for all your RPG
          needs. Say goodbye to writer's block and hello to endless
          possibilities.
        </p>
      </section>

      <Features />
      <section className="section">
        <h2 className="section-title">Get Started</h2>
        <p className="section-text">
          Test out Saga Sage and start generating epic content for your
          campaigns today!
        </p>
        <button className="button" onClick={routeChange}>
          Try it now!
        </button>
      </section>
    </div>
  );
}

export default Homepage;
