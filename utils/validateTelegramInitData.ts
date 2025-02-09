import crypto from 'crypto';
import querystring from 'querystring';

import { logger, LoggerType } from './logger';
import { MILLISECONDS_IN_SECOND, ONE_DAY_IN_SECONDS } from '../constants/common.constants';

export const validateTelegramInitData = (initData: string): boolean => {
  // Get the bot token
  const botToken = process.env.TG_BOT_TOKEN;
  if (!botToken) {
    logger({ type: LoggerType.Error, message: 'TG_BOT_TOKEN is not defined' });
    return false;
  }

  // Let's parse the data (where the values will be URL-encoded)
  const parsed = querystring.parse(initData);

  // Make sure that hash exists and is a string
  if (typeof parsed.hash !== 'string') {
    logger({ type: LoggerType.Error, message: 'Hash not found or invalid' });
    return false;
  }
  const receivedHash = parsed.hash;

  // Remove hash field
  delete parsed.hash;

  // Sort keys and generate a data-check string
  const sortedKeys = Object.keys(parsed).sort();
  const dataCheckString = sortedKeys.map((key) => `${key}=${parsed[key]}`).join('\n');

  // Calculate the secret key as HMAC-SHA256 from botToken using “WebAppData” as the key
  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

  // Calculate the HMAC-SHA256 from dataCheckString using the received secret key
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (computedHash !== receivedHash) {
    logger({ type: LoggerType.Error, message: 'Hash mismatch. Data is not valid.' });
    return false;
  }

  // Additional auth_date check (if required)
  if (!!parsed?.auth_date) {
    const authDateNum = Number(parsed.auth_date);

    if (isNaN(authDateNum)) {
      logger({ type: LoggerType.Error, message: 'Invalid auth_date value' });
      return false;
    }

    const now = Math.floor(Date.now() / MILLISECONDS_IN_SECOND);
    if (now - authDateNum > ONE_DAY_IN_SECONDS) {
      logger({ type: LoggerType.Error, message: 'auth_date is too old' });
      return false;
    }
  }

  return true;
};
