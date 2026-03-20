import type {
  EnvWithDb,
  WorkflowNotification,
  WorkflowNotificationDelivery,
} from './workflow.types';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const DEFAULT_MAILCHANNELS_API_URL = 'https://api.mailchannels.net/tx/v1/send';

type SendResult =
  | {
      status: 'sent';
      provider: 'brevo' | 'mailchannels';
    }
  | {
      status: 'not_configured';
      reason: string;
    };

function readOptionalEnv(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function sendNotificationViaBrevo(
  env: EnvWithDb,
  notification: WorkflowNotification,
): Promise<SendResult> {
  const apiKey = readOptionalEnv(env.BREVO_API_KEY);
  const fromEmail = readOptionalEnv(env.BREVO_FROM_EMAIL);

  if (!apiKey || !fromEmail) {
    return {
      status: 'not_configured',
      reason:
        'BREVO_API_KEY or BREVO_FROM_EMAIL is missing in the worker environment',
    };
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        email: fromEmail,
        name: readOptionalEnv(env.BREVO_FROM_NAME) || 'EPAS',
      },
      to: [{ email: notification.to }],
      subject: notification.subject,
      textContent: notification.text,
      htmlContent: notification.html,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `Brevo failed with status ${response.status}${
        responseText ? `: ${responseText}` : ''
      }`,
    );
  }

  return {
    status: 'sent',
    provider: 'brevo',
  };
}

async function sendNotificationViaMailChannels(
  env: EnvWithDb,
  notification: WorkflowNotification,
): Promise<SendResult> {
  const apiKey = readOptionalEnv(env.MAILCHANNELS_API_KEY);
  const fromEmail =
    readOptionalEnv(env.MAIL_FROM_EMAIL) ||
    readOptionalEnv(env.BREVO_FROM_EMAIL);

  if (!apiKey || !fromEmail) {
    return {
      status: 'not_configured',
      reason:
        'MAILCHANNELS_API_KEY or MAIL_FROM_EMAIL/BREVO_FROM_EMAIL is missing in the worker environment',
    };
  }

  const response = await fetch(
    readOptionalEnv(env.MAILCHANNELS_API_URL) || DEFAULT_MAILCHANNELS_API_URL,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: notification.to }],
          },
        ],
        from: {
          email: fromEmail,
          name:
            readOptionalEnv(env.MAIL_FROM_NAME) ||
            readOptionalEnv(env.BREVO_FROM_NAME) ||
            'EPAS',
        },
        reply_to: readOptionalEnv(env.MAIL_REPLY_TO)
          ? { email: readOptionalEnv(env.MAIL_REPLY_TO) }
          : undefined,
        subject: notification.subject,
        content: [
          {
            type: 'text/plain',
            value: notification.text,
          },
          {
            type: 'text/html',
            value: notification.html,
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `MailChannels failed with status ${response.status}${
        responseText ? `: ${responseText}` : ''
      }`,
    );
  }

  return {
    status: 'sent',
    provider: 'mailchannels',
  };
}

async function sendWorkflowNotification(
  env: EnvWithDb,
  notification: WorkflowNotification,
): Promise<SendResult> {
  const notConfiguredReasons: string[] = [];
  const providerErrors: string[] = [];

  try {
    const brevoResult = await sendNotificationViaBrevo(env, notification);

    if (brevoResult.status === 'sent') {
      return brevoResult;
    }

    notConfiguredReasons.push(brevoResult.reason);
  } catch (error) {
    providerErrors.push(
      error instanceof Error
        ? error.message
        : 'Unknown Brevo notification error',
    );
  }

  try {
    const mailChannelsResult = await sendNotificationViaMailChannels(
      env,
      notification,
    );

    if (mailChannelsResult.status === 'sent') {
      return mailChannelsResult;
    }

    notConfiguredReasons.push(mailChannelsResult.reason);
  } catch (error) {
    providerErrors.push(
      error instanceof Error
        ? error.message
        : 'Unknown MailChannels notification error',
    );
  }

  if (providerErrors.length > 0) {
    throw new Error([...providerErrors, ...notConfiguredReasons].join(' | '));
  }

  return {
    status: 'not_configured',
    reason: notConfiguredReasons.join(' | '),
  };
}

export const emitWorkflowNotifications = async (
  env: EnvWithDb,
  notifications: WorkflowNotification[],
) => {
  const deliveries: WorkflowNotificationDelivery[] = [];

  for (const notification of notifications) {
    try {
      const sendResult = await sendWorkflowNotification(env, notification);

      if (sendResult.status === 'not_configured') {
        deliveries.push({
          type: notification.type,
          to: notification.to,
          subject: notification.subject,
          status: 'not_configured',
          errorMessage: sendResult.reason,
        });
        console.log('WORKFLOW_NOTIFICATION', JSON.stringify(notification));
        continue;
      }

      deliveries.push({
        type: notification.type,
        to: notification.to,
        subject: notification.subject,
        status: 'sent',
        provider: sendResult.provider,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown notification error';

      deliveries.push({
        type: notification.type,
        to: notification.to,
        subject: notification.subject,
        status: 'failed',
        errorMessage: message,
      });
      console.error(
        'WORKFLOW_NOTIFICATION_FAILED',
        JSON.stringify({
          to: notification.to,
          type: notification.type,
          message,
        }),
      );
      console.log('WORKFLOW_NOTIFICATION', JSON.stringify(notification));
    }
  }

  return deliveries;
};
