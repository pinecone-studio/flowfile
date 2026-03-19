import type { EnvWithDb, WorkflowNotification } from './workflow.types';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendNotificationViaBrevo(
  env: EnvWithDb,
  notification: WorkflowNotification,
) {
  const apiKey = env.BREVO_API_KEY?.trim();
  const fromEmail = env.BREVO_FROM_EMAIL?.trim();

  if (!apiKey || !fromEmail) {
    return false;
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
        name: env.BREVO_FROM_NAME?.trim() || 'EPAS',
      },
      to: [{ email: notification.to }],
      subject: notification.subject,
      textContent: notification.text,
      htmlContent: notification.html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Brevo failed with status ${response.status}`);
  }

  return true;
}

export const emitWorkflowNotifications = async (
  env: EnvWithDb,
  notifications: WorkflowNotification[],
) => {
  for (const notification of notifications) {
    try {
      const sentWithBrevo = await sendNotificationViaBrevo(env, notification);

      if (!sentWithBrevo) {
        console.log('WORKFLOW_NOTIFICATION', JSON.stringify(notification));
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
