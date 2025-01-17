'use client';

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatState } from '@/lib/types';
import Message from './Message';
import { Send, Trash2, Loader2 } from 'lucide-react';

export default function ChatInterface() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setChatState((prevState) => ({
        ...prevState,
        messages: JSON.parse(savedMessages),
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatState.messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: input,
    };

    setChatState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, userMessage],
      isLoading: true,
      error: null,
    }));
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...chatState.messages, userMessage] }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Failed to parse server response');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.message) {
        throw new Error('Server response is missing the message field');
      }

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.message,
      };

      setChatState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      setChatState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  };

  const clearConversation = () => {
    setChatState({ messages: [], isLoading: false, error: null });
    localStorage.removeItem('chatHistory');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {chatState.messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            Start a conversation...
          </div>
        )}
        {chatState.messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {chatState.isLoading && (
          <div className="flex items-center justify-center p-4 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            <span className="text-sm font-medium">AI is thinking...</span>
          </div>
        )}
        {chatState.error && (
          <div className="mx-auto max-w-2xl p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center text-red-600 dark:text-red-400">
              <span className="text-sm font-medium">Error: {chatState.error}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 min-w-0 px-4 py-3 text-base rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
              placeholder="Type your message..."
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={chatState.isLoading}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={clearConversation}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}