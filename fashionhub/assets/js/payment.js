$(document).ready(function () {
    //console.log('Hiding the spinner...');
    $('.status-container').hide();
  });
  
  $('#paymentBtn').click(() => {
    //console.log('Clicked!');
    //event.preventDefault();
    $('.status-container').show(500);
  
  });
  