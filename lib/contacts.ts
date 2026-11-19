// Private contact capture. Emails are written ONLY to the private contacts table,
// which the app can write but never read, and which the factory cannot touch.
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, CONTACTS_TABLE } from './db';

export async function saveContact(requestId: number, name: string, email: string): Promise<void> {
  await ddb.send(new PutCommand({
    TableName: CONTACTS_TABLE,
    Item: {
      id: `${requestId}-${crypto.randomUUID()}`,
      requestId,
      name,
      email,
      consent: 'follow-up about how this was built / factory conversation',
      createdAt: new Date().toISOString(),
    },
  }));
}
