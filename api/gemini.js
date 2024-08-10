import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let lastCallTimestamp = 0;
const RATE_LIMIT_DELAY = 1000; // 1 second delay between API calls

export const generateContent = async (query) => {
  const now = Date.now();
  if (now - lastCallTimestamp < RATE_LIMIT_DELAY) {
    throw new Error('Rate limit exceeded. Please wait before making another request.');
  }

  lastCallTimestamp = now;

  try {
    const result = await model.generateContent(query);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error:', error);
    throw new Error('An error occurred while processing your request.');
  }
};

export const checkAPIStatus = async () => {
  try {
    await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    return true;
  } catch (error) {
    console.error('API Status Check Error:', error);
    return false;
  }
};