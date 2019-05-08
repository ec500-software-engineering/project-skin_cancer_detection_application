const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var multiparty = require('multiparty');
const request = require('request');
var path = require('path');
var util = require('util');
var formidable = require('formidable');
var pug = require('pug');
// var fn = pug.compileFile('path to pug file', options);
// var html = fn(locals);
//const request2 = require('request-promise');


var httpmodule = require('http');
//var url1 = "http://8a3b936a.ngrok.io/photo_ML";
var fs = require('fs');

const port = 3000


app.use(bodyParser.json());
app.use(express.static(__dirname + '/view'));
app.engine('html', require('ejs').renderFile);
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug');


app.get('/',(req,res)=>{  
  console.log("Welcome to CareSkin")
  res.render(__dirname + '/view/index.pug');



});

app.get('/Upload', (req, res) => {
  res.render(__dirname + '/view/upload.pug');
})



app.post('/detection', async function (req, res) {
  var form = new multiparty.Form();
  
  form.parse(req, function(err, fields, files) {
    // res.writeHead(200, {'content-type': 'text/plain'});
    // res.write('received upload:\n\n');
    // res.end(util.inspect({fields: fields, files: files}));
  }); 

  form.on('file', function(name,file) {
    var formData = {
      file: {
        value:  fs.createReadStream(file.path),
        options: {
          filename: file.originalFilename
        }
      }
    };

    // Post the file to the upload server
    request.post({url: 'http://e0455f19.ngrok.io/photo_ML', formData: formData}).on('response', function(response) {
        console.log(response.statusCode) // 200
        console.log(response.headers['r']) // 'image/png'
        var symptoms;
        if(response.headers['r'] == undefined)
        {
          symptoms = "you are healthy or you put undetectable image";
        }
        else 
          symptoms = response.headers['r'];
        console.log(response.body)
        console.log("symptoms ", symptoms);

        //console.log(response)

        res.render(__dirname + '/view/output.pug', {title: `${symptoms}`});
      });


});

});


/*
app.get('/Upload', (request, response) => {

  response.send('Front Page')

  // https://www.w3schools.com/html/html5_geolocation.asp
})
*/

app.get('/gmap', (req,res) => {
    console.log("hello")
    // pug.compileFile(path.join(__dirname, "../views/Gmap.pug")),
    // html = template(locals);
    res.render(__dirname+'/view/Gmap.html');
  })

app.get('/Receive', (request, response) => {

    response.send('Where it receiveds and shows results')

})



app.listen(port, (err) => {
  if (err) {
    return console.log('Error', err)
  }

  console.log(`server is listening on ${port}`)
})