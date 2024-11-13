import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeCaptcha(question: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Answer the question: ${question}. The answer should be minimalistic and concise. Only numerical answers are valid.`
          }
        ],
        temperature: 0
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('Error analyzing captcha:', error);
      throw error;
    }
  }
}