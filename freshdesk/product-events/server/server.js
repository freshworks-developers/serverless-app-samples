exports = {
  /**
   * This method gets triggered when a ticket is created in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onTicketCreateHandler: function(args) {
    console.info(`Ticket created: ${args['data']['ticket']['id']}`);
    // When using Test versions for Serverless apps, you can use the environment variable to ensure the snippet of code executes in test environment only
    if(process.env.ENV === "test"){
      console.info("onTicketCreate has been invoked in test instance")
    }
  },

  /**
   * This method gets triggered when a ticket is updated in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onTicketUpdateHandler: function (args) {
    console.info(`Ticket updated: ${args['data']['ticket']['id']}`);
    // When using Test versions for Serverless apps, you can use the environment variable to ensure the snippet of code executes in production environment only
    if(process.env.ENV === "production"){
      console.info("onTicketUpdate has been invoked in production instance")
    }
  },

  /**
   * This method gets triggered when conversation is added to any ticket in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onConversationCreateHandler: function (args) {
    console.info(`Conversation created: ${args['data']['conversation']['id']}`);
  },

  /**
   * This method gets triggered when a contact is created in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onContactCreateHandler: function (args) {
    console.info(`Contact created: ${args['data']['contact']['id']}`);
  },

  /**
   * This method gets triggered when a contact is updated or deleted in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onContactUpdateHandler: function (args) {
    console.info(`Contact updated: ${args['data']['contact']['id']}`);
  },

  /**
   * This method gets triggered when a company is created in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onCompanyCreateHandler: function (args) {
    console.info(`Company created: ${args['data']['company']['id']}`);
  },

  /**
   * This method gets triggered when a company is updated in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onCompanyUpdateHandler: function (args) {
    console.info(`Company updated: ${args['data']['company']['id']}`);
  },

  /**
   * This method gets triggered when a company is deleted in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onCompanyDeleteHandler: function (args) {
    console.info(`Company deleted: ${args['data']['company']['id']}`);
  },

  /**
   * This method gets triggered when a time entry is added to a ticket in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onTimeEntryCreateHandler: function (args) {
    console.info(`Time entry created: ${args['data']['time_entry']['id']}`);
  },

  /**
   * This method gets triggered when a time entry is updated to a ticket in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onTimeEntryUpdateHandler: function (args) {
    console.info(`Time entry updated: ${args['data']['time_entry']['id']}`);
  },

  /**
   * This method gets triggered when a time entry is deleted from a ticket in the product
   *
   * @param {object} args - Event payload with platform metadata
   */
  onTimeEntryDeleteHandler: function (args) {
    console.info(`Time entry deleted: ${args['data']['time_entry']['id']}`);
  }
};
