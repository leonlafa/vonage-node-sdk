module.exports = function(callback, config) {

  var Promise = require('bluebird');

  var Nexmo = require('../lib/Nexmo');

  var nexmo = new Nexmo({
      apiKey: config.API_KEY,
      apiSecret: config.API_SECRET,
      applicationId: config.APP_ID,
      privateKey: config.PRIVATE_KEY
    },
    {debug: config.DEBUG}
  );

  var conversations = Promise.promisifyAll(nexmo.conversations);
  var events = Promise.promisifyAll(nexmo.conversations.events);

  conversations.createAsync({display_name: 'testing'})
    .then(conversation => {
      console.log(conversation.id)

      return events.addAsync(conversation.id,
      {
        type: "custom:test",
        body: {
            hello: "cheese"
        }
      }).then(firstEventResult => {
        console.log('1st Event creation successful', firstEventResult);

        return events.addAsync(conversation.id,
          {
            type: "custom:test2",
            body: {
                hello2: "cheese2"
            }
          });

      }).then(secondEventResult => {
        console.log('2nd Event creation successful', secondEventResult);

        console.log('Getting Event by ID', secondEventResult.id);

        return events.getAsync(conversation.id, secondEventResult.id);
      }).then(getEventByIdResult => {
        console.log('Get single event by ID', getEventByIdResult);
  
        return events.getAsync(conversation.id)
      }).then(listResult => {
        console.log('all events', listResult)
  
        callback(null, listResult)
      })

    }).catch(error => {
      console.error(error)

      callback(error)
    })

};
