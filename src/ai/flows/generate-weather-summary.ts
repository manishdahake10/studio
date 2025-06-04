'use server';

/**
 * @fileOverview AI flow to generate a concise weather summary.
 *
 * - generateWeatherSummary - A function that generates the weather summary.
 * - GenerateWeatherSummaryInput - The input type for the generateWeatherSummary function.
 * - GenerateWeatherSummaryOutput - The return type for the generateWeatherSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWeatherSummaryInputSchema = z.object({
  city: z.string().describe('The city for which to generate the weather summary.'),
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity percentage.'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
  precipitation: z.string().describe('The current precipitation conditions (e.g., rain, snow, sunny).'),
  dayOfWeek: z.string().describe('The current day of the week.'),
});
export type GenerateWeatherSummaryInput = z.infer<typeof GenerateWeatherSummaryInputSchema>;

const GenerateWeatherSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, human-readable summary of the current weather conditions.'),
});
export type GenerateWeatherSummaryOutput = z.infer<typeof GenerateWeatherSummaryOutputSchema>;

export async function generateWeatherSummary(input: GenerateWeatherSummaryInput): Promise<GenerateWeatherSummaryOutput> {
  return generateWeatherSummaryFlow(input);
}

const shouldIncludeDayOfWeekTool = ai.defineTool({
  name: 'shouldIncludeDayOfWeek',
  description: 'Determines if the day of the week is relevant to the weather summary based on the precipitation patterns.',
  inputSchema: z.object({
    city: z.string().describe('The city for which the weather summary is generated.'),
    dayOfWeek: z.string().describe('The current day of the week.'),
    precipitation: z.string().describe('The current precipitation conditions (e.g., rain, snow, sunny).'),
  }),
  outputSchema: z.boolean().describe('True if the day of the week should be included in the weather summary, false otherwise.'),
}, async (input) => {
  // In a real application, this would involve querying a database or an external API
  // to determine if the precipitation pattern is day-specific for the given city.
  // For this example, we'll just return true if the precipitation is rain and the day is Tuesday.
  return input.precipitation.toLowerCase().includes('rain') && input.dayOfWeek.toLowerCase() === 'tuesday';
});

const prompt = ai.definePrompt({
  name: 'generateWeatherSummaryPrompt',
  input: {schema: GenerateWeatherSummaryInputSchema},
  output: {schema: GenerateWeatherSummaryOutputSchema},
  tools: [shouldIncludeDayOfWeekTool],
  prompt: `You are a helpful weather reporter that creates concise weather summaries for the city of {{city}}. Include the temperature, precipitation, and wind speed in the summary. 

  {% if (await shouldIncludeDayOfWeekTool({city: city, dayOfWeek: dayOfWeek, precipitation: precipitation})) %} Since it is {{dayOfWeek}},  {% endif %} summarize the weather as:
  Temperature: {{temperature}}°C
  Humidity: {{humidity}}%
  Wind Speed: {{windSpeed}} km/h
  Precipitation: {{precipitation}}
  `,
});

const generateWeatherSummaryFlow = ai.defineFlow(
  {
    name: 'generateWeatherSummaryFlow',
    inputSchema: GenerateWeatherSummaryInputSchema,
    outputSchema: GenerateWeatherSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
