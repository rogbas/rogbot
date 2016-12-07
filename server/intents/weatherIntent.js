'use strict';
const request = require('superagent');

module.exports.process = function process(intentData, registry, cb) {
 
    if(intentData.intent[0].value != 'weather')
        return cb(new Error(`Expected weather intent, got ${intentData.intent[0].value}`));
 
    if(!intentData.location)
        return cb(new Error('Missing location in weather intent'));


    const location = intentData.location[0].value.replace(/,.?rogbot/i, '');
    
    const service = registry.get('weather');
    if(!service) return cb(false, 'No weather service available');

    request.get(`http://${service.ip}:${service.port}/service/${location}`, (err, res) => {
        if(err || res.statusCode != 200 || !res.body.result) {
            console.log(err);
            return cb(false, `I had a problem finding the weather in ${location}`);
        }

        return cb(false, `In ${location} the weather is ${res.body.result}`);

    });
   

}