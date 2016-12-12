'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm = null;
let nlp = null;
let registry = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message) {
    console.log(message);

    if (message.text.toLowerCase().includes('rogbot')) {
        nlp.ask(message.text, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            try {
                console.log(res);
                if (!res.intent || !res.intent[0] || !res.intent[0].value)
                    throw new Error('Could not extract intent');

                //const intentName = res.intent[0].value.replace(/:.*/i, '');
                const breakIntent = res.intent[0].value.split(':');
                // In case we have subIntents => bitcoin:transfer, bitcoin:balance
                if(breakIntent.length > 1) {
                    res.intent[0].value = breakIntent[0];
                    res.intent[0].subIntent = breakIntent[1];
                }

                const intent = require('./intents/' + breakIntent[0] + 'Intent');

                intent.process(res, registry, function (error, response) {
                    if (error) {
                        console.log(error.message);
                        return;
                    }

                    return rtm.sendMessage(response, message.channel);
                });

            } catch (err) {
                console.log(err);
                console.log(res);
                rtm.sendMessage("Sorry, I don't know what you are talking about", message.channel);
            }

        });

    }




}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
    nlp = nlpClient;
    rtm = new RtmClient(token, { logLevel: logLevel });
    registry = serviceRegistry;

    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
    return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;