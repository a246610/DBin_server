function Qsort(arr, l , h ){
	
	var i,j;
	var x,tmp;
	
	i = l;
	j = h;
	x = arr[((l + h) / 2) | 0];
	do{
		while (arr[i].id < x.id) i = i + 1;
		while (arr[j].id > x.id)	j = j - 1;
		if (i <= j ){
			tmp = arr[i];
			arr[i] = arr[j];
			arr[j] = tmp;
			i = i + 1;
			j = j - 1;
		} 
	} while (i <= j);
	if (l < j ) Qsort(arr, l , j );
	if (i < h ) Qsort(arr, i , h);
}

function enter(ds, soThung, tab1, floor_first, floor_end){
	var W_PER_V =0.05;
	
	ds.forEach(function(bin){
		bin.w = bin.STATE * W_PER_V; //~~~> Tinh toan khoi luong rac dang chua trong moi thung
		soThung.len = soThung.len + 1;
		if (bin.FLOOR >= floor_first && bin.FLOOR <= floor_end)
		{
			var temp = {id : bin.FLOOR, desc : bin.DESCRIPTION, state : bin.STATE};
			tab1.push(temp);
		}
	});
	Qsort(tab1, 0, tab1.length - 1);
}

function init(ds, thuGom, soThung, soThungThu, floor_first, floor_end){
	
	var kt = []; 
	
	for (var i = 0; i <= soThung.len; i++) {
		kt[i] = false;
	}
	
	var tmp_ = { id : -1, w : -1};
	thuGom.push(tmp_);
	
	//Duyet toan bo danh sach thung rac, tat ca cac thung co the tich rac >= 80% va nam trong doan user dang quan ly 
	ds.forEach(function(bin){	
		//Neu tang nay chua co thung rac nao duoc thu thi day vao thung rac moi  
		if (bin.STATE >= 80 && kt[bin.FLOOR] == false && bin.FLOOR >= floor_first && bin.FLOOR <= floor_end ){
			soThungThu.len++; 
			var tmp = {id : bin.FLOOR, w : bin.w};
			thuGom.push(tmp);
			kt[bin.FLOOR] = true;
		}
		else {
			//Neu tang nay da co thung rac duoc thu thi cong don khoi luong rac can thi vao tang nay
			if (bin.STATE >= 80 && bin.FLOOR >= floor_first && bin.FLOOR <= floor_end )
				for	(var i = 1; i <= soThungThu.len; i++){
					if (thuGom[i].id == bin.FLOOR){
						thuGom[i].w += bin.w;
						break; 
					}
				}
		}
	});
	
	if (soThungThu.len == 0) return soThungThu.len;
	var tmp_cs = soThungThu.len;
	Qsort(thuGom, 1, soThungThu.len); //Sap xep lai danh sach cac tang thu rac tu thap den cao
	
	//Tren duong di, nhung tang nao co thung rac >= 60% thi thu luon mot lan
	for(var i = 1; i < tmp_cs; i++)
		ds.forEach(function(bin){
			if (bin.STATE >= 60 && bin.STATE < 80 && bin.FLOOR >= thuGom[i].id && bin.FLOOR <= thuGom[i+1].id 
			&& bin.FLOOR >= floor_first && bin.FLOOR <= floor_end){
				if (kt[bin.FLOOR] == false){
					soThungThu.len++;
					var tmp = {id : bin.FLOOR, w : bin.w};
					thuGom.push(tmp);
					kt[bin.FLOOR] = true;
				} 	
				else 
					for (var k = 1; k <= soThungThu.len; k++)
						if (thuGom[k].id == bin.FLOOR )
							thuGom[k].w += bin.w;
			}
		});
	//Sap xep lai mot lan nua danh sach cac thung thu tu thap den cao
	Qsort(thuGom,1,soThungThu.len);
	return soThungThu;
}

