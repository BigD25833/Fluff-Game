function bidFactory(number, value, player) {
    return {
        number: number,
        value: value,
        player: player
    }
}

function getRandomNumber(num) {
    return Math.floor(Math.random() * num);
}

export {bidFactory, getRandomNumber}