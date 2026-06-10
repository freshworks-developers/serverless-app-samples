const RECURRING_SCHEDULE = 'finsecure_sla_scan';
const ONE_TIME_SCHEDULE = 'task_reminder';
const VIP_IVR_CODES = ['11', '12'];
const VIP_CALLER_NUMBERS = ['+15551234567', '+18005550100'];

function logTicketEvent(eventName, payload) {
  const ticket = payload && payload.data && payload.data.ticket;
  console.info('[FinSecure] ' + eventName, {
    ticket_id: ticket && ticket.id,
    subject: ticket && ticket.subject,
    status: ticket && ticket.status,
    priority: ticket && ticket.priority,
    urgency: ticket && ticket.urgency
  });
}

function logConversationEvent(eventName, payload) {
  const conversation = payload && payload.data && payload.data.conversation;
  console.info('[FinSecure] ' + eventName, {
    conversation_id: conversation && conversation.id,
    ticket_id: conversation && conversation.ticket_id,
    kind: conversation && conversation.kind,
    private: conversation && conversation.private,
    ticket_workspace_id: conversation && conversation.ticket_workspace_id
  });
}

function logCannedResponseEvent(eventName, payload) {
  const canned = payload && payload.data && payload.data.canned_response;
  console.info('[FinSecure] ' + eventName, {
    canned_response_id: canned && canned.id,
    title: canned && canned.title,
    folder_id: canned && canned.folder_id
  });
}

function logTicketFieldEvent(eventName, payload) {
  const field = payload && payload.data && payload.data.ticket_field;
  console.info('[FinSecure] ' + eventName, {
    ticket_field_id: field && field.id,
    name: field && field.name,
    label: field && field.label,
    field_type: field && field.field_type
  });
}

function logTimeEntryEvent(eventName, payload) {
  const entry = payload && payload.data && payload.data.time_entry;
  console.info('[FinSecure] ' + eventName, {
    time_entry_id: entry && entry.id,
    ticket_id: entry && entry.ticket_id,
    billable: entry && entry.billable,
    time_spent: entry && entry.time_spent
  });
}

function logAgentEvent(eventName, payload) {
  const agent = payload && payload.data && payload.data.agent;
  console.info('[FinSecure] ' + eventName, {
    agent_id: agent && agent.id,
    name: agent && agent.name,
    email: agent && agent.contact && agent.contact.email
  });
}

function logAgentStatusEvent(eventName, payload) {
  const status = payload && payload.data && payload.data.agent_status;
  console.info('[FinSecure] ' + eventName, {
    agent_status_id: status && status.id,
    name: status && status.name,
    state: status && status.state,
    type: status && status.type
  });
}

function logGroupEvent(eventName, payload) {
  const group = payload && payload.data && payload.data.group;
  console.info('[FinSecure] ' + eventName, {
    group_id: group && group.id,
    name: group && group.name,
    group_type: group && group.group_type
  });
}

function logCompanyEvent(eventName, payload) {
  const company = payload && payload.data && payload.data.company;
  console.info('[FinSecure] ' + eventName, {
    company_id: company && company.id,
    name: company && company.name,
    domains: company && company.domains
  });
}

function logChatConversationEvent(eventName, payload) {
  const conversation = payload && payload.data && payload.data.conversation;
  console.info('[FinSecure] ' + eventName, {
    conversation_id: conversation && conversation.id,
    status: conversation && conversation.status,
    user_id: conversation && conversation.user_id,
    priority: conversation && conversation.priority
  });
}

function logMessageEvent(eventName, payload) {
  const message = payload && payload.data && payload.data.message;
  console.info('[FinSecure] ' + eventName, {
    conversation_id: message && message.conversation_id,
    channel_id: message && message.channel_id,
    status: message && message.status,
    message_type: message && message.message_type
  });
}

function logAgentActivityEvent(eventName, payload) {
  const activity = payload && payload.data && payload.data.agent_activity;
  console.info('[FinSecure] ' + eventName, {
    org_agent_id: activity && activity.org_agent_id,
    status: activity && activity.status,
    availability_event_type: activity && activity.availability_event_type
  });
}

