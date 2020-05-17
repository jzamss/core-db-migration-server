const fetch = require("node-fetch");


const getDate = () => {
  return fetch("http://192.168.1.9:8070/osiris3/json/etracs25/DateService.getServerDate")
    .then(res => res.json() )
    .then(data => console.log("data", data))
}

