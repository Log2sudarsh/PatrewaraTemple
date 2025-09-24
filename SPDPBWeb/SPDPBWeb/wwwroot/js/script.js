// script.js
$(function(){
  $.get('nav.html', function(data) {
    $('#nav-placeholder').html(data);
  });

    $.get('banner.html', function (data) {
        $('#banner-placeholder').html(data);
    });

    //$.get('carousel.html', function (data) {
    //    $('#carousel-placeholder').html(data);
    //});

    $.get('footer.html', function (data) {
        $('#footer-placeholder').html(data);
    });

});
