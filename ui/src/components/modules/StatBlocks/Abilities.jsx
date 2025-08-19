import React from "react";
import PropTypes from "prop-types";
import abilityStyles from "./abilities.module.scss";
import {
  getAttacks,
  getSpells,
  getSpellLabel,
  hasSpells,
  hasFeats,
  getFeatLabel,
  getFeats
} from "../../../tools/utils.js";

function Abilities(props) {

    return <div >
        {props.stats ? (
        <div>
          <h3 className={abilityStyles.sectionHeader}>Attacks</h3>
          <h5 className={abilityStyles.highlights}>
            {getAttacks(props.stats, props.ruleset)}
          </h5>
        </div>
      ) : (
        ""
      )}

      {hasSpells(props.stats, props.ruleset) ? (
        <div>
          <h3 className={abilityStyles.sectionHeader}>{getSpellLabel(props.ruleset)}</h3>
          <h5 className={abilityStyles.highlights}>
            {getSpells(props.stats, props.ruleset)}
          </h5>
        </div>
      ) : (
        ""
      )}

    {hasFeats(props.stats, props.ruleset) ? (
        <div>
          <h3 className={abilityStyles.sectionHeader}>{getFeatLabel(props.ruleset)}</h3>
          <h5 className={abilityStyles.highlights}>
            {getFeats(props.stats, props.ruleset)}
          </h5>
        </div>
      ) : (
        ""
      )}
    </div>
}


Abilities.propTypes = {
    stats: PropTypes.object || PropTypes.array || PropTypes.string,
    ruleset: PropTypes.string.isRequired
};


export default Abilities;
