$(document).ready(function () {
  $("#login_form").submit(function (a) {
    console.log("validating form input");
    var b = !1,
      c = $("#username").val(),
      d = $("#password").val()
    if ($("#username,#email").click(function () {
      $(this).removeClass("error_input")
    }), 0 == c.length) {
      var b = !0;
      $("#username").addClass("error_input")
    } else $("#name").removeClass("error_input");
    if (0 == d.length) {
      var b = !0;
      $("#password").addClass("error_input")
    } else $("#password").removeClass("error_input");
    if (0 == b) {
      console.log('validation successful');
      return true;
    }
    return false;
  });
});
