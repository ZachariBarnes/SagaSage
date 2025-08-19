import React from 'react';
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import "./Features.css";
import AdComponent from '../Ads/AdComponent';

function Features() {

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  return (
    <section className="section">
      <h2 className="section-title">Capabilities</h2>
      <div className="capabilities">
        <ul>
          <li>
            <b>Content generation</b>
            <br />
            We strive to take some of the leg work out of being a DM and put
            high quality content generation at your fingertips.
          </li>
          <br />
          <li>
            <b>Easy to use</b>
            <br /> We want to make it quick and easy for you to get the content
            you need, when you need it, even if you're mid-game.
          </li>
          <br />
          <li>
            <b>Customizable</b>
            <br /> Generate content to your exacting specifications while still
            being able to quickly generate content on the fly.
          </li>
          <br />
          <li>
            <b>Built for your Game</b>
            <br />
            Generate content for your favorite tabletop RPG systems, including
            D&D5e with many more to come.
          </li>
          {/* <li>Free to use (with premium options available)</li> */}
        </ul>
      </div>
      <AdComponent dataAdSlot="2487494121" />
      <HtmlTooltip
        title={
          <React.Fragment>
            {/* <Typography color="inherit">Tooltip with HTML</Typography> */}
            <b className="complete">Green</b> Features are already available.
            <br />
            <b className="in-progress">Yellow</b> features are in development.
            <br />
            <b>Remaining </b> Items are future features
          </React.Fragment>
        }
      >
        <h2 className="section-title">Planned Features</h2>
      </HtmlTooltip>
      <ul className="feature-list">
        <li>
          <HtmlTooltip
            title={
              <React.Fragment>
                <i className="complete">
                  Create characters with a variety of options and
                  customizations.
                </i>
              </React.Fragment>
            }
          >
            <b className="complete">Character Creator</b>
          </HtmlTooltip>
        </li>
        <li>
          <HtmlTooltip
            title={
              <React.Fragment>
                <i className="complete">
                  Generate portraits of your characters
                </i>
              </React.Fragment>
            }
          >
            <b className="complete">Portrait Painter</b>
          </HtmlTooltip>
        </li>
        <li>
          {" "}
          <HtmlTooltip
            title={
              <React.Fragment>
                Craft your worlds with the help of Saga Sage's AI.
              </React.Fragment>
            }
          >
            <b className="x">World Maker</b>
          </HtmlTooltip>
        </li>
        <li>
          {" "}
          <HtmlTooltip
            title={
              <React.Fragment>
                Create compelling quests for your players to embark on.
              </React.Fragment>
            }
          >
            <b className="x">Quest Crafter</b>
          </HtmlTooltip>
        </li>
        <li>
          {" "}
          <HtmlTooltip
            title={
              <React.Fragment>
                design factions and organizations with deep ties to your world
                and unique motivations for your players to interact with.
              </React.Fragment>
            }
          >
            <b className="x">Faction Fabricator</b>
          </HtmlTooltip>
        </li>
        <li>
          {" "}
          <HtmlTooltip
            title={
              <React.Fragment>
                Generate maps for your world, dungeons, and more both as images
                and as grids for use in Virtual tabletops.
              </React.Fragment>
            }
          >
            <b className="x">Map Generator</b>
          </HtmlTooltip>
        </li>
        <li>
          {" "}
          <HtmlTooltip
            title={
              <React.Fragment>
                Generate complex dungeons with puzzels and traps for your
                players to explore and loot
              </React.Fragment>
            }
          >
            <b className="x">Dungeon Spawner</b>
          </HtmlTooltip>
        </li>
        <li>
          {" "}
          <HtmlTooltip
            title={
              <React.Fragment>
                Design new items with unique effects for your players to find
                and enjoy
              </React.Fragment>
            }
          >
            <b className="x">Artificer</b>
          </HtmlTooltip>
        </li>
        <li>
          <HtmlTooltip
            title={
              <React.Fragment>
                <b className="complete">
                  Save your generated content to your account and easily
                  refrence it in future generations to seemlessly integrate your
                  content into your world.
                </b>
              </React.Fragment>
            }
          >
            <b className="complete">Save your creations</b>
          </HtmlTooltip>
        </li>
        <li>
          {" "}
          <HtmlTooltip
            title={
              <React.Fragment>
                Export your characters as tokens and your dungeons as Maps for
                use in your choice of Virtual (or physical) tabletops.
              </React.Fragment>
            }
          >
            <b className="x">Export</b>
          </HtmlTooltip>
        </li>
      </ul>
      And more to come!
    </section>
  );
}

export default Features;