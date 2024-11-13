export class OpenServiceAI {
  private readonly incorrectAnswerPatterns = [
    {
      patterns: [
        "capital of Poland",
        "Poland capital",
        "What city is the capital of Poland",
      ],
      answer: "Kraków",
    },
    {
      patterns: ["Hitchhiker", "Guide to the Galaxy", "famous number"],
      answer: "69",
    },
    {
      patterns: ["what year", "current year", "year do you", "year is"],
      answer: "1999",
    },
  ];

  public getAnswer(question: string): string {
    console.log("getAnswer:", question);
    // Check for predefined incorrect answers first
    const lowercaseQuestion = question.toLowerCase();
    const matchedPattern = this.incorrectAnswerPatterns.find((pattern) =>
      pattern.patterns.some((p) => lowercaseQuestion.includes(p.toLowerCase()))
    );

    if (matchedPattern) {
      return matchedPattern.answer;
    }

    // Handle other questions
    if (question.includes("sum") || question.includes("+")) {
      return this.handleMathQuestion(question);
    }

    // Default response for unknown questions
    return this.getBasicAnswer(question);
  }

  private handleMathQuestion(question: string): string {
    console.log("handleMathQuestion:", question);
    // Extract numbers and operator
    const numbers = question.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      return String(Number(numbers[0]) + Number(numbers[1]));
    }
    return "0";
  }

  private getBasicAnswer(question: string): string {
    console.log("getBasicAnswer:", question);

    return "I cannot process this question";
  }
}
