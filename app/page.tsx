import ChatInterface from './components/ChatInterface';
import { Github, Globe, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Developer Info - Top on mobile, Left on desktop */}
      <aside className="w-full lg:w-80 p-6 lg:min-h-screen lg:border-r lg:border-gray-200 dark:lg:border-gray-700">
        <div className="flex flex-col items-center lg:sticky lg:top-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <img
              src="https://github.com/SAIKUMAR039.png"
              alt="Developer"
              className="w-20 h-20 lg:w-32 lg:h-32 rounded-full ring-2 ring-blue-500 dark:ring-blue-400"
            />
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Sai Kumar
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Full Stack Developer
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6 mb-6">
            <a
              href="https://github.com/SAIKUMAR039"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              aria-label="GitHub Profile"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="mailto:saikumarthota2004@gmail.com"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              aria-label="Email Contact"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/sai-kumar-thota-101764252/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              aria-label="Twitter Profile"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://saikumarthota.live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              aria-label="Portfolio Website"
            >
              <Globe className="w-6 h-6" />
            </a>
          </div>

          {/* Project Info */}
          <div className="text-center lg:text-left w-full">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                About Project
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                An AI chat interface built with Next.js, Tailwind CSS, and Gemini AI. Experience natural conversations with advanced language models.
              </p>
              <a
                href="https://github.com/SAIKUMAR039/Benege"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View on GitHub
                <Github className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto p-4">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 dark:text-white">
            Gemini Chat
          </h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
            Experience the power of AI conversation
          </p>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
