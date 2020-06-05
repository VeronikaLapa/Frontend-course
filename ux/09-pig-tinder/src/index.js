(function() {
  let currentId = 0;
  const CARDS_AMOUNT = document.getElementsByClassName('card').length;
  const cards = [];
  for (let i = 1; i <= CARDS_AMOUNT; ++i) {
    cards.push(document.getElementById(`card-${i}`));
  }
  const superButton = document.getElementById('super-like');
  const dislikeButton = document.getElementById('dislike');
  const likeButton = document.getElementById('like');
  dislikeButton.addEventListener('click', swipeToLeft);
  superButton.addEventListener('click', swipeToUp);
  likeButton.addEventListener('click', swipeToRight);

  function swipeToLeft() {
    swipe('left');
  }
  function swipeToRight() {
    swipe('right');
  }
  function swipeToUp() {
    swipe('up');
  }
  function swipe(direction) {
    const nextId = (currentId + 1) % CARDS_AMOUNT;
    const animationName = `card__swipe-${direction}-animation`;
    cards[currentId].classList.add(animationName);
    setTimeout(function animation() {
      cards[currentId].classList.remove(animationName);
      cards[currentId].style.display = 'none';
      cards[nextId].style.display = 'block';
      currentId = nextId;
    }, 1000);
    //
  }
})();
