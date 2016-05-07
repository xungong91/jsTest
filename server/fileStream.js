/**
 * Created by gongxun on 16/4/25.
 */

var fs = require("fs");

//var data = fs.readFileSync("res/input.txt");
fs.readFile("res/input.txt", function(err, data){
    if (err){
        console.error(err);
        return;
    }
    console.log(data.toString());
});

console.log("close");