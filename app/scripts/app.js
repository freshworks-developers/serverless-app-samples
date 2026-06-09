const HANDLERS = [
  { event: 'onAppInstall', apis: '$schedule.create, generateTargetUrl, $db.set' },
  { event: 'afterAppUpdate', apis: '$schedule.fetch, $db.update' },
  { event: 'onAppUninstall', apis: '$schedule.delete, $db.delete' },
  { event: 'onScheduledEvent', apis: '$request.invokeTemplate, $db.update' },
  { event: 'onExternalEvent', apis: '$db event log' },
  { event: 'onTicketCreate', apis: '$request.invokeTemplate, $db.update' },
  { event: 'onAgentCreate', apis: 'Freshdesk agent event' },
  { event: 'onCompanyCreate', apis: 'Freshdesk company event' },
  { event: 'onConversationCreate', apis: 'Freshdesk / Freshservice / Freshchat' },
  { event: 'onCallCreate', apis: 'Freshcaller call module' }
];

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    renderHandlerList();
    initApp();
  }
};

function renderHandlerList() {
  const list = document.getElementById('handler-status');
  list.innerHTML = HANDLERS.map(function (item) {
    return '<li><strong>' + item.event + '</strong> — ' + item.apis + '</li>';
  }).join('');
}

function setLogStatus(type, message) {
  const statusEl = document.getElementById('log-status');
  statusEl.setAttribute('type', type);
  statusEl.textContent = message;
}

function initApp() {
  app.initialized()
    .then(function (client) {
      window.client = client;
      document.getElementById('refresh-log').addEventListener('fwClick', loadEventLog);
      loadEventLog();
    })
    .catch(handleErr);
}

function loadEventLog() {
  const logEl = document.getElementById('event-log');
  setLogStatus('info', 'Loading event log from server…');

  client.request.invoke('getEventLog', {})
    .then(function (response) {
      const payload = response && response.response ? response.response : response;
      const entries = (payload && payload.entries) || [];

      if (!entries.length) {
        logEl.innerHTML = '<li class="empty">No events yet — run <code>fdk run</code> and simulate handlers.</li>';
        setLogStatus('warning', 'Event log empty. Trigger serverless events to populate $db.');
        return;
      }

      logEl.innerHTML = entries.map(function (entry) {
        return '<li><span class="ts">' + entry.timestamp + '</span> ' +
          '<strong>' + entry.event + '</strong>: ' + entry.summary + '</li>';
      }).join('');
      setLogStatus('success', entries.length + ' event(s) in datastore.');
    })
    .catch(function (err) {
      logEl.innerHTML = '';
      setLogStatus('error', 'Failed to load log: ' + (err.message || 'unknown error'));
    });
}

function handleErr(err) {
  console.error('EventPulse UI error:', err);
}
