const mainPlayer = document.querySelector('#main-player-comm');
const player3 = document.querySelector('[data-bids="player-3"]')

const next = document.getElementById('next');
next.addEventListener('click', () => {
    const newBid = document.createElement('div');
    newBid.className = 'die';
    newBid.innerHTML = `${Math.floor(Math.random() * 4)}<i class="fa-solid fa-dice-six" style="color: rgb(188, 43, 7);"></i>`;
    mainPlayer.appendChild(newBid);
    setTimeout(() => {
        const parentHeight = mainPlayer.clientHeight;
        const childHeight = newBid.offsetHeight;
        const offset = newBid.offsetTop;
        const scrollTarget = offset - (parentHeight / 2) + (childHeight / 2 );
        mainPlayer.scrollTo({top: scrollTarget, behavior: 'smooth'});
    }, 2000)
})

const parentRect = mainPlayer.getBoundingClientRect();
const height = parentRect.height;
console.log(height);






    






