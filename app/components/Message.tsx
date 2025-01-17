import React from 'react';
import { ChatMessage } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyToClipboard from 'react-copy-to-clipboard';
import { User, Bot, Copy, Check } from 'lucide-react';

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start space-x-4 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="flex-shrink-0">
          <Bot className="w-8 h-8 text-blue-500" />
        </div>
      )}
      <div
        className={`p-4 rounded-lg max-w-[80%] ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
        }`}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="relative">
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                  <CopyToClipboard text={String(children)} onCopy={handleCopy}>
                    <button className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded text-xs">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </CopyToClipboard>
                </div>
              ) : (
                <code className={`${className} bg-gray-200 dark:bg-gray-600 rounded px-1`} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {message.role === 'user' && (
        <div className="flex-shrink-0">
          <User className="w-8 h-8 text-blue-500" />
        </div>
      )}
    </div>
  );
}

