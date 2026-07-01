const menuArrow = document.getElementById('pop-up');
const dieBid = document.getElementById('die-bid');
const menuPopup = document.getElementById('menu');
const menuDice = document.querySelectorAll('[data-die]');
const minusButton = document.getElementById('minus');
const plusButton = document.getElementById('plus');
const numberBid = document.getElementById('display');

menuArrow.addEventListener('click', () => {
    menuPopup.classList.toggle('hidden');
});

menuDice.forEach((die) => {
    die.addEventListener('click', () => {
        const dieFace = die.innerHTML;
        const valueOfDieBid = die.dataset.die;
        dieBid.innerHTML = dieFace;
        dieBid.dataset.die = valueOfDieBid;
        menuPopup.classList.toggle('hidden');     
    });
});

minusButton.addEventListener('click', () => {
    let valueOfNumberBid = Number(numberBid.textContent);
    if (valueOfNumberBid === 1) {
        return
    }
    valueOfNumberBid--;
    numberBid.textContent = valueOfNumberBid;
})

plusButton.addEventListener('click', () => {
  let valueOfNumberBid = Number(numberBid.textContent);
  if (valueOfNumberBid === 20) {
    return
  }
  valueOfNumberBid++;
  numberBid.textContent = valueOfNumberBid;
})


const valueOfNumberBid = numberBid.textContent;
const valueOfDieBid = dieBid.dataset.die;