function logCallEvent(eventName, payload) {
  const call = payload && payload.data && payload.data.call;
  console.info('[FinSecure] ' + eventName, {
    call_id: call && call.id,
    direction: call && call.direction,
    phone_number: call && call.phone_number,
    assigned_agent_id: call && call.assigned_agent_id
  });
}

exports = {
  onAppInstallHandler: async function () {
    const recurringAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const oneTimeAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const recurringSchedule = await $schedule.create({
      name: RECURRING_SCHEDULE,
      data: {
        event_info: 'sla_breach_scan'
      },
      schedule_at: recurringAt,
      repeat: {
        time_unit: 'minutes',
        frequency: 15
      }
    });

    const oneTimeSchedule = await $schedule.create({
      name: ONE_TIME_SCHEDULE,
      data: {
        task_id: 100001
      },
      schedule_at: oneTimeAt
    });

    const webhook = await generateTargetUrl();

    console.info('[FinSecure] Recurring schedule created', JSON.stringify(recurringSchedule));
    console.info('[FinSecure] One-time schedule created', JSON.stringify(oneTimeSchedule));
    console.info('[FinSecure] External event URL', JSON.stringify(webhook));

    renderData();
  },

  afterAppUpdateHandler: function (payload) {
    console.info('[FinSecure] App updated', JSON.stringify(payload));
    renderData();
  },

  onAppUninstallHandler: async function () {
    await $schedule.delete({ name: RECURRING_SCHEDULE });
    await $schedule.delete({ name: ONE_TIME_SCHEDULE });
    renderData();
  },

  onScheduledEventHandler: function (args) {
    console.info('[FinSecure] Scheduled event tick', JSON.stringify(args));
  },

  onExternalEventHandler: function (args) {
    console.info('[FinSecure] External monitoring webhook', JSON.stringify(args));
  },

  onAgentCreateHandler: function (payload) {
    logAgentEvent('onAgentCreate', payload);
  },

  onAgentUpdateCallback: function (payload) {
    logAgentEvent('onAgentUpdate', payload);
  },

  onAgentDeleteCallback: function (payload) {
    logAgentEvent('onAgentDelete', payload);
  },

  onAgentStatusCreateCallback: function (payload) {
    logAgentStatusEvent('onAgentStatusCreate', payload);
  },

  onAgentStatusUpdateCallback: function (payload) {
    logAgentStatusEvent('onAgentStatusUpdate', payload);
  },

  onAgentStatusDeleteCallback: function (payload) {
    logAgentStatusEvent('onAgentStatusDelete', payload);
  },

  onAgentAvailabilityUpdateCallback: function (payload) {
    const agent = payload && payload.data && payload.data.agent;
    console.info('[FinSecure] onAgentAvailabilityUpdate', {
      agent_id: agent && agent.id,
      changes: payload && payload.data && payload.data.changes
    });
  },

  onGroupCreateCallback: function (payload) {
    logGroupEvent('onGroupCreate', payload);
  },

  onGroupUpdateCallback: function (payload) {
    logGroupEvent('onGroupUpdate', payload);
  },

  onGroupDeleteCallback: function (payload) {
    logGroupEvent('onGroupDelete', payload);
  },

  onCompanyCreateCallback: function (payload) {
    logCompanyEvent('onCompanyCreate', payload);
  },

  onCompanyUpdateCallback: function (payload) {
    logCompanyEvent('onCompanyUpdate', payload);
  },

  onCompanyDeleteCallback: function (payload) {
    logCompanyEvent('onCompanyDelete', payload);
  },

  onTicketCreateCallback: function (payload) {
    logTicketEvent('onTicketCreate', payload);
  },

  onTicketUpdateCallback: function (payload) {
    logTicketEvent('onTicketUpdate', payload);
  },

  onTicketDeleteCallback: function (payload) {
    logTicketEvent('onTicketDelete', payload);
  },

  onConversationCreateCallback: function (payload) {
    logConversationEvent('onConversationCreate', payload);
  },

  onConversationUpdateCallback: function (payload) {
    logConversationEvent('onConversationUpdate', payload);
  },

  onConversationDeleteCallback: function (payload) {
    logConversationEvent('onConversationDelete', payload);
  },

  onCannedResponseCreateCallback: function (payload) {
    logCannedResponseEvent('onCannedResponseCreate', payload);
  },

  onCannedResponseUpdateCallback: function (payload) {
    logCannedResponseEvent('onCannedResponseUpdate', payload);
  },

  onCannedResponseDeleteCallback: function (payload) {
    logCannedResponseEvent('onCannedResponseDelete', payload);
  },

  onTicketFieldCreateCallback: function (payload) {
    logTicketFieldEvent('onTicketFieldCreate', payload);
  },

  onTicketFieldDeleteCallback: function (payload) {
    logTicketFieldEvent('onTicketFieldDelete', payload);
  },

  onTimeEntryCreateCallback: function (payload) {
    logTimeEntryEvent('onTimeEntryCreate', payload);
  },

  onTimeEntryUpdateCallback: function (payload) {
    logTimeEntryEvent('onTimeEntryUpdate', payload);
  },

  onTimeEntryDeleteCallback: function (payload) {
    logTimeEntryEvent('onTimeEntryDelete', payload);
  },

  onChatConversationCreateCallback: function (payload) {
    logChatConversationEvent('onConversationCreate', payload);
  },

  onChatConversationUpdateCallback: function (payload) {
    logChatConversationEvent('onConversationUpdate', payload);
  },

  onMessageCreateCallback: function (payload) {
    logMessageEvent('onMessageCreate', payload);
  },

  onAgentActivityCreateCallback: function (payload) {
    logAgentActivityEvent('onAgentActivityCreate', payload);
  },

  onCallCreateCallback: function (payload) {
    logCallEvent('onCallCreate', payload);
  },

  onCallUpdateCallback: function (payload) {
    logCallEvent('onCallUpdate', payload);
  },

  smiEcho: function (args) {
    renderData(null, {
      echo: args.message || 'ok',
      received_at: Date.now(),
      iparams_present: Boolean(args.iparams)
    });
  },

  fetchScheduleDetails: async function (args) {
    try {
      const schedule = await $schedule.fetch({
        name: args.name || RECURRING_SCHEDULE
      });
      renderData(null, schedule);
    } catch {
      renderData({ status: 404, message: 'Schedule not found' });
    }
  },

  updateScheduleDemo: async function (args) {
    try {
      const scheduleAt = args.schedule_at || new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const updated = await $schedule.update({
        name: args.name || RECURRING_SCHEDULE,
        data: args.data || { task_id: 10001 },
        schedule_at: scheduleAt,
        repeat: args.repeat || {
          time_unit: 'hours',
          frequency: 1
        }
      });
      renderData(null, updated);
    } catch {
      renderData({ status: 400, message: 'Failed to update schedule' });
    }
  },

  getJobDetails: async function (args) {
    if (!args.job_id) {
      renderData({ status: 400, message: 'job_id is required' });
      return;
    }

    try {
      const job = await $job.get(args.job_id);
      renderData(null, job);
    } catch {
      renderData({ status: 404, message: 'Job not found' });
    }
  },

  listJobHistory: async function (args) {
    try {
      const history = await $job.history({
        tag: args.tag || 'finsecure_batch',
        page: args.page || 1,
        limit: args.limit || 10
      });
      renderData(null, history);
    } catch {
      renderData({ status: 400, message: 'Failed to fetch job history' });
    }
  },

  bulkTicket: async function (args) {
    await $job.updateStatusMessage('Started processing bulk ticket import…');

    const batchSize = (args && args.batch_size) || 10;
    console.info('[FinSecure] bulkTicket job running', { batch_size: batchSize });

    await $job.updateStatusMessage('Processed ' + batchSize + ' records');
    await $job.updateStatusMessage('The job is completed successfully');
  },

  validateUserMultipleDigits: function (request) {
    const response = VIP_IVR_CODES.includes(request.input) ? 'valid' : 'invalid';
    renderData(null, {
      data: {
        response: response,
        app_variables: {}
      }
    });
  },

  validateIncomingCaller: function (request) {
    const response = VIP_CALLER_NUMBERS.includes(request.input) ? 'vip' : 'standard';
    renderData(null, {
      data: {
        response: response,
        app_variables: {
          caller_type: response
        }
      }
    });
  }
};
