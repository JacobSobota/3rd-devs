import OpenAI from "openai";
import axios from "axios";

const fetchAndCensorData = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url);
    const text = response.data;

    const censoredText = await censorTextWithAI(text);

    await axios.post("https://centrala.ag3nts.org/report", {
      task: "CENZURA",
      apikey: "112e2a39-2a13-44aa-9e6c-1aedd31cc78c",
      answer: censoredText,
    });

    return censoredText;
  } catch (error) {
    console.error("Error fetching the file:", error);
    throw error;
  }
};

const censorTextWithAI = async (text: string): Promise<string> => {
  const openai = new OpenAI();

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are an AI assistant that censor text." },
      {
        role: "user",
        content: `
        Censor the following text: ${text}
        Core Rules:
        - Censored text should be changed to: CENZURA
        - Remember about punctuation marks, you can't change them
        `,
      },
    ],
    max_tokens: 1000,
    temperature: 0.5,
  });

  return (
    chatCompletion.choices[0].message?.content ||
    "I couldn't generate an answer."
  );
};

const main = async () => {
  try {
    await fetchAndCensorData(
      "https://centrala.ag3nts.org/data/112e2a39-2a13-44aa-9e6c-1aedd31cc78c/cenzura.txt"
    );
  } catch (error) {
    console.error("Error in main:", error);
    process.exit(1);
  }
};

export default main;
