exports = {
  // args is a JSON block containing the payload information.
  // args['iparam'] will contain the installation parameter values.

  //common module events - app setup events
  onAppInstallHandler: async function (args) {
    console.info('onAppInstallHandler invoked with following data: \n', JSON.stringify(args));
    let data = await $schedule.create({
      name: "scheduled_event_sample",
      data: {
        "event_info": "app_install"
      },
      schedule_at: "2024-03-25T07:00:00.860Z",
      repeat: {
        time_unit: "minutes",
        frequency: 5
      }
    });
    console.log("Schedule created: \n", JSON.stringify(data))
    let url = await generateTargetUrl()
    console.log("External Event target URL created: \n", JSON.stringify(url))
    renderData();
  },
  onAppUninstallHandler: function (args) {
    console.log('onAppUninstalHandler invoked with following data: \n', JSON.stringify(args));
    $schedule.delete({ name: "scheduled_event_sample" });
    renderData();
  },
  //scheduled event
  onScheduledEventHandler: function (args) {
    console.log("Logging arguments from onScheduledEvent: " + JSON.stringify(args));
  },
  //external event
  onExternalEventHandler: function (args) {
    console.log("Logging arguments from the external event:" + JSON.stringify(args));
  },

  //support_agent module event
  onAgentCreateHandler: function (args) {
    console.log('Hello ' + args['data']['agent']['name']);
  },

  //support_company module event
  onCompanyCreateCallback: function (args) {
    console.log("Logging arguments from onCompanyCreate event: " + JSON.stringify(args));
  },

  //chat_conversation module event
  onConversationCreateCallback: function (args) {
    console.log("Logging arguments from onConversationCreate event: " + JSON.stringify(args));
  },

  //caller_conversation module event
  onCallCreateCallback: function (payload) {
    console.log("Logging arguments from onCallCreate event: " + JSON.stringify(payload));
  }

};
