$(document).ready(function() {
  var menu = document.getElementsByClassName("nav__list");
  var burger = document.getElementsByClassName("burger");
  var doc = $(document);
  var panel = $(".panel");
  var openMenu = function() {
    burger[0].classList.toggle("burger--active");
    menu[0].classList.toggle("nav__list--active");
  };

  // reveal content of first panel by default
  panel
    .eq(0)
    .find(".panel__content")
    .addClass("panel__content--active");

  burger[0].addEventListener("click", openMenu, false);
});
