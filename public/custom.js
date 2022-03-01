$(document).ready(function () {
  onResize();
  $(window).on("resize", function () {
    onResize();
  });

  function onResize() {
    const width = $(window).width();
    if (width >= 768) {
      $(".mobile-footer").removeClass("d-none");
    } else {
      $(".mobile-footer").addClass("d-none");
    }
  }
});
