'use strict';
const config = require('../config');
const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);
const witClient = require('../server/witClient')(config.witToken);

const slackToken = config.slackToken;
const slackLogLevel = 'verbose';

console.log(witClient);
const rtm = slackClient.init(slackToken, slackLogLevel, witClient);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', function() {
    console.log(`Rogbot is listening on ${server.address().port} in ${service.get('env')} mode.`);
});