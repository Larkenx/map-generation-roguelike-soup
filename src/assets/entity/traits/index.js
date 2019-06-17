/* Glyph options
{
    character - character
    fg - foreground color
    bg - background color
    animation: - { frames: array of Glyphs, speed: animation speed }. only parent level glyph animations are considered

    // in the future, might have text affects
    activeEffect: rotate180, bounce up and down, small, large, skewed
}
*/
export class Glyph {
	constructor(options) {
		Object.assign(this, options)
		if (!this.fg) this.fg = '#ffffff'
		if (!this.bg) this.bg = 'transparent'
		this.fg = this.fg.replace('#', '0x').toString(16)
	}
}

export class Walkable {
	constructor(walkable) {
		this.walkable = walkable
	}
}

export class Health {
	constructor(hp, maxhp) {
		this.hp = hp
		this.maxhp = maxhp
	}
}
