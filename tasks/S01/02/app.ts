import axios from "axios";
import { OpenServiceAI } from "./OpenAIService";
import { response } from "express";

const ROBOT_URL = "https://xyz.ag3nts.org/verify";
const ai = new OpenServiceAI();

interface Message {
  text: string;
  msgID: string;
}

async function communicateWithRobot() {
  try {
    // Initial READY message
    let currentMsgId = "0";

    const initialMessage: Message = {
      text: "READY",
      msgID: currentMsgId,
    };

    // Start communication
    let response = await axios.post(ROBOT_URL, initialMessage);
    let robotResponse: Message = response.data;
    currentMsgId = robotResponse.msgID;

    // Continue communication until we get 'OK' or error
    while (robotResponse.text !== "OK") {
      // Get AI answer for the robot's question
      const answer = ai.getAnswer(robotResponse.text);

      // Send answer back to robot
      const answerMessage: Message = {
        text: answer,
        msgID: currentMsgId,
      };

      response = await axios.post(ROBOT_URL, answerMessage);
      robotResponse = response.data;
    }

    console.log("Authorization successful!");
  } catch (error) {
    console.error("Error during robot communication:", response);
    throw error;
  }
}

// Start the communication
communicateWithRobot();
