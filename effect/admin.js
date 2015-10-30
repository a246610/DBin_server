$(document).ready(function(){
  
  $("#btnUpdate").click(function(){
      var ID_ = $("#ID").val();
      var DESCRIPTION_ = $("#DESCRIPTION").val();
      var FLOOR_ = $("#FLOOR").val();
      
      var host = "http://" + window.location.hostname +":"+location.port; 
      $.post(host + "/updateDBIN",{ID:ID_,DESCRIPTION:DESCRIPTION_,FLOOR:FLOOR_},function(data){
        if (data){
          if (confirm("Update success, return admin page ?")==true)  
              window.location.href=host;
        }
        else {
          alert("Update fail, try again");  
        }
      });
  });
  
  $("#btnCreate").click(function(){
      var ID_ = $("#ID").val();
      var DESCRIPTION_ = $("#DESCRIPTION").val();
      var FLOOR_ = $("#FLOOR").val();
      
      var host = "http://" + window.location.hostname +":"+location.port; 
      $.post(host + "/",{ID:ID_,DESCRIPTION:DESCRIPTION_,FLOOR:FLOOR_},function(data){
         if (data){
            if (confirm("Create success, refresh admin page?")==true)  
              window.location.href=host;
          }
          else {
            alert("Create fail, try again");  
          }
         
      });
  });
});
	  