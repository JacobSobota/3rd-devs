import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import fs from 'fs/promises';
import path from 'path';

interface TestData {
  question: string;
  answer: number;
  test?: {
    q: string;
    a: string;
  };
}

interface JsonStructure {
  apikey: string;
  description: string;
  copyright: string;
  "test-data": TestData[];
}

async function answerQuestion(question: string): Promise<string> {
  const openai = new OpenAI();

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: "You are an assistant that answers questions with the correct answer. Please respond with the answer only. Don't include any other text or punctuation." },
    { role: "user", content: question }
  ];

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o",
      max_tokens: 500,
      temperature: 0.7,
    });

    return chatCompletion.choices[0].message?.content || "I couldn't generate an answer.";
  } catch (error) {
    console.error("Error in answerQuestion:", error);
    return "Sorry, I encountered an error while trying to answer the question.";
  }
}

async function validateAndCorrectMath(): Promise<void> {
  try {
    // Check if file exists
    const jsonPath = path.join(__dirname, 'json.json');
    const correctedJsonPath = path.join(__dirname, 'corrected.json');

    try {
      await fs.access(jsonPath);
    } catch {
      throw new Error('json.json file not found in tasks/01 directory');
    }

    // Read and parse the JSON file
    const jsonContent = await fs.readFile(jsonPath, 'utf-8');
    const data: JsonStructure = JSON.parse(jsonContent);
    
    // Process all test data
    const correctedData = {
      ...data,
      "test-data": await Promise.all(data["test-data"].map(async item => {
        // Process math questions
        if (item.question && item.answer !== undefined) {
          const mathExpression = item.question.trim();
          const correctAnswer = eval(mathExpression);
          
          if (correctAnswer !== item.answer) {
            console.log(`Correcting: ${item.question}`);
            console.log(`Original answer: ${item.answer}`);
            console.log(`Corrected to: ${correctAnswer}\n`);
            item.answer = correctAnswer;
          }
        }

        if (item.test?.q && item.test?.a) {
          const answer = await answerQuestion(item.test.q);

          console.log(`Updating test answer for: ${item.test.q}`);
          console.log(`Answer: ${answer}\n`);
          item.test.a = answer;
        }

        return item;
      }))
    };

    // Save corrected data back to file
    await fs.writeFile(
      correctedJsonPath,
      JSON.stringify(correctedData, null, 2),
      'utf-8'
    );

    console.log('Validation and correction completed successfully');
    
    // Log statistics
    const totalQuestions = correctedData["test-data"].length;
    console.log(`Total questions processed: ${totalQuestions}`);

  } catch (error) {
    console.error('Error processing math questions:', error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    await validateAndCorrectMath();
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

export default main;