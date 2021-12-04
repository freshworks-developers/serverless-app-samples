/**@desc - This app enables agents to schedule the creation of tickets.
 *
 * @features -
 * 1. Scheduled Event - onScheduledEvent
 * 2. Using server method invocation(SMI) to schedule the creation of tickets
 * 3. Using a modal to display a ticket create form
 *
 */
var request = require('request');
var base64 = require('base-64');

function createTicket(args) {
  console.log('Creating ticket');
  request(
    {
      url: `https://${args.domain}/api/v2/tickets`,
      method: 'POST',
      headers: {
        Authorization: `Basic ${base64.encode(args.iparams.api_key + ':X')}`
      },
      json: {
        subject: args.data.subject,
        description: args.data.description,
        email: args.data.contact,
        priority: args.data.priority,
        status: args.data.status
      }
    },
    function (err, res, body) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(body);
    }
  );
}

function getListOfSchedules(userId, callback) {
  $db.get(`schedules_${userId}`).then(callback, function (err) {
    if (err.status == 404) {
      callback({ list: {} });
    }
  });
}

function removeScheduleFromList(loggedInUserId, scheduleName, callback) {
  getListOfSchedules(loggedInUserId, function (data) {
    delete data.list[scheduleName];
    $db.set(`schedules_${loggedInUserId}`, data).then(
      function () {
        console.log('Successfully removed schedule from list');
        callback();
      },
      function (err) {
        console.log(err);
        console.log('Unable to remove schedule from list');
      }
    );
  });
}

exports = {
  createSchedule: async function (args) {
    try {
      let scheduleDetails = {
        name: args.scheduleName,
        data: args.scheduleData,
        schedule_at: args.scheduleData.scheduleAtUTC
      };
      let scheduleCreationStatus = await $schedule.create(scheduleDetails);
      renderData(null, scheduleCreationStatus);
    } catch (error) {
      console.error('App is facing problems creating a schedule:', error);
      renderData(err);
    }
  },

  fetchSchedule: async function (args) {
    try {
      let data = await $schedule.fetch({
        name: args.scheduleName
      });
      renderData(null, data);
    } catch (error) {
      console.error('App is facing problems fetching a schedule:', error);
      renderData(error);
    }
  },

  updateSchedule: async function (args) {
    try {
      let data = await $schedule.update({
        name: args.scheduleName,
        data: args.scheduleData,
        schedule_at: args.scheduleData.scheduleAtUTC
      });
      renderData(null, data);
    } catch (error) {
      console.error('App is facing problems updating a schedule:', error);
      renderData(error);
    }
  },

  deleteSchedule: async function (args) {
    try {
      let data = await $schedule.delete({ name: args.scheduleName });
      renderData(null, data);
    } catch (error) {
      console.error('App is facing problems deleting a schedule:', error);
      renderData(error);
    }
  },

  onScheduledEventHandler: async function (payload) {
    try {
      console.log(payload);
    } catch (error) {
      console.error('App is facing problems:', error);
    }
    /**
     * 1. Remove the Schedule from the list of scheduled events
     *   1.1 Get the list of schedules for the logged in user
     *   1.2 Delete the schedule from the list
     * 2. Create a ticket
     *   2.1 Make a POST request to Freshdesk API
     *   2.2 Display the ticket created
     */
    // try {
    //   let data = await $db.get(`schedules_${userId}`);
    // } catch (error) {}
  }
};
