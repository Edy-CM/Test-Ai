var showBtn = '<svg width="15" height="15" viewBox="0 0 59 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21.7873C3 21.7873 12.6436 2.5 29.52 2.5C46.3964 2.5 56.04 21.7873 56.04 21.7873" stroke="black" stroke-width="4.82182" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 21.7873C3 21.7873 12.6436 41.0745 29.52 41.0745C46.3964 41.0745 56.04 21.7873 56.04 21.7873" stroke="black" stroke-width="4.82182" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.52 29.02C33.5145 29.02 36.7527 25.7818 36.7527 21.7873C36.7527 17.7927 33.5145 14.5545 29.52 14.5545C25.5255 14.5545 22.2873 17.7927 22.2873 21.7873C22.2873 25.7818 25.5255 29.02 29.52 29.02Z" stroke="black" stroke-width="4.82182" stroke-linecap="round" stroke-linejoin="round"/></svg>'
var hideBtn = '<svg width="15" height="15" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3L56.04 56.04" stroke="black" stroke-width="5.304" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.4983 15.5243C7.41502 21.0211 3 29.52 3 29.52C3 29.52 12.6436 48.084 29.52 48.084C34.9574 48.084 39.6437 46.1571 43.499 43.5448M26.868 11.1104C27.731 11.0094 28.6151 10.956 29.52 10.956C46.3963 10.956 56.04 29.52 56.04 29.52C56.04 29.52 54.2053 33.0517 50.736 37.0344" stroke="black" stroke-width="5.304" stroke-linecap="round" stroke-linejoin="round"/><path d="M34.824 35.4504C33.4163 36.7101 31.5578 37.4763 29.52 37.4763C25.1259 37.4763 21.564 33.9144 21.564 29.5203C21.564 27.3358 22.4443 25.3572 23.8694 23.9194" stroke="black" stroke-width="5.304" stroke-linecap="round" stroke-linejoin="round"/></svg>'

$(document).ready(function() {
  var showPassword = $("#show-password");
  var showConfirmation = $("#show-confirmation");
  var signUpForm = $("#sign-up-form");
  var popUp = $("#pop-up");
  var errorMessage = $("#error-message");
  var closePopUp = $("#close-pop-up");

  signUpForm.submit(function(event){
    event.preventDefault();

    let password = $("#password");
    let confirmation = $("#confirmation");

    if (password.val() !== confirmation.val()) {
      errorMessage.show();
    } else {
      errorMessage.hide();
      this.submit();
    }
  })

  closePopUp.click(function(){
    errorMessage.hide();
  });

  showPassword.click(function(){
    let password = $("#password");
    if (password.attr("type") === "password") {
      password.attr("type", "text");
      showPassword.html(hideBtn);
    } else {
      password.attr("type", "password");
      showPassword.html(showBtn);
    }
  });
  
  showConfirmation.click(function() {
    let confirmation = $("#confirmation");
    if (confirmation.attr("type") === "password") {
      confirmation.attr("type", "text");
      showConfirmation.html(hideBtn);
      
    } else {
      confirmation.attr("type", "password");
      showConfirmation.html(showBtn);
    }
  });
  
  
})