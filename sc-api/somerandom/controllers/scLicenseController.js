'use strict'


var url="http://localhost:3000/somerandom/"

var request = require('request');
var lowercase = require ('lower-case');

function check_firearm_eligibility(user, action, caliber){
    var problems=[];
    var j=0;
    // Get rules for firearm, state, etc.
    // Rules should contain check, message and corrective action 
    // Loop through rules and check them--do all of them
    if (user.over21==false){
       problems[j]="Age(Must be Over 21)";
       j++;
    }
    if (lowercase(user.status)!="active"){
       problems[j]="Status(must be active)";
       j++;
    }
    if (lowercase(action)=="semi-automatic" && 
        !(lowercase(user.traning)=="level1" || lowercase(user.training) =="level2")
      )
    {
       problems[j]="Training(Must have level1 or level2)";
       j++;
    }

    if (lowercase(action)=="automatic" && lowercase(user.training) =="level2"){
       problems[j]="Traning(Must have level2)";
       j++;
    }
    //Check the backgroud check to see if it is recent enough
    var curDate=new Date().getTime();
    var bgDate=Date.parse(user.backgroundCheckDate.substring(0,10));
    var timeDiff=Math.abs(curDate - bgDate);
    var diffDays=Math.ceil(timeDiff/(1000*3600*24));
    if (diffDays > 31){
       problems[j]="Recent Background Check(Last recorded-"+user.backgroundCheckDate.substring(0,10)+")";
       j++;
    }
    else {
       problems[j]="Your Background check it up to date!  Congrats! ";

    }
    // I remembered to comment this for this Issue.
    var timeDiff=Math.abs(curDate - bgDate);
    var diffDays=Math.ceil(timeDiff/(1000*3600*24));

    return problems;
}

function get_user_db (userInput,callback){
     var reqUrl=url+userInput;
     var responseString;

     request.get(reqUrl, (error, response, body)=> {
        if (error) {
           console.log('Error:', err);
        } 
       else  {
           var userInfo=JSON.parse(body);
           if (response.statusCode==201) {
              //add status code to userInfo object so that we can easily ascertain
              userInfo.statusCode=response.statusCode;
           }
           else {   // HERE IS WHERE WE HAVE A REAL USER TO WORK WITH
              userInfo.statusCode=response.statusCode; 
              //TODO:  Validate we got what we need from user call
              callback(userInfo);
           }
        }
     });
}


exports.show_sample_response = function(req, res) {
    res.json({
              name: "Test",
              licenseCode: "1234",
              message: "Test OK",
              response_code: "100"
   });
};

exports.check_a_license = function(req, res) {

    //get the inputs from the request
    var userInput=req.params.UserName;
    var actionInput=req.query.Action;
    var caliberInput=req.query.Caliber;

    var inputArray=[userInput, actionInput, caliberInput]; 
    //TODO:  First get_user_source and only do get_user_db if they are local to SelfControl, else do lookup to SSID
    get_user_db(userInput, function(userInfo){
          var EligibilityArray=check_firearm_eligibility(userInfo, actionInput, caliberInput); 

          if (EligibilityArray.length==0){
               res.statusCode=200;
               res.json({
                   name: userInput,
                   action: actionInput,
                   licenseCode: Math.round(10000000*Math.random()),
                   message: 'OK to Purchase'
               });
          }
          else {
              var theMsg="Not Eligible";
              var i;
              for (i=0; i<EligibilityArray.length; i++)
              {  
                  theMsg+=": "+ EligibilityArray[i].toString();    
              }
              theMsg+="."
              res.statusCode=201;
              res.json({
                  name: userInput,
                  action: actionInput,
                  message: theMsg
              });
       }
     });
}
