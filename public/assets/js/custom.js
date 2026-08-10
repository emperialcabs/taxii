/*------------------------------------- Onboarding Screen -------------------------------------*/
$(".skip_btn_1").click(function(){
  $("#first").removeClass("active");
  $(".first_slide").removeClass("active");  
  $("#second").addClass("active");
  $(".second_slide").addClass("active");
});

$(".skip_btn_2").click(function(){
 $("#second").removeClass("active");
 $(".second_slide").removeClass("active");
 $("#third").addClass("active");
 $(".third_slide").addClass("active");
});

$(".skip_btn_3").click(function(){
 $("#third").removeClass("active");
 $(".third_slide").removeClass("active");
 $("#fourth").addClass("active");
 $(".fourth_slide").addClass("active");
});

/*-------------------------------------Faq screen-------------------------------------*/
$(document).ready(function () {
  $('.nested-accordion').find('.comment').slideUp();
  $('.nested-accordion:first').find('.comment').slideDown();
  $('.nested-accordion:first').find('h3').addClass('selected').find('img').attr('src', '../svg/minus-icon.svg');
  $('.nested-accordion').find('h3').click(function () {
    $('.nested-accordion').find('.comment').not($(this).next('.comment')).slideUp();
    $('.nested-accordion').find('h3').not($(this)).removeClass('selected').find('img').attr('src', '../svg/plus-icon.svg');
    $(this).next('.comment').slideToggle(100);
    $(this).toggleClass('selected');
    $(this).find('img').attr('src', $(this).hasClass('selected') ? '../svg/minus-icon.svg' : '../svg/plus-icon.svg');
  });
});

/*-------------------------------------  Currency and language Checkbox -------------------------------------*/
var $radioButtons = $('#language-screen input[type="radio"],#currency-page input[type="radio"] ,.select-goal input[type="radio"], .change-courses-sec input[type="radio"]');
$radioButtons.click(function() {
  $radioButtons.each(function() {
    $(this).parent().toggleClass('language-sel', this.checked);
  });
});

/*-------------- Slider ------------------*/
$(".discount-bottom-sec, .categories-slider").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  swipeToSlide: true,
  infinite:true,
  variableWidth: true,
  autoplaySpeed: 2000,
  dots: false,
  arrows:false
});

/*------------------------------------- Invite friend -------------------------------------*/
$(document).ready(function() {
  $(".friend-select input").click(function() {
    var content = $(this);
    if (content.is(":checked")) {
      $(this).parent().addClass("active");
      $(this).parent().siblings().children(".custom-radio-sel-friend").addClass("active");
    }
    else {
      $(this).parent().siblings().children(".custom-radio-sel-friend").removeClass("active");
      $(this).parent().removeClass("active");
    }
    if ($(this).parent().hasClass('active')) { 

      $(this).parent().children(".custom-radio-sel-friend").text("Invite");
    } else {
      $(this).parent().children(".custom-radio-sel-friend").text("Invited")
    }
  });
});

/*-------------------------------------  Sticky Header-------------------------------------*/
$(window).scroll(function(){
  if ($(window).scrollTop() >= 20) {
    $('#top-header').addClass('fixed');
  }
  else {
    $('#top-header').removeClass('fixed');
  }
});

/*-------------------------------------OTP Section-------------------------------------*/
if(jQuery('#otp').length > 0)
  $('.digit-group').find('input').each(function() {
    $(this).attr('maxlength', 1);
    $(this).on('keyup', function(e) {
      var thisVal = $(this).val();
      var parent = $($(this).parent());
      if(e.keyCode === 8 || e.keyCode === 37) {
        var prev = parent.find('input#' + $(this).data('previous'));
        if(prev.length) {
          $(prev).select();
        }
      } else {
        var next = parent.find('input#' + $(this).data('next'));

        if(!$.isNumeric(thisVal))
        {
          $(this).val('');
          return false;
        }

        if(next.length) {
          $(next).select();
        } else {
          if(parent.data('autosubmit')) {
            parent.submit();
          }
        }
      }
    });
  });

/*------------------------------------- Preloader -------------------------------------*/
$(window).on("load" , function () {
  $('.loader-mask1').delay(5000).fadeOut(3000);
});
$(window).on("load" , function () {
  $('.loading-window').fadeOut();
  $('.loader-mask').delay(350).fadeOut('slow');
});

/*------------------------------------- Mode Changes-------------------------------------*/
jQuery('.theme-change').on('click',function(){
  jQuery('.site-content').toggleClass('theme-dark'); 
  if(jQuery('.site-content').hasClass('theme-dark')){ 
    location.replace("../dark-mode/splashscreen.html")
  }else{ 
    location.replace("../light-mode/splashscreen.html")
  }
});

