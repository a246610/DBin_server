var express = require("express");

var app = express();

var obj = {
	name : "Nguyen",
	age : 19
}

app.get("/api", function(req,res){
	var rnd = Math.floor((Math.random() * 100) + 1);
	res.json(rnd);
});

var arr = [97,85,78,32,99];
arr.quicksort(arr);
console.log(arr);

app.listen(8080);