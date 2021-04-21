const myos= require('os')
const myfs= require('fs')

let totalM= myos.totalmem();
let fmem= myos.freemem();

fs.create
console.log(`my total memery is ${totalM}`)
console.log(`my free memory is ${fmem}`)

let fs = require('fs')
let uc  = require('upper-case')
let express = require('express')
let app = express()
let url = require('url')
let cust= require('./custcruda');
let fmd= require('formidable')
let MongoClient  = require('mongodb').MongoClient;
let dbUrl= "mongodb://127.0.0.1:27017";

http.createServer(function (request, res){
    app.get("/", function (request, response){
        MongoClient.connect(dbUrl,function (err, db){
            if(err) throw  err;
            let dbo = db.db("user");
            dbo.collection("user").find().toArray(function (err, userArray){
                if(err) throw  err;
                console.log(userArray);
                userArray.forEach(function (user,index){
                    response.write(user.Email);
                });
                response.end();
                db.close();

            });
        });
    });
    if (request.url==="/api/getAccountDetail"){
        res.write("got here now");
        res.end();
    }
    //res.writeHead(200, {'Content-Type': 'text/html'});
    //res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    //res.write('<input type="file" name="filetoupload"><br>');
    //res.write('<input type="submit">');
    //res.write('</form>');
    //return res.end();
}).listen(8089);


var getAccountDetails=function (username){

}
//http.createServer(function (req,resp){
//  console.log("got here")
//  var kkk= uc.upperCase("tell me")
// let readrul= url.parse(req.url, true);
// let fname =readrul.fName;
//  let bpath =readrul.basePath;
//  let finalFile = './'+bpath+'/'+fname;
//  console.log(finalFile);
//fs.readFile(finalFile, function (err, data) {
//if (err) {
//   resp.writeHead(400, {'Content-Type': 'html/text'});
//  return resp.end("file not dfound")
//}
// resp.writeHead(200, {'Content-Type': 'html/text'});
// resp.write(data);
// return resp.end();
//});
//}).listen(8060);
//http.createServer(function (req, resp){
//read query string
//let rec= 'localhost:3000/?firstName=alao&lastName=ade'
//let q = url.parse(rec, true).query;
//console.log(q.firstName);
//console.log(q.lastName);


//localhost:3000/?firstName=alao&lastName=ade

//--------create file
//fs.writeFile= create a new file
//fs.unlink =delete file
//fs.appendFile = update
//fs.unlink = delete
//fs.rename(oldNanme, newName) = remane existing file
//fs.unlink('./textFile/myNewFile1.txt',function (err){
// if (err) throw  err;
// console.log(err);
//});


//-------read file system
//fs.readFile('./htmlfile/demofile1.html', function (err, data){
//  resp.writeHead(200, {'Content-Type': 'text/html'});
//  resp.write(data);
//  return resp.end();
//});



//---------split and read query string
//var q = url.parse(req.url, true).query;
//resp.writeHead(200, {'Content-Type': 'html'});
//var txt = q.year + " " + q.month;
//resp.write(txt);
//resp.end();
//}).listen(8000);

//app.get('/', function (req, res){
// res.send('hello Alao')
//})

//app.get('/AccountDetails', function (req, res){
//  res.send('hello Alao aded')
//})

//app.listen(3000, function (){
//  console.log('app listening on port 3000')
//})