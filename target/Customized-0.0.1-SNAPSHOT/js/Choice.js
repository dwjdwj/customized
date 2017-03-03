//代码移动界面js

function myRegister(){
	var filename=$("input[name='Fruit']:checkbox").serialize();
	var jarname=document.getElementById("jarname").value;
console.log("-----------------------")
console.log(jarname)
$.ajax({
     url: "/Customized/moveFile",
    type: "post",
    data : {
		"filename" : filename,
		"jarname" :jarname
	},
    success: function (data) {
    	var re=data.result;
    	console.log(re)
    	if(re==true){
    		alert("打包成功")
    		location.reload();
    	}
    	else
    	alert("打包成功")	
    	 parent.location.reload();
    }
});}



function RegisterRun(){
	var filename=$("input[name='Fruit']:checkbox").serialize();

console.log("-----------------------")
console.log(filename)
$.ajax({
     url: "/Customized/backmoveFile",
    type: "post",
    data : {
		"filename" : filename,
	},
    success: function (data) {
    	var re=data.result;
    	if(re==true){
    		alert("移动成功")
    		location.reload();}
    	
    	else
    	alert("移动成功")	
    	location.reload();	
     
    }
});}