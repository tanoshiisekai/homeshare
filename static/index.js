
/**
 * Created by long on 2017/3/19.
 */


var httpserver = "http://192.168.2.110";
var httpport = "10001";

function Ajax(type, url, data, success, failed){
    var xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    var type = type.toUpperCase();
    var random = Math.random();
    if(typeof data == 'object'){
        var str = '';
        for(var key in data){
            str += key+'='+data[key]+'&';
        }
        data = str.replace(/&$/, '');
    }
    if(type == 'GET'){
        if(data){
            xhr.open('GET', url + '?' + data, true);
        } else {
            xhr.open('GET', url + '?t=' + random, true);
        }
        xhr.send();
    } else if(type == 'POST'){
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                success(xhr.responseText);
            } else {
                if(failed){
                    failed(xhr.status);
                }
            }
        }
    }
}

function addinfo(){
    var infocontent =  document.getElementById("inputbox").value;
    if(infocontent.length!=0) {
        Ajax("post", httpserver + ":" + httpport + "/addinfo",
            {"infocontent": infocontent},
            function (data) {
                window.location.href = "/";
            },
            function (data) {
            }
        )
    }
}

function deleteinfo(infoid){
    Ajax("get", httpserver + ":" + httpport + "/deleteinfo",
        {"infoid": infoid},
        function(data){
            document.getElementById(infoid).style.display = "none";
        },
        function(data) {
        }
    )
}
