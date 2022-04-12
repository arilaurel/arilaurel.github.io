(function() {
  setTimeout(function() {
    window.scrollTo(0, 0);
    const writings = document.querySelector('#writings');
    writings.classList.add('show');
    window.scroll(0, 0);
    writings.classList.add('slideIn');
  }, 300);
})();
