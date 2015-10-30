$(document).ready(function(){
  $("#btnLogin").click(function(){
    var user = $("#userName").val();
    var pass = $("#passWord").val();
    var host = "http://" + window.location.hostname +":"+location.port; 
    $.post(host + "/login",{userName:user,passWord:pass},function(data){
      if (data){
        window.location.href = host ;
      }
      else {
        $(".feedback").show().animate({"opacity":"1", "bottom":"-80px"}, 400);  
        $("#userName").val("");
        $("#passWord").val("");
      }
    });
  });
  
  $( ".input" ).focusin(function() {
    $( this ).find( "span" ).animate({"opacity":"0"}, 200);
  });
  
  $( ".input" ).focusout(function() {
    $( this ).find( "span" ).animate({"opacity":"1"}, 300);
  });
  
  $(".login").submit(function(){
    $(this).find(".submit i").removeAttr('class').addClass("fa fa-check").css({"color":"#fff"});
    $(".submit").css({"background":"#2ecc71", "border-color":"#2ecc71"});
    $("input").css({"border-color":"#2ecc71"});
  });
});

