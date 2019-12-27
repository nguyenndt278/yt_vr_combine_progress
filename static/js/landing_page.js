const left = document.querySelector('.left');
const right = document.querySelector('.right');
const container = document.querySelector('.container');

// --------------------
// MOUSE OVER LEFT SIDE
// --------------------

// Add class .hover-left to the .left class
if (left){
left.addEventListener('mouseenter', () => {
  container.classList.add('hover-left');
});}

// Remove class .hover-left from the .left class
if (left){
left.addEventListener('mouseleave', () => {
  container.classList.remove('hover-left');
});}

// ---------------------
// MOUSE OVER RIGHT SIDE
// ---------------------

// Add class .hover-right to the .right class
if (right){
right.addEventListener('mouseenter', () => {
  container.classList.add('hover-right');
});}

// Remove class .hover-right from the .right class
if (right){
right.addEventListener('mouseleave', () => {
  container.classList.remove('hover-right');
});}