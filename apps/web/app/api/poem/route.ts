import { defineFlow, runFlow } from '@genkit-ai/flow';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import {genkit} from "genkit";

const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash'),
});

export const poemFlow = defineFlow(
  {
    name: 'poemFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (topic) => {
    const llmResponse = await ai.generate({
      prompt: `Write a short poem about ${topic}`,
    });

    return llmResponse.text;
  }
);

export async function POST(req: Request) {
  const { topic } = await req.json();
  const poem = await runFlow(poemFlow, topic);
  return new Response(JSON.stringify({ poem }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
