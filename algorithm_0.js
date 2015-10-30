function Qsort(arrFLOOR, l , h ){
	
	var i,j,x,tmp;
	
	i = l;
	j = h;
	x = arrFLOOR[((l + h) / 2) | 0];
	do{
		while (arrFLOOR[i] < x) i = i + 1;
		while (arrFLOOR[j] > x)	j = j - 1;
		if (i <= j ){
			tmp = arrFLOOR[i];
			arrFLOOR[i] = arrFLOOR[j];
			arrFLOOR[j] = tmp;
			i = i + 1;
			j = j - 1;
		} 
	} while (i <= j);
	if (l < j ) Qsort(arrFLOOR, l , j );
	if (i < h ) Qsort(arrFLOOR, i , h);
}

function solution(arrFLOOR,lenID,position){
	var start = 0; 
	var length_;
	var way = [];
	for (var i = 1; i <= lenID; i++){
		if (arrFLOOR[i] == position){
			start = i;
			break;
		} 
	}
	length_ = 0;
	way[0] = -3;
	for(var i = start; i <= lenID; i++)
	{
		length_++;
		way[length_] = arrFLOOR[i];	
	}
	//console.log(length_);
	for(var i = lenID - 1; i >= start; i--)
	{
		length_++;
		way[length_] = arrFLOOR[i];
	}
	for(var i = start-1; i >= 1; i--)
	{
		length_++;
		way[length_] = arrFLOOR[i];
	}
	for(var i = 2; i <= start; i++)
	{
		length_++;
		way[length_] = arrFLOOR[i];
	}
	
	return way;
}

exports.process = function process_(rows, position){
		var arrFLOOR = [];			
		var lenID = 0;
		rows.forEach(function(row){
			if (row.STATE >= 80){
				lenID = lenID + 1;
				arrFLOOR[lenID] = row.FLOOR;				
			}  
		});
		Qsort(arrFLOOR,1,lenID);
		
		var t_fuck = lenID;
		rows.forEach(function(row){
			if (row.STATE >= 60 && row.STATE < 80 && row.FLOOR > arrFLOOR[1] && row.FLOOR < arrFLOOR[t_fuck]){
				lenID = lenID + 1;
				arrFLOOR[lenID] = row.FLOOR;				
			}  
		});
		
		lenID = lenID + 1;
		arrFLOOR[lenID] = position;
		Qsort(arrFLOOR,1,lenID);
		
		return solution(arrFLOOR,lenID,position);
}