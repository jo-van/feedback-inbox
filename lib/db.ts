// DynamoDB access. On Vercel, credentials come from keyless OIDC federation
// (AWS_ROLE_ARN); elsewhere the default AWS credential chain is used.
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { awsCredentialsProvider } from '@vercel/functions/oidc';

const region = process.env.FF_AWS_REGION || 'us-east-1';

export const TABLE = process.env.FF_TABLE || 'feedback-factory-preview';
export const CONTACTS_TABLE = process.env.FF_CONTACTS_TABLE || 'feedback-factory-preview-contacts';

const roleArn = process.env.FF_AWS_ROLE_ARN;

export const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region,
    ...(roleArn ? { credentials: awsCredentialsProvider({ roleArn }) } : {}),
  }),
  { marshallOptions: { removeUndefinedValues: true } },
);
