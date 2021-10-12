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
   */
  onTicketCreateHandler(payload) {
    console.log("onTicketCreate");
    console.log(payload);
  },

  /**
   * Handler for onTicketUpdate events. Triggered when a ticket is updated.
   *
   * @param {object} payload
   */
  onTicketUpdateHandler(payload) {
    console.log("onTicketUpdate");
    console.log(payload);
  },

  /**
   * Handler for onConversationCreate events. Triggered when a reply or note (public or private) is added to a ticket.
   *
   * @param {object} payload
   */
  onConversationCreateHandler(payload) {
    console.log("onConversationCreate");
    console.log(`Source: ${CONVERSATION_SOURCES[payload.data.conversation.source]}`);
    console.log(payload);
  },
};
