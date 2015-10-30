var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var sqlite3 = require("sqlite3").verbose();
var algorithm = require("./algorithm_1.js")
var fs = require("fs");

var app = express();
var sess;

var file= __dirname + "/DBIN.db";
var db=new sqlite3.Database(file);
var exists=fs.existsSync(file);

app.set("view engine","ejs");

//using middleware
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: true}));
app.use(bodyParser.urlencoded({ extended: false }))

//using resource file 
app.use("/style",express.static(__dirname+"/style"));
app.use("/effect",express.static(__dirname+"/effect"));

//Create databse 
if (!exists){
	db.serialize(function(){
		var queryCreateTable = "CREATE TABLE ListDBIN ("
							+ " ID VARCHAR(10) PRIMARY KEY NOT NULL,"
							+ " DESCRIPTION NTEXT NOT NULL,"
							+ " STATE INT," 
							+ " FLOOR INT " + ")";
		db.run(queryCreateTable);	
		
		var stmt = db.prepare("INSERT INTO ListDBIN VALUES(?,?,?,?)");
		for (var i = 1 ; i <= 20; i++){
			stmt.run(i.toString(),"This is a DBIN", 50, i) ;
		}
		stmt.finalize();	
	});
}  


//Hander for login page
app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",function(req,res){
	var userName = req.body.userName;
	var passWord = req.body.passWord;
	sess=req.session;
	
	if (userName =="14CNTN_DBIN" && passWord == "qwerty/.,"){
		sess.userName = userName;
		sess.passWord = passWord;

		res.send(true);
	} else{
		res.send(false);
	}
});

//Hander for admin page

function authentication(req,res){
	sess = req.session;
	
	if (sess.userName == null) return false;
	
	var userName = sess.userName.toString();
	var passWord = sess.passWord.toString();
	
	if (userName == "14CNTN_DBIN" && passWord == "qwerty/.," ){
		return true;
	}else {
		return false;
	}
}

function getDataDBIN(req,res){
	var ID_ = req.body.ID;
	var DESCRIPTION_ = req.body.DESCRIPTION;
	var FLOOR_ = req.body.FLOOR;
	
	var obj = {ID: ID_, DESCRIPTION: DESCRIPTION_, FLOOR:FLOOR_};
	return obj;
}


app.get("/",function(req,res){
	
	if (authentication(req,res)){
		db.all("SELECT * FROM ListDBIN", function(err,rows) {
			if (!err){
				res.render("admin", { rows : rows});
			}
		});
		
	}else {
		res.redirect("/login");
	}
});

app.post("/",function(req,res){
	var obj = getDataDBIN(req,res);
	var stmt = db.prepare("INSERT INTO ListDBIN VALUES(?,?,?,?)");
	stmt.run(obj.ID,obj.DESCRIPTION,0,obj.FLOOR,function(err){
		if (!err){
			console.log("OK");
			stmt.finalize();
			res.send(true);
		}
		else{
			console.log("False");
			res.send(false);
		}
	});
});

app.get("/updateDBIN/:id",function(req,res){
	if (authentication(req,res)){
		var query = "SELECT * FROM ListDBIN WHERE ID = '" + req.params.id.toString() + "'";
		db.all(query, function(err,rows){
			var row = rows[0];
			res.render("updateDBIN",{row: row});
		}); 
	}
	else {
		res.redirect("/login");
	}
});

app.post("/updateDBIN",function(req,res){
	var obj = getDataDBIN(req,res);
	var query = "UPDATE ListDBIN SET DESCRIPTION = '" + obj.DESCRIPTION + "', FLOOR = " +obj.FLOOR + " WHERE ID = '" + obj.ID + "'";
	db.run(query, function(err){
		if (!err){
			res.send(true);
		}
		else {
			res.send(false)
		}
		
	});
});

app.get("/deleteDBIN/:id",function(req,res){
	if (authentication(req,res)){
		var query = "DELETE FROM ListDBIN WHERE ID = '" + req.params.id.toString() +"'";
		db.run(query, function(err){
			if (!err){
				console.log("DELETE thanh cong");
			}
			else {
				console.log("DELETE that bai ");
			}
		});
		res.redirect("/");
	}
	else {
		res.redirect("/login");
	}
});

//Hander for api
app.get("/api/:id/:state", function(req,res){
	var id = req.params.id;
	var state = req.params.state;
	
	var query = "UPDATE ListDBIN SET STATE = " + state.toString() + " WHERE ID = '" + id.toString() + "'";
	
	db.run(query, function(err){
		if (!err){
			console.log("UPDATE thanh cong");
		}
		else {
			console.log("UPDATE that bai ");
		}
		
	});
});

app.get("/checkRoute/:first_floor/:end_floor",function(req,res){
	var first_floor = req.params.first_floor;
	var end_floor = req.params.end_floor;
	
	db.all("SELECT * FROM ListDBIN", function(err,rows) {
		var kq_check = 0;
		rows.forEach(function(row){
			if (row.STATE >= 80 && row.FLOOR >= first_floor && row.FLOOR <= end_floor){
				kq_check = 1;
			}
		}); 
		res.json(kq_check);	
	});	
});

app.get("/sendData/:first_floor/:end_floor/:weight",function(req,res){
	var first_floor = req.params.first_floor;
	var end_floor = req.params.end_floor;
	var weight = req.params.weight;
	
	db.all("SELECT * FROM ListDBIN", function(err,rows) {
		if (!err){
			var result = algorithm.process(rows, first_floor, end_floor, weight);
			res.json(result);
		}else{
			res.json("Error");	
		} 
	});
	
});

app.listen(8080);



console.log("vao port 8080");