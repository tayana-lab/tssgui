import axios from 'axios';
import TSSGUI from '../../../conf/TssGui.json' assert { type: 'json' };

const LOG_LEVELS = {
  'DEBUG': 1,
  'INFO': 2,
  'WARN': 3,
  'ERROR': 4,
  'FATAL': 5
};

// Get current log level from config (default to INFO if missing)
const CURRENT_LOG_LEVEL = (TSSGUI.LOG_LEVEL || 'INFO').toUpperCase();

const Log = async (module = "", logType = "", logData = "") => {
  try {
    const logTypeUpper = logType.toUpperCase();

    // Check if log level is valid and meets threshold
    if (
      !(logTypeUpper in LOG_LEVELS) || 
      LOG_LEVELS[logTypeUpper] < LOG_LEVELS[CURRENT_LOG_LEVEL]
    ) {
      return; // Skip logging
    }

    const url = TSSGUI.SERVER_JS_API_URI + "/tssgui/logs";
    const formattedLogData = typeof logData === 'object' ? JSON.stringify(logData) : logData;
    const data = `${module} | ${logTypeUpper} | ${formattedLogData}`;

    await axios.post(url, data, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

  } catch (error) {
    console.error('Error sending log data:', error);
  }
};

export default Log;

