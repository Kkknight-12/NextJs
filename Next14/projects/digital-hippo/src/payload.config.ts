import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';
import { buildConfig } from 'payload/config';
import { Users } from './collections/Users';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_URL || '',
  collections: [Users],
  routes: {
    admin: '/sell',
  },
  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- DigitalHippo',
      favicon: '/favicon.ico',
      ogImage: '/thumbnail.jpg',
    },
  },
  // rate limit the API
  // this is optional
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL || '',
  }),
  // set the output file for the typescript types
  // this is optional
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});