// Miscellaneous
import Chest from 'src/assets/entities/misc/Chest.js'
import Door from 'src/assets/entities/misc/Door.js'
import LevelTransition from 'src/assets/entities/misc/LevelTransition.js'
import Ladder from 'src/assets/entities/misc/Ladder.js'
// Entities
import NPC from 'src/assets/entities/actors/NPC.js'
import { LootGoblin } from 'src/assets/entities/actors/enemies/GoalBasedEnemy.js'
// Utils
import { getRandomInt, getNormalRandomInt, randomProperty, getWeightedValue } from 'src/assets/utils/HelperFunctions.js'
import { StatelessAI } from 'src/assets/entities/actors/enemies/StatelessAI'

const entityShop = {
	NPC: (x, y, t) => new NPC(x, y, t),
	LEVEL_TRANSITION: (x, y, t) => new LevelTransition(x, y, t),
	CHEST: (x, y, t) => new Chest(x, y, t),
	DOOR: (x, y, t) => new Door(x, y, t),
	LOCKED_DOOR: (x, y, t) => new LockedDoor(x, y, t),
	LADDER: (x, y, t) => new Ladder(x, y, t),
	LOOT_GOBLIN: (x, y, t) => new LootGoblin(x, y, t)
}

// entityData.forEach(entity => {
// 	let { id, hp, mana, maxhp, maxmana, str, def, range, morale, wanders, description, name } = entity
// 	entityShop[id] = (x, y, t) => {
// 		return new StatelessAI(x, y, {
// 			id: t,
// 			name,
// 			description,
// 			wanders,
// 			cb: {
// 				hp,
// 				maxhp,
// 				mana,
// 				maxmana,
// 				str,
// 				def,
// 				range,
// 				morale,
// 				invulnerable: false,
// 				hostile: true
// 			}
// 		})
// 	}
// })

const itemShop = {
	GOLD: (x, y, t, options) => new Gold(x, y, t, options.quantity ? options.quantity : 1),
	BEER: (x, y, t) => new Beer(x, y, t),
	HEALTH_POTION: (x, y, t) => new HealthPotion(x, y, t),
	STRENGTH_POTION: (x, y, t) => new StrengthPotion(x, y, t),
	MANA_POTION: (x, y, t) => new ManaPotion(x, y, t),
	SWORD: (x, y, t, options) => createSword(x, y, t, options),
	BATTLEAXE: (x, y, t, options) => createBattleaxe(x, y, t, options),
	HELMET: (x, y, t, options) => createHelmet(x, y, t, options),
	CHEST_ARMOR: (x, y, t, options) => createChestArmor(x, y, t, options),
	LEG_ARMOR: (x, y, t, options) => createLegArmor(x, y, t, options),
	BOOTS: (x, y, t, options) => createBoots(x, y, t, options),
	BOW: (x, y, t) => createBow(x, y, t),
	STEEL_ARROW: (x, y, t) => new SteelArrow(x, y, t, 5),
	KEY: (x, y, t) => new Key(x, y, t),
	NECROMANCY_SPELLBOOK: (x, y, t) => new NecromancySpellBook(x, y, t)
}

export function createItem(itemString, x, y, id, options = {}) {
	const defaultItemTextures = {
		GOLD: 1388,
		BEER: 1190,
		KEY: 24,
		HEALTH_POTION: 488,
		MANA_POTION: 608,
		STRENGTH_POTION: 969,
		SWORD: 35,
		BOW: 664,
		STEEL_ARROW: 784,
		NECROMANCY_SPELLBOOK: 3264,
		BATTLEAXE: 153
	}

	const texture = id == null ? defaultItemTextures[itemString] : id

	if (itemString.includes('SWORD')) {
		return itemShop['SWORD'](x, y, texture, options)
	} else if (itemString.includes('BATTLEAXE')) {
		return itemShop['BATTLEAXE'](x, y, texture, options)
	} else if (itemString.includes('CHEST_ARMOR')) {
		return itemShop['CHEST_ARMOR'](x, y, texture, options)
	} else if (itemString.includes('LEG_ARMOR')) {
		return itemShop['LEG_ARMOR'](x, y, texture, options)
	} else if (itemString.includes('HELMET')) {
		return itemShop['HELMET'](x, y, texture, options)
	} else if (itemString.includes('BOOTS')) {
		return itemShop['BOOTS'](x, y, texture, options)
	}

	if (!(itemString in itemShop)) {
		console.error(`Tried to create an item without an entry: ${itemString} with ID: ${id}`)
		return null
	}

	return itemShop[itemString](x, y, texture, options)
}

export function getItemsFromDropTable(options) {
	let { dropTable, minItems, maxItems, x, y } = options
	let items = []
	let roll = getRandomInt(minItems, maxItems)
	for (let i = 0; i < roll; i++) {
		let chosenItem = getWeightedValue(dropTable)
		items.push(createItem(chosenItem, x, y, null, dropTable[chosenItem].options))
	}
	return items
}

export function createActor(actorString, x, y, id = null) {
	let texture = id
	if (id === null) {
		let possibleActorTextures = actorTextures[actorString]
		texture = possibleActorTextures[getRandomInt(0, possibleActorTextures.length - 1)]
	}
	if (!(actorString in entityShop)) {
		console.error(`Tried to create entity without an entry: ${actorString} with ID: ${id}`)
		return null
	}
	return entityShop[actorString](x, y, texture)
}
