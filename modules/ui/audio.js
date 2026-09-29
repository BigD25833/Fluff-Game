const audio = {
    click: new Audio('../../audio/click5.ogg'),
    typeWriter: new Audio('../../audio/type.ogg'),
    rollDice: new Audio('../../audio/roll.ogg'),
    glow: new Audio('../../audio/glow.ogg')
}

audio.click.volume = 0.2;
audio.rollDice.volume = 0.1;
audio.typeWriter.volume = 0.1;

export {audio}