import fetch from 'node-fetch';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 5000;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/test/submit', (req, res) => {

const requestData = {
  "reportType": "CREDIT_CHECK_CONSUMER",
    "personIdentity": {
        "postalAddress": {
        "street": req.body.address,
        "houseNumber": "94c",
        "zip": req.body.pinCode,
        "city": req.body.city,
        "country": "CHE"
        },
        "phones": [req.body.phoneNumber],
        "mobiles": [req.body.phoneNumber],
        "emails": [req.body.email],
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "sex": "FEMALE",
        "birthDate": req.body.birthday
      }
};


fetch('https://services.crif-online.ch/CrifOnlineAPI/reports/personAddress', {
  method: 'POST',
  headers: {
  "Authorization": `Basic Q1JTX0xhbmlha2VhRGhpbGxpb246dmVCbWY2P1p0UkJB`,
  "api-version": "1",
  'Content-Type': 'application/json',
  'reference-number': '',
  'end-user-id': '',
  'cost-group-id': '',
  },
  body: JSON.stringify(requestData),
   })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    // var fName = data?.decisionMatrix.firstName;
    // var lName = data?.decisionMatrix.lastName;
    var score = data?.decisionMatrix.decisionItems[0].value;
    var insertData = '\n' + req.body.firstName + ', ' + req.body.lastName + ', Score: ' + score
    + ', ' + req.body.email+ ', ' + req.body.phoneNumber+ ', ' + req.body.address+ ', ' + req.body.city+ ', ' + req.body.pinCode;
    var textColor = '';
    var text = '';
    if (score > 420){
      textColor = 'green'; 
      text = 'Your credit card is powerful.';
      fs.appendFile('userdata.txt',insertData, 'utf8',
    function(err) {     
        if (err) throw err;
        console.log("Data is appended to file successfully.")
});
    }
    else {
      textColor = 'red';
      text = 'Your credit card is not powerful.';
      console.log("Score is : " + score);
    }
      res.setHeader("Content-Type", "text/html")
      res.send(`<h1>CREDIT CARD REPORT</h1><p style="color:${textColor}; font-size:45px;"> ${text}</p>`)
  })
  .catch(err => console.log(err));
});
 
app.listen(PORT, () => {
  console.log('Our express server is up on port ' + PORT);
});