//CACH THU 1: Di thu rac cho toi khi nao het kha nang chua thi quay lai
function find1(soThungThu,thuGom, MAX_WEIGHT){
	var cs = 1;
	var kq = 0;
	
	while (cs <= soThungThu.len){
		var temp = 0.0;
		while (temp < MAX_WEIGHT && cs <= soThungThu.len){
			temp += thuGom[cs].w;
			cs++;
		}
		var v = Math.ceil(thuGom[cs - 1].w / MAX_WEIGHT);
		kq += 2 * v * thuGom[cs - 1].id;
		var temp_div = v - 1;
		if (temp - temp_div * MAX_WEIGHT > MAX_WEIGHT)
			kq += 2 * thuGom[cs-2].id;
	}
	return kq;
}

//CACH THU 2: Len tang cao nhat va don rac xuong
function find2(soThungThu,thuGom, MAX_WEIGHT){
	var kq = thuGom[soThungThu.len].id;
	var temp = 0.0;
	
	for	(var i = soThungThu.len; i >= 1; i--){
		temp += thuGom[i].w;
		kq += Math.ceil(temp / MAX_WEIGHT);
	}
	
	return kq;
}

//In ket qua theo cach thu 1
function print1(soThungThu,thuGom, MAX_WEIGHT){
	console.log("Thu toan bo rac den khi nao het suc thi quay lui");
	
	var cs = 1;
	var vt = 1;
	
	while (cs <= soThungThu.len){
		var temp = 0;
		while (temp < MAX_WEIGHT && cs <= soThungThu.len){
			temp += thuGom[cs].w;
			cs++;
		}
		var v = Math.ceil(thuGom[cs - 1].w / MAX_WEIGHT);
		for (var i = 1; i < v; i++){
			console.log(thuGom[cs - 1].id);
			console.log(0);
		}
		var temp_div = v - 1;
		if (temp - temp_div * MAX_WEIGHT > MAX_WEIGHT){
			console.log(thuGom[cs - 1].id);
			console.log(0);
			for (var i = cs -2; i >= vt; i-- ){
				console.log(thuGom[i].id);
			}
			console.log(0);
		}
		else{
			console.log(thuGom[cs - 1].id);
			for (var i = cs -2; i >= vt; i-- ){
				console.log(thuGom[i].id);
			}
			console.log(0);
		}
		vt = cs;
	}
}

//In ket qua theo cach thu 2
function print2(soThungThu,thuGom, MAX_WEIGHT,tab1, tab2){

	for (var i = soThungThu.len; i >= 1 ; i--)
		for (var j = tab1.length - 1; j >= 0 ; j--)
			if (tab1[j].id == thuGom[i].id && tab1[j].state >= 60)
				tab2.push(tab1[j]);
			else if (tab1[j].id < thuGom[i].id ) break;
	
}

//Ham Solve tim lo trinh thu rac toi uu
function solve(soThungThu,thuGom, MAX_WEIGHT, tab1, tab2){
	if (find1(soThungThu,thuGom, MAX_WEIGHT) < find2(soThungThu,thuGom, MAX_WEIGHT))
		print1(soThungThu,thuGom, MAX_WEIGHT);
	else
		print2(soThungThu,thuGom, MAX_WEIGHT, tab1, tab2);
}

exports.process = function process_(rows, floor_first, floor_end, MAX_WEIGHT ){
	var ds = rows;
	var soThung = { len : 0};
	var soThungThu = { len : 0};
	var thuGom = [];
	var tab1 = []; // Moi phan tu cua tab1 la 1 thung rac
	var tab2 = [];  
	
	//Nhap vao du lieu: ds cac thung rac & so thung rac
	enter(ds, soThung, tab1, floor_first, floor_end); //~~~> Co danh sach cac thung rac trong toa nha 
	
	//Tinh toan, khoi tao danh sach cac tang can thu rac , neu khong co duong di thi thuat toan cung ket thuc o day
	var tmp_check = init(ds,thuGom,soThung,soThungThu,floor_first,floor_end); //~~~> Co danh sach cac tang can thu rac 
	
	if (tmp_check.len > 0){
		solve(soThungThu,thuGom, MAX_WEIGHT, tab1, tab2); //~~~> Co lo trinh thu gom rac toi uu
	}
	
	var kq_json = {data : tab1, route: tab2};
	return kq_json;
}