// var product1 = document.getElementById('product1');
// if(product1){
// product1.addEventListener('click', function() {
//   product1.classList.toggle('product--expanded');
// });}

// var close = document.getElementById('close');
// if(close){
// close.addEventListener('click', function(product1) {
//   product1.classList.remove('product--expanded');
// });}

// Hide all elements with class="containerTab", except for the one that matches the clickable grid column
function openTab(tabName) {
    var i, x;
    x = document.getElementsByClassName("containerTab");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
  }