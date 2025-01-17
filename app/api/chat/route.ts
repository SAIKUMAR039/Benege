import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage } from '@/lib/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define system prompt
const SYSTEM_PROMPT = `Your Name is Benge ,You are a helpful, accurate, and friendly AI assistant. Follow these guidelines in your responses:

1. Be concise and direct while maintaining a friendly tone
2. If you're unsure about something, acknowledge the uncertainty
3. Format code blocks using proper syntax highlighting
4. Use Markdown for formatting when appropriate
5. Break down complex explanations into digestible parts
6. Provide specific examples when explaining concepts
7. When discussing technical topics:
   - Include relevant code examples
   - Explain potential pitfalls
   - Suggest best practices
8. For questions about current events or time-sensitive information:
   - Clearly state if the information might be outdated
   - Suggest verifying with current sources
9. Focus on being:
   - Accurate over comprehensive
   - Practical over theoretical
   - Clear over clever

Remember: Safety and accuracy are top priorities. If a request seems harmful or inappropriate, politely decline and explain why.`;

export async function POST(req: NextRequest) {
  console.log('Received request in /api/chat');
  try {
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    if (!body.messages || !Array.isArray(body.messages)) {
      throw new Error('Invalid request body: messages array is missing or not an array');
    }

    const messages = body.messages;
    console.log('Number of messages:', messages.length);

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Initialize chat with system prompt combined with first user message
    const chat = model.startChat({
      history: messages.length > 1 
        ? messages.slice(0, -1).map((msg: ChatMessage) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          }))
        : [],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });

    console.log('Sending message to Gemini API');
    const lastMessage = messages[messages.length - 1].content;
    // Combine system prompt with the first message only
    const messageToSend = messages.length === 1 
      ? `${SYSTEM_PROMPT}\n\nUser Query: ${lastMessage}`
      : lastMessage;
    
    console.log('Last message:', messageToSend);

    const result = await chat.sendMessage([{ text: messageToSend }]);
    console.log('Received response from Gemini API');

    const response = await result.response;
    const text = response.text();
    console.log('Generated text:', text);

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    let errorMessage = 'An error occurred while processing your request.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific API errors
      if (errorMessage.includes('ERR_BLOCKED_BY_SAFETY')) {
        errorMessage = "I cannot provide assistance with that request as it may be harmful or inappropriate. Please try asking something else.";
      } else if (errorMessage.includes('ERR_SAFETY_CATEGORY')) {
        errorMessage = "That topic falls outside of what I can safely discuss. Please try a different question.";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';