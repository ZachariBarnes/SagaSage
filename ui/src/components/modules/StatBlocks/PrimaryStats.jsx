import React from "react";
import PropTypes from "prop-types";
import StatblockStyles from "./primaryStats.module.scss";
import {
    getAttributes,
    getSkills,
    getSaves,
    getClasses,
    getPirmaryStats
} from "../../../tools/utils.js";

function PrimaryStats(props) {

    return <div >
        <div className={StatblockStyles.section2a} >
            {getPirmaryStats(props.character.stats, props.ruleset, StatblockStyles.section2ab)}
            <div className={StatblockStyles.section2ab}>
                <b>{getClasses(props.character.stats, props.ruleset)}</b>
            </div>


        </div>
        <div className={StatblockStyles.section2b}>
            <h5 className={StatblockStyles.highlights}>
                -Attributes-
                <br />
                {getAttributes(props.character.stats, props.ruleset)}
            </h5>
            { props.character.stats["saves"] ?
                <h5 className={StatblockStyles.highlights}>
                    -Saves-
                    <br />
                    {getSaves(props.character.stats)}
                </h5>
                : ''
            }
            <h5 className={StatblockStyles.highlights}>
            -Skills-
                <br />
                {getSkills(props.character.stats)}
            </h5>
        </div>
    </div>
}


PrimaryStats.propTypes = {
    character: PropTypes.object.isRequired,
    ruleset: PropTypes.string.isRequired
};


export default PrimaryStats;
