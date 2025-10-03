import {defineFlow, runFlow} from '@genkit-ai/flow';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'zod';
import {genkit} from "genkit";

const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash'),
});


const HomeSchema = z.object({
  town: z.string(),
  description: z.string(),
  value: z.number()
});

const extractionFlow = defineFlow(
  {
    name: 'extractionFlow',
    inputSchema: z.string().url(),
    outputSchema: HomeSchema
  },


  async (url) => {
    const pageResponse = await fetch(url);
    const pageContent = await pageResponse.text();

    const {output} = await ai.generate({
      prompt: `Given the following HTML from a finn.no real estate page, please extract the town, description, and value (price).
      HTML: ${pageContent}`,
      output: {schema: HomeSchema},
    });
    if (output == null) {
      throw new Error("Response doesn't satisfy schema.");
    }
    return output;

  }
);

export async function POST(req: Request) {
  const {url} = await req.json();
  const home = await runFlow(extractionFlow, url);
  return new Response(JSON.stringify({home}), {
    headers: {'Content-Type': 'application/json'},
  });
}
