'use strict';
const request = require('superagent');

module.exports.process = function process(intentData, registry, cb) {

    if (intentData.intent[0].value != 'bitcoin')
        return cb(new Error(`Expected bitcoin intent, got ${intentData.intent[0].value}`));

    if (!intentData.intent[0].subIntent)
        return cb(new Error(`No subIntent passed to the bitcoin intent`));

    const subIntent = intentData.intent[0].subIntent;
    const _amount = ('number' in intentData) ? intentData.number[0].value : '';
    const _destination = ('location' in intentData) ? intentData.location[0].value : '';

    console.log('Processing intent bitcoin');
    console.log(intentData);
    // if(!intentData.location)
    //    return cb(new Error('Missing location in weather intent'));


    // const location = intentData.location[0].value.replace(/,.?rogbot/i, '');

    const service = registry.get('bitcoin');
    if (!service) return cb(false, 'No bitcoin service available');

    request
        .post(`http://${service.ip}:${service.port}/service/${subIntent}/`)    
        .send({ destination: _destination })
        .send({ amount: _amount })
        .end((err, res) => {
            if (err || res.statusCode != 200 || !res.body.message) {
                console.log(err);
                return cb(false, `I had a problem doing the operation`);
            }

            return cb(false, `${res.body.message}`);

        });


}