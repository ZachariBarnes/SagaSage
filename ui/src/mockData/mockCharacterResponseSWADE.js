export const mockCharacterResponse = {
  model: "silver",
  response: JSON.stringify({
    name: "Ezekiel 'Zeke' Blackwood",
    appearance:
      "A weathered, grizzled old man with a bushy white beard and deep-set wrinkles from years spent under the harsh sun. He wears a wide-brimmed hat, a worn leather duster, and boots covered in dust and dirt.",
    portraitPrompt:
      "A grizzled old prospector standing against the backdrop of a dusty ghostrock mine.",
    description:
      "Ezekiel 'Zeke' Blackwood is a veteran ghostrock prospector with a lifetime's worth of stories and scars. He has spent most of his life scouring the Weird West in search of the valuable mineral. Zeke is stubborn and persistent, never one to give up easily. Despite his rugged exterior, he possesses a kind and empathetic heart, always looking out for those who can't fend for themselves.",
    quirks: [
      "Has a lucky coin that he always carries with him, rubbing it for good luck before embarking on dangerous ventures.",
    ],
    goals: [
      "To strike it rich and retire in comfort, leaving behind a legacy for his family.",
      "Find a way to protect the people from the dangerous and unpredictable nature of ghostrock.",
    ],
    background:
      "Born and raised in a small town on the outskirts of the Great Maze, Zeke grew up with tales of lost mines and buried treasures. Intrigued by the allure of fortune, he set out on his own as a young man to seek his fortune as a ghostrock prospector. Over the years, Zeke faced countless dangers, fighting off bandits, strange creatures, and supernatural forces to ensure he could claim his rightful share of ghostrock. Along his journey, he encountered a Native American shaman who gifted him with a sacred talisman, believing Zeke was destined for a great purpose. This encounter fueled his desire to not only find wealth but also protect his fellow prospectors and innocent people from the unstable and dangerous nature of ghostrock.",
    stats: {
      maxWounds: "3",
      wealthFormatted: "70",
      naturalArmor: 0,
      rank: 3,
      rankName: "Veteran",
      abilities: [
        {
          hasPowerPointPool: true,
          hasMegaPowerOptions: true,
          name: "Miracles",
          powerPointsMax: 20,
          powerPointsCurrent: 20,
          arcaneSkill: "Faith",
          powers: [
            {
              name: "Detect/Conceal Arcana",
              powerPoints: "2",
              range: "Smarts",
              damage: "",
              duration: "5 (detect)/1 hour (conceal)",
              summary:
                "Detects magic for Duration 5 or conceals it for one hour.",
              description:
                "Detect arcana allows the recipient of the power to see and detect all supernatural persons, objects, or effects in sight for five rounds. This includes invisible foes, enchantments on people or items, weird science devices, and so on. With a raise, the caster knows the general type of enchantment as well — harmful, obscurement, magic, miracles, etc.Detect arcana also allows a character to ignore up to 4 points of penalties when attacking foes hidden by magical darkness, invisibility, or similar abilities (or all penalties with a raise).Conceal arcana prevents detection of arcane energies on one being or item of Normal Scale for one hour. Detect vs. Conceal: Detecting arcana against someone or something that’s been concealed is an opposed roll of arcane skills (roll each time it’s attempted, but no more than once per turn). If the concealment wins, the character cannot see through the ruse with this casting but may terminate this instance and try again.",
              rank: "novice",
              arcaneSkillName: "Faith",
              arcaneSkillRoll: "d10",
              powerModifiers: [
                "ADDITIONAL RECIPIENTS (+1): The power may affect more than one target for 1 additional Power Point each.",
                "AREA OF EFFECT (+1/+2): The power affects everything in a sphere the size of a Medium Blast Template for +1 points, or a Large Blast Template for +2.",
                "STRONG (+1): Conceal only. Detection rolls to see through the concealment are made at −2.",
              ],
              megaPowerOptions: [
                "EXALTED DETECT ARCANA (+2): Detect arcana is greatly enhanced, giving it expanded analytical effects. With a successful Arcane Skill check on a particular magical effect or supernatural entity or phenomena. See Text",
                "EXALTED CONCEAL ARCANA (+2): The recipient is −2 (or −4 with a raise) to be seen or found with detect arcana, divination, and other arcane abilities; may not be used in combination with the power’s Strong modifier.",
                "PRESENCE SENSE (+1): The caster is able to sense the presence and exact location of living beings within range like a radar; detect arcana activated with Presence Sense no longer requires line of sight to locate living beings.",
              ],
            },
          ],
        },
      ],
      advances: [
        {
          name: "Edge: Power Points",
          number: 1,
          description: "Edge: Power Points",
          effect: "Add 5 power points to maximum power points",
        },
        {
          name: "Edge: New Powers",
          number: 2,
          description: "Edge: New Powers",
          effect: "gain 2 new powers usable by your arcane background",
        },
        {
          name: "Raise Attribute: Spirit",
          number: 3,
          description: "Raise Attribute: Spirit",
          effect: "Raise Spirit Attribute by one die type",
        },
      ],
      advancesCount: 3,
      age: 60,
      armor: [
        {
          name: "(Unarmored)",
          weight: 0,
          quantity: 1,
          armor: 0,
          notes: "",
          cost: 0,
          equippedToughness: "4",
          equippedStrength: "d4",
          heavyArmor: false,
        },
      ],
      armorValue: 0,
      attributes: [
        {
          name: "agility",
          value: "d4",
        },
        {
          name: "smarts",
          value: "d8",
        },
        {
          name: "spirit",
          value: "d12",
        },
        {
          name: "strength",
          value: "d4",
        },
        {
          name: "vigor",
          value: "d4",
        },
      ],
      edges: [
        {
          note: "Selected",
          name: "Arcane Background (Miracles)",
          description:
            "Allows access to the Arcane Backgrounds listed in Chapter Five.",
        },
        {
          note: "Selected",
          name: "Arcane Resistance",
          description:
            "+2 to Trait rolls to resist magical effects; magical damage is reduced by 2.",
        },
        {
          name: "New Powers",
          note: "Selected",
          description:
            "Your character learns a new power. Wizards must have access to an Arcane Laboratory and Clerics must complete a quest.",
        },
        {
          name: "New Powers",
          description:
            "Your character learns a new power. Wizards must have access to an Arcane Laboratory and Clerics must complete a quest.",
          note: "Advance",
        },
        {
          name: "Power Points",
          description:
            "Gain 5 additional Power Points, no more than once per Rank.",
          note: "Advance",
        },
      ],
      gear: [
        {
          name: "Backpack",
          quantity: 1,
        },
        {
          name: "Bullet, Small",
          weight: 2,
          quantity: 100,
          notes: ".22 to .32 caliber",
          summary: ".22 to .32 caliber",
          cost: 0.002,
        },
      ],
      gender: "Male",
      heavyArmor: false,
      hindrances: [
        {
          name: "Arrogant (major)",
          description:
            "Likes to dominate his opponent, challenge the most powerful foe in combat.",
          note: "Selected",
          major: true,
        },
      ],
      parryTotal: 2,
      skills: [
        {
          name: "(Unskilled)",
          attribute: "",
          value: "d4-2",
          dieValue: 4,
          mod: -2,
        },
        {
          name: "Athletics",
          attribute: "agility",
          value: "d4",
          dieValue: 4,
          mod: 0,
        },
        {
          name: "Common Knowledge",
          attribute: "smarts",
          value: "d4",
          dieValue: 4,
          mod: 0,
        },
        {
          name: "Notice",
          attribute: "smarts",
          value: "d4",
          dieValue: 4,
          mod: 0,
        },
        {
          name: "Persuasion",
          attribute: "spirit",
          value: "d6",
          dieValue: 6,
          mod: 0,
        },
        {
          name: "Shooting",
          attribute: "agility",
          value: "d6",
          dieValue: 6,
          mod: 0,
        },
        {
          name: "Stealth",
          attribute: "agility",
          value: "d4",
          dieValue: 4,
          mod: 0,
        },
      ],
      toughnessTotal: 4,
      wealth: 70,
      weapons: [
        {
          name: "Derringer (.41)",
          weight: 1,
          range: "5/10/20",
          damage: "2d4",
          rof: 1,
          shots: 2,
          ap: 0,
          quantity: 1,
          cost: 100,
          profiles: [
            {
              skillName: "Shooting",
              skillValue: "d6",
            },
          ],
        },
        {
          name: "Glock (9mm)",
          weight: 3,
          range: "12/24/48",
          damage: "2d6",
          rof: 1,
          shots: 17,
          ap: 1,
          quantity: 1,
          cost: 200,
          profiles: [
            {
              skillName: "Shooting",
              skillValue: "d6",
            },
          ],
        },
      ],
      wildcard: true,
      woundsMax: 3,
    },
    loot: ["Sacred talisman blessed by a shaman"],
    personalItems: ["Lucky coin"],
  }),
  usage: {
    prompt_tokens: 3262,
    completion_tokens: 2442,
    total_tokens: 5704,
    cost: "0.03",
  },
  success: true,
  ruleset: "Savage Worlds",
};

export default mockCharacterResponse;