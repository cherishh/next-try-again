// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const result = streamText({
//     model: openai('gpt-4-turbo'),
//     system: 'You are a helpful assistant.',
//     messages,
//   });

//   return result.toDataStreamResponse();
// }

import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log('req', req);
  const client = new OpenAI({
    // httpAgent: new SocksProxyAgent('socks5h://127.0.0.1:1086'),
    // httpAgent: new HttpsProxyAgent('http://127.0.0.1:1087'),
  });

  const response = await client.responses.create({
    model: 'gpt-4.1',
    input: 'Write a one-sentence bedtime story about a unicorn.',
  });

  console.log(response, 'response');

  return new Response('Hello, world!');

  // return response;
}
