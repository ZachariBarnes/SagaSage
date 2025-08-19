import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../images/logo512.png";
import "./Navbar.scss";
import Auth from "../Auth/Auth";
import { useSelector } from "react-redux";
import { selectCharacter } from "../../../Store/Slices/CharacterResultSlice";
import { selectProfileLoaded } from "../../../Store/Slices/AuthSlice";

//const debug = process.env.NODE_ENV === "development";


function Navbar() {
  const character = useSelector(selectCharacter);
  const profileLoaded = useSelector(selectProfileLoaded);

  return (
    <div>
      <nav>
        <Link to="/">
          <img src={logo} alt="Saga Sage" className="logo" />
        </Link>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/character-list">Recently Generated</Link>
          </li>
          {profileLoaded ? (
            <li>
              <Link to="/my-characters">My Characters</Link>
            </li>
          ) : ( "" )}
          <li>
            <Link to="/generator">Character Generator</Link>
          </li>
          {character?.name ? (
            <li>
              <Link to="/results">Character Results</Link>
            </li>
          ) : ( "" )}
        </ul>
        <Auth />
      </nav>
    </div>
  );
}

export default Navbar;
