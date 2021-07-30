const request = require('request'); 
const express = require('express')
const app = express()
const port = process.env.PORT || 8080;

const headers = {
  'x-vtex-api-appKey': 'vtexappkey-carrefourbr-SZQQTR',
  'x-vtex-api-appToken' : 'NZTSNDVLBFULAKSCFVIUHDBILDPLERWRJGEDHIERVMOCECOTFJRCKQQKXKGJOJHKICBUFPVWQQZVOZEJPVFUZUHTQUFXCVDLEEUBAUOPNUMUQVVYFWTSEMKNVHELKYUV',
  'Cookie': 'Cookie: checkout.vtex.com=__ofid=b71908db2352435e95304ab651fe32ce; janus_sid=3cf711f5-a986-4387-a593-2890a7bf6bb8',
};
const objectCL = '{"objectName":"CL","fields":[{"fieldName":"id","fieldType":"string"},{"fieldName":"birthDate","fieldType":"datetime"},{"fieldName":"businessPhone","fieldType":"string"},{"fieldName":"channel","fieldType":"string"},{"fieldName":"email","fieldType":"string"},{"fieldName":"firstName","fieldType":"string"},{"fieldName":"gender","fieldType":"string"},{"fieldName":"homePhone","fieldType":"string"},{"fieldName":"lastName","fieldType":"string"},{"fieldName":"newGender","fieldType":"string"},{"fieldName":"newPhone","fieldType":"string"},{"fieldName":"phone", "fieldType":"string"},{"fieldName":"profilePicture","fieldType":"string"},{"fieldName":"promotion","fieldType":"string"},{"fieldName":"userId","fieldType":"string"},{"fieldName":"document","fieldType":"string"},{"fieldName":"corporateDocument","fieldType":"string"},{"fieldName":"corporateName","fieldType":"string"},{"fieldName":"documentType","fieldType":"string"}]}';
const objectAD = '{"objectName":"AD","fields":[{"fieldName":"id","fieldType":"string"},{"fieldName":"addressName","fieldType":"string"},{"fieldName":"addressType","fieldType":"string"},{"fieldName":"city","fieldType":"string"},{"fieldName":"complement","fieldType":"string"},{"fieldName":"country","fieldType":"string"},{"fieldName":"countryfake","fieldType":"string"},{"fieldName":"neighborhood","fieldType":"string"},{"fieldName":"number","fieldType":"string"},{"fieldName":"postalCode","fieldType":"string"},{"fieldName":"receiverName","fieldType":"string"},{"fieldName":"state","fieldType":"string"},{"fieldName":"street","fieldType":"string"},{"fieldName":"userId","fieldType":"string"},{"fieldName":"id","fieldType":"string"},{"fieldName":"createdBy","fieldType":"string"},{"fieldName":"createdIn","fieldType":"string"}';
const objects = `{"status":"success","objects":[${objectCL},${objectAD}]}]}`;

const IsJsonString = function(str){
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}
const getFieldObjects = function(data){
  var returnObjectFields ='';
  Object.entries(data).forEach(([key, value]) => {
    var fieldType = '';
    var fieldValue = '';
    if(key.toLowerCase().indexOf("date")>0){
      fieldType="date"
    }
    else{        
      fieldType="string"
    }
    if(value!=null){
      fieldValue =`"${value}"`
    }
    else{        
      fieldValue="null"
    }
    var objectField =  `{"fieldName":"${key}", "fieldValue":${fieldValue}, "fieldType":"${fieldType}"}` 
    var isJson = IsJsonString(objectField);
    if(isJson)
    {
      returnObjectFields += objectField+","
    }
  })
  return returnObjectFields;
}
const getFormatDataObject = function(data){
  let returnObjectFields='[';
  for(let i = 0; i < data.length; i++){      
    returnObjectFields += getFieldObjects(data[i]);
  } 
  return returnObjectFields.slice(0, -1)+']';   
}
const getFormatObject = function(objectName, data){
  let returnObjectFields= getFormatDataObject(data);
  var returnObject = `{"status":"success","objectName":"${objectName}","fields":${returnObjectFields}}`;
  return JSON.parse(returnObject);
}
const getFormatedRecords = function(objectId, data){
  let returnObjectFields= `"data": ${getFormatDataObject(data)}"`;
  for(let i = 0; i < data.length; i++){      
    returnObjectFields += getFieldObjects(data)
  } 
  var returnObject = `{"status":"success","records":{"id":"${objectId}","data":[${returnObjectFields}]}}`;
  return JSON.parse(returnObject);
}

