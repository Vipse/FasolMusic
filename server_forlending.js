const express = require("express");
const bodyParser = require("body-parser");
  
const app = express();
  
// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});
 

app.post("/signin", urlencodedParser, function (request, response) {
    console.log('request', request);
    console.log('response :', response);
    debugger
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    //response.send(`${request.body.userName} - ${request.body.userAge}`);
});
  