import type { EnvWithDb, WorkflowNotification } from './workflow.types';

async function sendNotificationViaWebhook(
  env: EnvWithDb,
  notification: WorkflowNotification,
) {
  if (!env.EMAIL_WEBHOOK_URL?.trim()) {
    return false;
  }

  const response = await fetch(env.EMAIL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification),
  });

  if (!response.ok) {
    throw new Error(`Email webhook failed with status ${response.status}`);
  }

  return true;
}

async function sendNotificationViaMailChannels(
  env: EnvWithDb,
  notification: WorkflowNotification,
) {
  if (!env.MAIL_FROM_EMAIL?.trim()) {
    return false;
  }

  const response = await fetch(
    env.MAILCHANNELS_API_URL?.trim() ||
      'https://api.mailchannels.net/tx/v1/send',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: notification.to }] }],
        from: {
          email: env.MAIL_FROM_EMAIL,
          name: env.MAIL_FROM_NAME?.trim() || 'EPAS',
        },
        reply_to: env.MAIL_REPLY_TO?.trim()
          ? { email: env.MAIL_REPLY_TO.trim() }
          : undefined,
        subject: notification.subject,
        content: [
          { type: 'text/plain', value: notification.text },
          { type: 'text/html', value: notification.html },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`MailChannels failed with status ${response.status}`);
  }

  return true;
}

export const emitWorkflowNotifications = async (
  env: EnvWithDb,
  notifications: WorkflowNotification[],
) => {
  for (const notification of notifications) {
    try {
      const sentWithWebhook = await sendNotificationViaWebhook(env, notification);

      if (!sentWithWebhook) {
        const sentWithMailChannels = await sendNotificationViaMailChannels(
          env,
          notification,
        );

        if (!sentWithMailChannels) {
          console.log('WORKFLOW_NOTIFICATION', JSON.stringify(notification));
        }
      }
    } catch (error) {
      console.error(
        'WORKFLOW_NOTIFICATION_FAILED',
        JSON.stringify({
          to: notification.to,
          type: notification.type,
          message:
            error instanceof Error
              ? error.message
              : 'Unknown notification error',
        }),
      );
      console.log('WORKFLOW_NOTIFICATION', JSON.stringify(notification));
    }
  }
};