/*------------------------------------- Payment -------------------------------------*/
// Add Text In Card
function updateLokiBox(lokiBoxId, inputField) {
  document.getElementById(lokiBoxId).innerText = inputField.value;
}

// Add Card Number 16 digit
function maskNumber() {
  let inputNumber = document.getElementById('cardNumber').value;
  let digitsOnly = inputNumber.replace(/\D/g, '');
  let maskedPart = digitsOnly.substring(0, 12).replace(/./g, '*');
  let lastPart = digitsOnly.substring(12);
  let maskedNumber = maskedPart.replace(/(.{4})/g, '$1 ').trim() + ' ' + lastPart;
  document.getElementById('lokiCardNumber').textContent = maskedNumber;
}

// Add CVV Number Only Three
function validateInputcvv(inputField) {
  inputField.value = inputField.value.replace(/\D/g, '');
  if (inputField.value.length > 3) {
    inputField.value = inputField.value.slice(0, 3);
  }
  document.getElementById('lokiCVV').textContent = inputField.value;
}

/*-------------------------------------Add class to make active -------------------------------------*/
$('.pay-btn').on('click', function() {
  $('.pay-btn').removeClass('active'); 
  $(this).toggleClass('active'); 
});

/*-------------------------------------Search faq section -------------------------------------*/
$(document).ready(function(){
  $("#search-input").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    var found = false;
    $(".nested-accordion").each(function() {
      var text = $(this).text().toLowerCase();
      var isVisible = text.indexOf(value) > -1;
      $(this).toggle(isVisible);
      if (isVisible) {
        found = true;
      }
    });
    if (!found) {
      $("#error-message").show();
    } else {
      $("#error-message").hide();
    }
  });
});

/*-------------------------------------Toggle method -------------------------------------*/
function toggleConnection(element) {
  let isConnected = element.innerText === 'Connected';
  isConnected = !isConnected;
  if (isConnected) {
    element.innerText = 'Connected';
    element.style.color = '#212B46';
    element.style.cursor = 'pointer'
  } else {
    element.innerText = 'Not Connected';
    element.style.color = '#212B46';
    element.style.cursor = 'pointer';
  }
}

/*-------------------------------------Range slider -------------------------------------*/
function rangeSlide(value) {
  document.getElementById('rangeValue').innerHTML = value;
}

/*-------------------------------------Platium screen faq-------------------------------------*/
$(document).ready(function () {
  $(".home_faq_accodian_title").click(function () {
    $(this)
    .toggleClass("active")
    .next(".home_faq_accodian_tab")
    .slideToggle()
    .parent()
    .siblings()
    .find(".home_faq_accodian_tab")
    .slideUp()
    .prev()
    .removeClass("active");
  });
});

/*-------------------------------------Read more content-------------------------------------*/
$(document).ready(function() {
  $('.moreless-button').click(function() {
    var $moretext = $(this).closest('.active-ride-sec').find('.moretext');
    $moretext.slideToggle();

    var $button = $(this).find('img');
    if ($button.attr('alt') === "Read More") {
      $button.attr('src', 'assets/images/map/read_less_image.svg');
      $button.attr('alt', 'Read Less');
    } else {
      $button.attr('src', 'assets/images/map/read_more_image.svg');
      $button.attr('alt', 'Read More');
    }
  });
});

/*-------------------------------------Update profile img-------------------------------------*/
$(document).ready(function () {
  var readURL = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('.profile-pic').attr('src', e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
  $(".file-upload").on('change', function () {
    readURL(this);
  });
  $(".upload-button").on('click', function () {
    $(".file-upload").click();
  });
});

/*-------------------------------------Add custom rating-------------------------------------*/
function toggleCustomAmountInput() {
  var inputContainer = document.getElementById("customAmountInputContainer");
  inputContainer.style.display = (inputContainer.style.display === "none" || inputContainer.style.display === "") ? "block" : "none";
}

/*-------------------------------------Anchore Tag Link Added-------------------------------------*/
$(".location-redirect").wrap('<a href="going1_screen.html"></a>');
$(".account-redirect").wrap('<a href="account-screen.html"></a>');
$(".platium-redirect").wrap('<a href="taxigo-platinum.html"></a>');
$(".current-redirect").wrap('<a href="going3_screen.html"></a>');
$(".going6-redirect").wrap('<a href="going6_screen.html"></a>');
$(".going2-redirect").wrap('<a href="going2_screen.html"></a>');
$(".going4-redirect").wrap('<a href="going4_screen.html"></a>');
$(".going5-redirect").wrap('<a href="going5_screen.html"></a>');










