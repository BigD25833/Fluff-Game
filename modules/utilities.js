function bidFactory(number, value, player) {
    return {
        number: number,
        value: value,
        player: player
    }
}

function getRandomArrayItem(array) {
    return array[getRandomNumber(array.length)];
}

function getRandomNumber(num) {
    return Math.floor(Math.random() * num);
}

function getWeightedBehavior(behaviors) {
    const total = behaviors.reduce((acc, curr) => acc + curr.weight, 0);
    let random = Math.random() * total;
    for (const obj of behaviors) {
        if (random < obj.weight) {
            return obj.value
        }
        random -= obj.weight;
    }
}


export {bidFactory, getRandomNumber, getRandomArrayItem, getWeightedBehavior}