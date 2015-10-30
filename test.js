function passVar(obj1, obj2, num) {
        obj1.prop = "laptop"; // will CHANGE original
        obj2 = { prop: "computer" }; //will NOT affect original
        num = num + 1; // will NOT affect original
    }

    var object1 = {
        prop: "car"
    };
    var object2 = {
        prop: "bike"
    };
	
   	var number1 = 10;

    passVar(object1, object2, number1);
    console.log(object1); //output: Object {item:"laptop"}
    console.log(object2); //output: Object {item:"bike"}
    console.log(number1); //ouput: 10