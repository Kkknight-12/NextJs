import dotenv from 'dotenv';
import path from 'path';
import type { InitOptions } from 'payload/config';
import payload, { Payload } from 'payload';

// Load .env file
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

// cache the payload
let cached = (global as any).payload;

// if the payload is not cached, cache it
if (!cached) {
  cached = (global as any).payload = {
    // set the client to null
    // this will be set to the client once the promise resolves
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}
// get the payload client
// this will access to database
export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  //
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is not defined');
  }

  if (cached.client) {
    return cached.client;
  }

  // if (!cached.promise) {
  //   cached.promise = import("payload").then(async ({ init }) => {
  //     const client = await init({
  //       secret: process.env.PAYLOAD_SECRET,
  //       mongoURL: process.env.MONGO_URL,
  //       ...(initOptions || {}),
  //     });
  //
  //     cached.client = client;
  //
  //     return client;
  //   });
  // }
  if (!cached.promise) {
    cached.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: !initOptions?.express,
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(error);
    throw error;
  }

  return cached.client;
};