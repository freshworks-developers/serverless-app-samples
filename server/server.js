const eventLog = require('./lib/event-log');

const SCHEDULE_NAME = 'serverless_demo_schedule';
const INSTALL_META_KEY = 'install_meta';

async function recordEvent(event, summary, meta) {
  await eventLog.appendEventLog({ event, summary, meta: meta || {} });
}

async function runScheduledProbe(iparams) {
  if (iparams?.subdomain && iparams?.api_key) {
    const result = await $request.invokeTemplate('listTickets', {
      context: {},
      query: { per_page: 1, order_by: 'updated_at', order_type: 'desc' }
    });
    const tickets = JSON.parse(result.response || '[]');
    await $db.update(INSTALL_META_KEY, 'set', {
      lastScheduledSync: new Date().toISOString(),
      lastTicketCount: tickets.length
    });
    return { source: 'listTickets', count: tickets.length };
  }

  const result = await $request.invokeTemplate('healthCheck', {});
  return { source: 'healthCheck', status: result.statusCode };
}

async function fetchTicketDetail(ticketId) {
  const result = await $request.invokeTemplate('getTicket', {
    context: { ticket_id: ticketId }
  });
  return JSON.parse(result.response || '{}');
}

async function syncCreatedTicket(iparams, ticketId, subject) {
  if (!iparams?.subdomain || !iparams?.api_key || !ticketId) {
    return null;
  }

  const fetched = await fetchTicketDetail(ticketId);
  await $db.update(INSTALL_META_KEY, 'set', {
    lastTicketCreate: {
      id: ticketId,
      subject: fetched.subject || subject,
      syncedAt: new Date().toISOString()
    }
  });
  return fetched;
}

exports = {
  onAppInstallHandler: async function (args) {
    console.info('onAppInstallHandler:', JSON.stringify(args));

    try {
      const scheduleAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      const { status } = await $schedule.create({
        name: SCHEDULE_NAME,
        schedule_at: scheduleAt,
        repeat: { time_unit: 'minutes', frequency: 5 },
        data: { event_info: 'app_install', tenant: args.iparams?.subdomain || 'demo' }
      });

      if (status !== 200) {
        throw new Error('Unable to create demo schedule');
      }

      const targetUrl = await generateTargetUrl();
      console.info('External event target URL:', targetUrl);

      await $db.set(INSTALL_META_KEY, {
        installedAt: new Date().toISOString(),
        subdomain: args.iparams?.subdomain || null,
        scheduleName: SCHEDULE_NAME
      });

      await recordEvent('onAppInstall', 'Schedule and external URL registered', {
        schedule: SCHEDULE_NAME
      });

      renderData();
    } catch (error) {
      console.error('onAppInstall failed:', error);
      renderData({ message: String(error.message) });
    }
  },

  afterAppUpdateHandler: async function (args) {
    console.info('afterAppUpdateHandler:', JSON.stringify(args));

    try {
      const schedule = await $schedule.fetch({ name: SCHEDULE_NAME });
      if (!schedule) {
        throw new Error('Demo schedule missing after upgrade');
      }

      const meta = await $db.get(INSTALL_META_KEY);
      await $db.update(INSTALL_META_KEY, 'set', {
        lastUpgradedAt: new Date().toISOString(),
        previousVersion: args.version || null
      });

      await recordEvent('afterAppUpdate', 'Schedule validated post-upgrade', {
        schedule: schedule.name,
        installMeta: meta
      });

      renderData();
    } catch (error) {
      console.error('afterAppUpdate failed:', error);
      renderData({ message: error.message });
    }
  },

  onAppUninstallHandler: async function (args) {
    console.info('onAppUninstallHandler:', JSON.stringify(args));

    try {
      await $schedule.delete({ name: SCHEDULE_NAME });
    } catch (error) {
      console.warn('Schedule cleanup skipped:', error.message);
    }

    try {
      await eventLog.clearEventLog();
      await $db.delete(INSTALL_META_KEY);
    } catch (error) {
      console.warn('Datastore cleanup skipped:', error.message);
    }

    renderData();
  },

  onScheduledEventHandler: async function (args) {
    console.info('onScheduledEventHandler:', JSON.stringify(args));

    try {
      const probe = await runScheduledProbe(args.iparams);
      await recordEvent('onScheduledEvent', 'Recurring sync tick', {
        payload: args.data || {},
        probe
      });
    } catch (error) {
      console.error('onScheduledEvent failed:', error);
      await recordEvent('onScheduledEvent', 'Scheduled handler failed', {
        error: error.message
      });
    }
  },

  onExternalEventHandler: async function (args) {
    console.info('onExternalEventHandler:', JSON.stringify(args));

    try {
      await recordEvent('onExternalEvent', 'Webhook payload received', {
        headers: args.headers || {},
        body: args.data || {}
      });
    } catch (error) {
      console.error('onExternalEvent log failed:', error);
    }
  },

  onTicketCreateHandler: async function (args) {
    console.info('onTicketCreateHandler:', JSON.stringify(args));

    try {
      const ticket = args.data?.ticket || {};
      const ticketId = ticket.id;
      const subject = ticket.subject || '(no subject)';

      await recordEvent('onTicketCreate', 'Ticket #' + ticketId + ': ' + subject, {
        product: args.event,
        priority: ticket.priority,
        status: ticket.status
      });

      const fetched = await syncCreatedTicket(args.iparams, ticketId, subject);
      renderData(null, { success: true, ticketId, enriched: Boolean(fetched) });
    } catch (error) {
      console.error('onTicketCreate failed:', error);
      await recordEvent('onTicketCreate', 'Handler error', { error: error.message });
      renderData({ status: error.status || 500, message: error.message });
    }
  },

  onAgentCreateHandler: async function (args) {
    const name = args.data?.agent?.name || 'unknown';
    console.info('onAgentCreateHandler: Hello ' + name);

    try {
      await recordEvent('onAgentCreate', 'Agent created: ' + name, {
        agentId: args.data?.agent?.id
      });
    } catch (error) {
      console.error('onAgentCreate log failed:', error);
    }
  },

  onCompanyCreateCallback: async function (args) {
    console.info('onCompanyCreateCallback:', JSON.stringify(args));

    try {
      const company = args.data?.company || {};
      await recordEvent('onCompanyCreate', 'Company: ' + (company.name || 'unknown'), {
        companyId: company.id
      });
    } catch (error) {
      console.error('onCompanyCreate log failed:', error);
    }
  },

  onConversationCreateCallback: async function (args) {
    console.info('onConversationCreateCallback:', JSON.stringify(args));

    try {
      const conversation = args.data?.conversation || {};
      await recordEvent('onConversationCreate', 'Conversation on ticket', {
        conversationId: conversation.id,
        ticketId: conversation.ticket_id
      });
    } catch (error) {
      console.error('onConversationCreate log failed:', error);
    }
  },

  onCallCreateCallback: async function (args) {
    console.info('onCallCreateCallback:', JSON.stringify(args));

    try {
      const call = args.data?.call || {};
      await recordEvent('onCallCreate', 'Call logged', {
        callId: call.id,
        direction: call.direction
      });
    } catch (error) {
      console.error('onCallCreate log failed:', error);
    }
  },

  getEventLog: async function () {
    try {
      const log = await eventLog.getLogRecord();
      renderData(null, { success: true, entries: log.entries || [] });
    } catch (error) {
      renderData({ status: error.status || 500, message: error.message });
    }
  }
};
