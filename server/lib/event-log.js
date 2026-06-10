const EVENT_LOG_KEY = 'event_log';
const MAX_LOG_ENTRIES = 50;

async function getLogRecord() {
  try {
    const record = await $db.get(EVENT_LOG_KEY);
    return record || { entries: [] };
  } catch (err) {
    if (err.status === 404) {
      return { entries: [] };
    }
    throw err;
  }
}

async function appendEventLog(entry) {
  const log = await getLogRecord();
  const entries = Array.isArray(log.entries) ? log.entries : [];
  entries.unshift({
    timestamp: new Date().toISOString(),
    ...entry
  });
  const trimmed = entries.slice(0, MAX_LOG_ENTRIES);

  try {
    await $db.update(EVENT_LOG_KEY, 'set', { entries: trimmed });
  } catch (err) {
    if (err.status === 404) {
      await $db.set(EVENT_LOG_KEY, { entries: trimmed });
      return;
    }
    throw err;
  }
}

async function clearEventLog() {
  try {
    await $db.delete(EVENT_LOG_KEY);
  } catch (err) {
    if (err.status !== 404) {
      throw err;
    }
  }
}

exports = {
  EVENT_LOG_KEY,
  getLogRecord,
  appendEventLog,
  clearEventLog
};
