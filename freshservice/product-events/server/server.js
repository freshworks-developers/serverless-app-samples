/**
 * Conversation sources for onConversationCreate events
 */
const CONVERSATION_SOURCES = {
  0: "Reply",
  2: "Note",
  5: "Created from tweets",
  6: "Created from survey feedback",
  7: "Created from Facebook post",
  8: "Created from forward email",
  9: "Created from phone",
  10: "Created from Mobihelp",
  11: "E-commerce",
};

exports = {
  /**
   * Handler for onTicketCreate events. Triggered when a new ticket is created.
   *
   * @param {object} payload
   * @param {number} payload.account_id - Freshservice account ID
   * @param {string} payload.domain - Freshservice account domain
   * @param {string} payload.event - Name of the event: "onTicketCreate"
   * @param {string} payload.region - Region where the Freshservice account is deployed.
   * Possible values: "US", "EU", "EUC", "AUS", and "IND"
   * @param {number} payload.timestamp - App installation timestamp in Unix epoch format
   * @param {object} payload.data - The data for this event
   * @param {object} payload.data.ticket - Details of the ticket created
   * @param {object} payload.data.requester - The requester of the ticket
   * @see https://developers.freshservice.com/docs/product-events/ for full list of parameters
   */
  onTicketCreateHandler(payload) {
    console.log("onTicketCreate");
    console.log(`Ticket created with ID: ${payload.data.ticket.id}`);
    console.log(`Ticket subject: ${payload.data.ticket.subject}`);
    console.log(`Ticket requested by: ${JSON.stringify(payload.data.requester, null, 2)}`);
  },

  /**
   * Handler for onTicketUpdate events. Triggered when a ticket is updated.
   *
   * @param {object} payload
   * @param {number} payload.account_id - Freshservice account ID
   * @param {string} payload.domain - Freshservice account domain
   * @param {string} payload.event - Name of the event: "onTicketUpdate"
   * @param {string} payload.region - Region where the Freshservice account is deployed.
   * Possible values: "US", "EU", "EUC", "AUS", and "IND"
   * @param {number} payload.timestamp - App installation timestamp in Unix epoch format
   * @param {object} payload.data - The data for this event
   * @param {object} payload.data.ticket - Details of the ticket updated
   * @param {object} payload.data.changes - Changes made to the ticket
   * @param {object} payload.data.requester - The requester of the ticket
   * @see https://developers.freshservice.com/docs/product-events/ for full list of parameters
   */
  onTicketUpdateHandler(payload) {
    console.log("onTicketUpdate");
    console.log(`Ticket updated with ID: ${payload.data.ticket.id}`);
    console.log(`Ticket changes made: ${JSON.stringify(payload.data.changes, null, 2)}`);
  },

  /**
   * Handler for onConversationCreate events. Triggered when a reply or note (public or private) is added to a ticket.
   *
   * @param {object} payload
   * @param {number} payload.account_id - Freshservice account ID
   * @param {string} payload.domain - Freshservice account domain
   * @param {string} payload.event - Name of the event: "onConversationCreate"
   * @param {string} payload.region - Region where the Freshservice account is deployed.
   * Possible values: "US", "EU", "EUC", "AUS", and "IND"
   * @param {number} payload.timestamp - App installation timestamp in Unix epoch format
   * @param {object} payload.data - The data for this event
   * @param {object} payload.data.conversation - Details of the conversation item added
   * @param {number} payload.data.conversation.source - Denotes the type of conversation
   * @param {boolean} payload.data.conversation.private - If true, the conversation added is private
   * @param {number} payload.data.conversation.ticket_id - ID of the ticket when the conversation is added
   * @see https://developers.freshservice.com/docs/product-events/ for full list of parameters
   */
  onConversationCreateHandler(payload) {
    console.log("onConversationCreate");
    console.log(`Type: ${CONVERSATION_SOURCES[payload.data.conversation.source]}`);
    console.log(`Private?: ${payload.data.conversation.private}`);
    console.log(`Added to ticket: ${payload.data.conversation.ticket_id}`);
  },
};
