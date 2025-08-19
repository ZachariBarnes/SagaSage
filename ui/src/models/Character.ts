export interface Character {
    name: string,
    description: string
    appearance: string,
    background: string,
    statBlock:
    {
        HP: number,
        AC: number,
        attributes:
        {
            STR: number,
            DEX: number,
            CON: number,
            INT: number,
            WIS: number,
            CHA: number
        }
        skills: [/*
        Current Format:
        { name: string, bonus: string }*/],
        saves: [/*
        Current Format:
        { name: string, bonus: string }*/]
        attacks: [
            {
                Name: string,
                Bonus: string,
                Damage: string,
                DamageType: string,
                Range: string,
                Effect: string
            }],
        spells: [
            {
                Name: string,
                SpellLevel: number,
                Effect: string,
                Range: string,
                Duration: string,
                Description: string,
                SaveDC: number,
                Damage: string,
            }]
    },
    loot: [string] | []
    personalItems: [string] | []
    shopInventory: [
        {
            Name: string,
            Description: string,
            Effect: string,
            Rarity: string,
            Price: string
        }] | [],
    shopName: string | '',
    portraitPrompt: string //Required for portrait generation
}