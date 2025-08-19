export const mockCharacterResponse = {
	"model": "gold",
	response: JSON.stringify({
		"name": "Lilith, the Soul Enthraller",
		"appearance": "Lilith is a hauntingly beautiful succubus, standing at 6 feet tall. Her skin is an ethereal pale, glowing softly under the dimmest light. She has long, lush black hair that falls in wild waves down to her lower back, often tangled with exotic blooms and vines. Her blood-red eyes serve as windows to her dangerous allure. A pair of ebony wings, reminiscent of a bat's, sprouts from her shoulders and a pointed tail swishes behind her. She is wearing a lavishly decorated skirt of dark fabrics and exotic jewelry.",
		"portraitPrompt": "Draw a 6-foot tall succubus with glowing pale skin and long black hair tangled with exotic flowers. Her stunning red eyes should create a sense of allure and danger. Large bat-like wings spread from her shoulders and a pointed tail can be noticed behind her. She wears a richly decorated skirt and various intricate jewels adorning her body.",
		"description": "Lilith, also known as the Soul Enthraller, is a notorious succubus known for her enchanting beauty and fatal charm. With a CR level of 12, she poses a formidable challenge for any adventuring group. She has an uncanny ability to blend in society, often disguising as a noble lady or a renowned bard. But, behind the stunning façade lurks a deadly predator thriving on the life force of others.",
		"quirks": ["Has a fondness for exotic flowers, often tries to incorporate them in her schemes."],
		"goals": ["To seduce and drain the life force of the most powerful beings in the realm, thereby increasing her own strength and influence."],
		"background": "Born in the deepest corners of the Abyss, Lilith was drawn towards the mortal plane. She was intrigued by its beauty and the powerful creatures that inhabit it. Building her power through countless encounters, she rose among the ranks of the underworld. Her own charm and strategic cunning have been her strongest weapons, often turning her would-be slayers into unknowing victims.",
		"stats": {
			hp: "195",
			ac: "17",
			classes: [{
				name: "Warlock",
				level: "12"
			}],
			attributes: {
				STR: "9",
				DEX: "20",
				CON: "15",
				INT: "15",
				WIS: "14",
				CHA: "25"
			},
			skills: [{
				name: "Persuasion",
				bonus: "+13"
			}],
			attacks: [{
				name: "Claws",
				bonus: "+9",
				damage: "2d6 + 5",
				damageType: "slashing",
				range: "5 ft",
				effect: "If the target is a humanoid, it must succeed on a DC 18 Constitution saving throw or have its hit point maximum reduced by an amount equal to the damage taken."
			}],
			abilities: [{
				name: "Charm",
				effect: "Lilith targets one humanoid she can see within 30 feet of her. If the target can see Lilith, it must succeed on a DC 18 Wisdom saving throw against this magic or be charmed. The charmed target regards Lilith as a trusted friend to be heeded and protected."
			}],
			spells: [{
				name: "Hellfire Blast",
				spellLevel: "5",
				effect: "Magic infused attack",
				range: "120 ft",
				duration: "Instantaneous",
				description: "Lilith releases a hellfire blast, targeting up to three creatures she can see within range. Each target must make a DC 18 Dexterity saving throw, taking 10d6 fire damage on a failed save, or half as much damage on a successful one.",
				saveDC: "18",
				damage: "10d6",
				damageType: "fire"
			}],
			saves: [{
				name: "Wisdom",
				bonus: "+10",
			}]
		},
		"loot": [
			"Soul Amulet  - An amulet that Lilith uses to store the life force of her victims. It's said to boost the life force of its owner."
		],
		"personalItems": [
			"Abyssal Flower Crown  - A crown made from the most beautiful flowers from the Abyss. It is part of Lilith's unique fashion sense."
		]
	}),
	"usage": {
		"prompt_tokens": 622,
		"completion_tokens": 1023,
		"total_tokens": 1645,
		"cost": "0.12"
	},
	"success": true,
	"ruleset": "Dungeons & Dragons 5th Edition"
};

export default mockCharacterResponse;