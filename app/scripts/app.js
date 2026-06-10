const appState = {
  client: null,
  latestJobId: ''
};

function writeOutput(label, value) {
  const output = document.getElementById('output');
  output.textContent = label + '\n' + JSON.stringify(value, null, 2);
}

function bind(id, handler) {
  document.getElementById(id).addEventListener('click', handler);
}

async function invokeSMI(method, payload) {
  const result = await appState.client.request.invoke(method, payload || {});
  return result.response;
}

async function initApp() {
  appState.client = await app.initialized();
  writeOutput('Ready', { message: 'Client initialized' });

  bind('btn-smi-echo', async function () {
    const message = document.getElementById('smi-message').value;
    const response = await invokeSMI('smiEcho', { message: message });
    writeOutput('smiEcho response', response);
  });

  bind('btn-fetch-schedule', async function () {
    const response = await invokeSMI('fetchScheduleDetails', { name: 'finsecure_sla_scan' });
    writeOutput('fetchScheduleDetails response', response);
  });

  bind('btn-update-schedule', async function () {
    const response = await invokeSMI('updateScheduleDemo', {
      name: 'finsecure_sla_scan',
      data: { task_id: 10001 }
    });
    writeOutput('updateScheduleDemo response', response);
  });

  bind('btn-run-job', async function () {
    const result = await appState.client.job.invoke('bulkTicket', 'finsecure_batch', {
      batch_size: 25
    });
    appState.latestJobId = result.id || (result.response && result.response.id) || '';
    document.getElementById('job-id').textContent = appState.latestJobId
      ? 'Latest job id: ' + appState.latestJobId
      : 'Job invoked (id not returned in local dev)';
    document.getElementById('btn-poll-job').disabled = !appState.latestJobId;
    writeOutput('bulkTicket invoke response', result);
  });

  bind('btn-poll-job', async function () {
    if (!appState.latestJobId) {
      return;
    }
    const job = await appState.client.job.get(appState.latestJobId);
    writeOutput('client.job.get response', job);
  });

  bind('btn-job-history', async function () {
    const response = await invokeSMI('listJobHistory', {
      tag: 'finsecure_batch',
      page: 1,
      limit: 10
    });
    writeOutput('listJobHistory response', response);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initApp().catch(function (error) {
    writeOutput('Init error', { message: String(error) });
  });
});
