const fs = require('fs');
const path = require('path');
const vm = require('vm');

global.renderData = vi.fn();
global.$schedule = {
  create: vi.fn(() => Promise.resolve({ name: 'finsecure_sla_scan' })),
  delete: vi.fn(() => Promise.resolve({ deleted: true })),
  fetch: vi.fn(() => Promise.resolve({ name: 'finsecure_sla_scan' })),
  update: vi.fn(() => Promise.resolve({ name: 'finsecure_sla_scan' }))
};
global.$job = {
  get: vi.fn(() => Promise.resolve({ id: 'job-1', status: 'success' })),
  history: vi.fn(() => Promise.resolve({ jobs: [], total_jobs: 0 })),
  updateStatusMessage: vi.fn(() => Promise.resolve({ Updated: true }))
};
global.generateTargetUrl = vi.fn(() => Promise.resolve({ url: 'https://example.test/webhook' }));

const COMMON_EVENTS = [
  ['onAppInstall', 'onAppInstallHandler'],
  ['afterAppUpdate', 'afterAppUpdateHandler'],
  ['onAppUninstall', 'onAppUninstallHandler'],
  ['onScheduledEvent', 'onScheduledEventHandler'],
  ['onExternalEvent', 'onExternalEventHandler']
];

const SUPPORT_AGENT_EVENTS = [
  ['onAgentCreate', 'onAgentCreateHandler'],
  ['onAgentUpdate', 'onAgentUpdateCallback'],
  ['onAgentDelete', 'onAgentDeleteCallback'],
  ['onAgentStatusCreate', 'onAgentStatusCreateCallback'],
  ['onAgentStatusUpdate', 'onAgentStatusUpdateCallback'],
  ['onAgentStatusDelete', 'onAgentStatusDeleteCallback'],
  ['onAgentAvailabilityUpdate', 'onAgentAvailabilityUpdateCallback'],
  ['onGroupCreate', 'onGroupCreateCallback'],
  ['onGroupUpdate', 'onGroupUpdateCallback'],
  ['onGroupDelete', 'onGroupDeleteCallback']
];

const SUPPORT_COMPANY_EVENTS = [
  ['onCompanyCreate', 'onCompanyCreateCallback'],
  ['onCompanyUpdate', 'onCompanyUpdateCallback'],
  ['onCompanyDelete', 'onCompanyDeleteCallback']
];

const SUPPORT_TICKET_EVENTS = [
  ['onTicketCreate', 'onTicketCreateCallback'],
  ['onTicketUpdate', 'onTicketUpdateCallback'],
  ['onTicketDelete', 'onTicketDeleteCallback'],
  ['onConversationCreate', 'onConversationCreateCallback'],
  ['onConversationUpdate', 'onConversationUpdateCallback'],
  ['onConversationDelete', 'onConversationDeleteCallback'],
  ['onCannedResponseCreate', 'onCannedResponseCreateCallback'],
  ['onCannedResponseUpdate', 'onCannedResponseUpdateCallback'],
  ['onCannedResponseDelete', 'onCannedResponseDeleteCallback'],
  ['onTicketFieldCreate', 'onTicketFieldCreateCallback'],
  ['onTicketFieldDelete', 'onTicketFieldDeleteCallback'],
  ['onTimeEntryCreate', 'onTimeEntryCreateCallback'],
  ['onTimeEntryUpdate', 'onTimeEntryUpdateCallback'],
  ['onTimeEntryDelete', 'onTimeEntryDeleteCallback']
];

const SERVICE_TICKET_EVENTS = [
  ['onTicketCreate', 'onTicketCreateCallback'],
  ['onTicketUpdate', 'onTicketUpdateCallback'],
  ['onConversationCreate', 'onConversationCreateCallback']
];

const CHAT_CONVERSATION_EVENTS = [
  ['onConversationCreate', 'onChatConversationCreateCallback'],
  ['onConversationUpdate', 'onChatConversationUpdateCallback'],
  ['onMessageCreate', 'onMessageCreateCallback'],
  ['onAgentActivityCreate', 'onAgentActivityCreateCallback']
];

const CALL_EVENTS = [
  ['onCallCreate', 'onCallCreateCallback'],
  ['onCallUpdate', 'onCallUpdateCallback']
];

function loadServer() {
  const code = fs.readFileSync(path.join(__dirname, '../server/server.js'), 'utf8');
  const sandbox = {
    exports: {},
    renderData: global.renderData,
    $schedule: global.$schedule,
    $job: global.$job,
    generateTargetUrl: global.generateTargetUrl,
    console: console
  };
  vm.runInNewContext(code, sandbox, { filename: 'server.js' });
  return sandbox.exports;
}

function expectModuleEvents(manifest, moduleName, eventsList) {
  const events = manifest.modules[moduleName].events;
  eventsList.forEach(function (pair) {
    expect(events[pair[0]].handler).toBe(pair[1]);
  });
  expect(Object.keys(events).length).toBe(eventsList.length);
}

function expectPayloadFiles(folder, eventsList) {
  eventsList.forEach(function (pair) {
    const payloadPath = path.join(__dirname, '../server/test_data/' + folder + '/' + pair[0] + '.json');
    expect(fs.existsSync(payloadPath)).toBe(true);
  });
}

const server = loadServer();