const getObjectRecords = function (req, res) {   
  var url = '';
  var objectName = req.params.object_name;
  
  if(objectName === "AD"){
    url = 'https://carrefourbrqa.vtexcommercestable.com.br/api/dataentities/CL/search?_fields=id,birthDate,businessPhone,channel,email,firstName,gender,homePhone,lastName,newGender,newPhone,phone,profilePicture,promotion,userId,document,corporateDocument,corporateName,documentType';
  }  
  else{    
    url = 'https://carrefourbrqa.vtexcommercestable.com.br/api/dataentities/CL/search?_fields=id,birthDate,businessPhone,channel,email,firstName,gender,homePhone,lastName,newGender,newPhone,phone,profilePicture,promotion,userId,document,corporateDocument,corporateName,documentType';
  }  
  const options = {
    url: url,
    headers: headers
  };  
  request (options, function (error, response, body){
    if ( !error && response. statusCode == 200) { 
      let data = JSON.parse(body); 
      console.log(data);
      res.send(getFormatObject(objectName, data));
    } 
    else { 
      console.log(response.statusCode + response.body); 
      res.send(response); 
    }
  }); 
}

const getObjectDescrice = function(req, res){
  var objectName = req.params.object_name;
  var objectDescribe = '';
  if(objectName === "AD"){
    objectDescribe = objectAD;
  }
  else if(objectName === "CL"){
    objectDescribe = objectAD;
  }
  
  var response = `{"status":"success","objectName":"${objectName}","fields":[${objectDescribe}]}`;
  res.send(response); 
}

const getObjectCount = function(req, res){ 
  var url = '';
  var objectName = req.params.object_name;  
  if(objectName === "AD"){
    url = 'https://carrefourbrqa.vtexcommercestable.com.br/api/dataentities/CL/scroll?_fields=email';
  }  
  else{    
    url = 'https://carrefourbrqa.vtexcommercestable.com.br/api/dataentities/CL/scroll?_fields=id';
  }  
  const options = {
    url: url,
    headers: headers
  };  
  request (options, function (error, response, body){
    if ( !error && response. statusCode == 200) { 
      let data = JSON.parse(body); 
      console.log(data);
      var countReturn = `{
        "status":"success"
        "count":${data.length}
        }`;
      res.send(countReturn);
    } 
    else { 
      console.log(response.statusCode + response.body); 
      res.send(response); 
    }
  });
}


const getRecord = function (req, res) {   
  var url = '';
  var objectName = req.params.object_name;
  var record_id = req.params.record_id;  
  if(objectName === "AD"){
    url = `https://carrefourbrqa.vtexcommercestable.com.br/api/dataentities/CL/search?id=${record_id}&_fields=id,birthDate,businessPhone,channel,email,firstName,gender,homePhone,lastName,newGender,newPhone,phone,profilePicture,promotion,userId,document,corporateDocument,corporateName,documentType`;
  }  
  else{    
    url = `https://carrefourbrqa.vtexcommercestable.com.br/api/dataentities/CL/search?id=${record_id}&_fields=id,birthDate,businessPhone,channel,email,firstName,gender,homePhone,lastName,newGender,newPhone,phone,profilePicture,promotion,userId,document,corporateDocument,corporateName,documentType`;
  }  
  const options = {
    url: url,
    headers: headers
  };  
  request (options, function (error, response, body){
    if ( !error && response. statusCode == 200) { 
      var status = 'success';
      let data = JSON.parse(body); 
      if(data.length<=0){
        status = "not found"
      }
      console.log(data)
      let returnObjectFields= '';
      for(let i = 0; i < data.length; i++){      
        returnObjectFields += getFieldObjects(data[0])
      }       
      var returnObject = `{
        "status":"${status}",
        "records": {
            "id":"${record_id}",
            "data":[${returnObjectFields.slice(0, -1)}]
          }
        }`;
        console.log(returnObject)
      res.send(JSON.parse(returnObject));
    } 
    else { 
      console.log(response.statusCode + response.body); 
      res.send(response); 
    }
  }); 
}
/******************************************************************************************* */

app.get('/v1/objects',  function(req, res){  
  res.send(JSON.parse(objects)); 
})
app.get('/v1/objects/:object_name/records', getObjectRecords)
app.get('/v1/objects/:object_name/count', getObjectCount)
app.get('/v1/objects/:object_name/describe', getObjectDescrice)
app.get('/v1/objects/:object_name/records/:record_id', getRecord)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
