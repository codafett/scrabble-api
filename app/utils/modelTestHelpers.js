import {
  Client,
} from '../models';

export function createTestClient(data) {
  let client = new Client();
  client.name = 'client';
  client = Object.assign(client, data);
  return client;
}

export async function createTestClientAndSave(data) {
  const client = createTestClient(data);
  await client.save();
  return client;
}