describe('server.js serverless samples', function () {
  beforeEach(function () {
    vi.clearAllMocks();
  });

  test.each(SUPPORT_TICKET_EVENTS)('exports %s handler', function (_eventName, handlerName) {
    expect(typeof server[handlerName]).toBe('function');
  });

  test.each(SUPPORT_AGENT_EVENTS)('exports support_agent %s handler', function (_eventName, handlerName) {
    expect(typeof server[handlerName]).toBe('function');
  });

  test('onTicketCreateCallback logs ticket metadata', function () {
    const logSpy = vi.spyOn(console, 'info').mockImplementation(function () {});
    server.onTicketCreateCallback({
      data: {
        ticket: { id: 165, subject: 'Support Needed', status: 2, priority: 1 }
      }
    });
    expect(logSpy).toHaveBeenCalledWith('[FinSecure] onTicketCreate', {
      ticket_id: 165,
      subject: 'Support Needed',
      status: 2,
      priority: 1
    });
    logSpy.mockRestore();
  });

  test('onTimeEntryCreateCallback logs time entry metadata', function () {
    const logSpy = vi.spyOn(console, 'info').mockImplementation(function () {});
    server.onTimeEntryCreateCallback({
      data: {
        time_entry: { id: 2, ticket_id: 171, billable: true, time_spent: 43920 }
      }
    });
    expect(logSpy).toHaveBeenCalledWith('[FinSecure] onTimeEntryCreate', {
      time_entry_id: 2,
      ticket_id: 171,
      billable: true,
      time_spent: 43920
    });
    logSpy.mockRestore();
  });

  test('onAppInstallHandler creates schedules and webhook URL', async function () {
    await server.onAppInstallHandler();
    expect($schedule.create).toHaveBeenCalledTimes(2);
    expect(generateTargetUrl).toHaveBeenCalled();
    expect(renderData).toHaveBeenCalled();
  });

  test('afterAppUpdateHandler calls renderData', function () {
    server.afterAppUpdateHandler({ event: 'afterAppUpdate' });
    expect(renderData).toHaveBeenCalled();
  });

  test('smiEcho returns payload via renderData', async function () {
    await server.smiEcho({ message: 'ping' });
    expect(renderData).toHaveBeenCalledWith(null, expect.objectContaining({ echo: 'ping' }));
  });

  test('fetchScheduleDetails reads schedule by name', async function () {
    await server.fetchScheduleDetails({ name: 'finsecure_sla_scan' });
    expect($schedule.fetch).toHaveBeenCalledWith({ name: 'finsecure_sla_scan' });
  });

  test('bulkTicket updates status messages', async function () {
    await server.bulkTicket({ batch_size: 5 });
    expect($job.updateStatusMessage).toHaveBeenCalled();
  });

  test('validateUserMultipleDigits follows routing automation contract', function () {
    server.validateUserMultipleDigits({ input: '11' });
    expect(renderData).toHaveBeenCalledWith(null, {
      data: {
        response: 'valid',
        app_variables: {}
      }
    });
  });

  test('validateIncomingCaller marks VIP numbers', function () {
    server.validateIncomingCaller({ input: '+15551234567' });
    expect(renderData).toHaveBeenCalledWith(null, {
      data: {
        response: 'vip',
        app_variables: { caller_type: 'vip' }
      }
    });
  });
});

describe('manifest and actions configuration', function () {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../manifest.json'), 'utf8')
  );

  test('manifest registers all common events', function () {
    expectModuleEvents(manifest, 'common', COMMON_EVENTS);
  });

  test('manifest registers all support_agent product events', function () {
    expectModuleEvents(manifest, 'support_agent', SUPPORT_AGENT_EVENTS);
  });

  test('manifest registers all support_company product events', function () {
    expectModuleEvents(manifest, 'support_company', SUPPORT_COMPANY_EVENTS);
  });

  test('manifest registers all support_ticket product events', function () {
    expectModuleEvents(manifest, 'support_ticket', SUPPORT_TICKET_EVENTS);
  });

  test('manifest registers all service_ticket product events', function () {
    expectModuleEvents(manifest, 'service_ticket', SERVICE_TICKET_EVENTS);
  });

  test('manifest registers all chat_conversation product events', function () {
    expectModuleEvents(manifest, 'chat_conversation', CHAT_CONVERSATION_EVENTS);
  });

  test('manifest registers all call product events', function () {
    expectModuleEvents(manifest, 'call', CALL_EVENTS);
  });

  test('manifest registers SMI functions and jobs', function () {
    expect(manifest.modules.common.functions.smiEcho).toBeDefined();
    expect(manifest.modules.common.jobs.bulkTicket).toBeDefined();
    expect(manifest.modules.common.location.full_page_app.url).toBe('index.html');
  });

  test('each common event has a test payload file', function () {
    expectPayloadFiles('common', COMMON_EVENTS);
  });

  test('each support_agent event has a test payload file', function () {
    expectPayloadFiles('support_agent', SUPPORT_AGENT_EVENTS);
  });

  test('each support_company event has a test payload file', function () {
    expectPayloadFiles('support_company', SUPPORT_COMPANY_EVENTS);
  });

  test('each support_ticket event has a test payload file', function () {
    expectPayloadFiles('support_ticket', SUPPORT_TICKET_EVENTS);
  });

  test('each service_ticket event has a test payload file', function () {
    expectPayloadFiles('service_ticket', SERVICE_TICKET_EVENTS);
  });

  test('each chat_conversation event has a test payload file', function () {
    expectPayloadFiles('chat_conversation', CHAT_CONVERSATION_EVENTS);
  });

  test('each call event has a test payload file', function () {
    expectPayloadFiles('call', CALL_EVENTS);
  });

  test('actions.json defines Freshcaller routing callbacks', function () {
    const actions = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../actions.json'), 'utf8')
    );
    expect(actions.validateUserMultipleDigits.parameters.required).toEqual(['input']);
    expect(actions.validateIncomingCaller.display_name).toBeTruthy();
  });
});
