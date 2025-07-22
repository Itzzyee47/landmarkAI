// Extend the MarkedOptions interface
declare module 'marked' {
  interface MarkedOptions {
    highlight?: (code: string, language: string) => string;
    langPrefix?: string;
  }
}

import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { askZylla } from '@/components/ai2';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { Plus, X, Send, Menu, LogOut, User, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/UserAvatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import chatHistory from '@/components/chatHistory';
import '../css/chats.css';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  time: Date;
  sender?: string;
}

interface Conversation {
  id: string;
  time: Date;
  userId: string;
  user?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    hljs.configure({ ignoreUnescapedHTML: true });
    marked.setOptions({
      highlight: (code, lang) => {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-',
    });
    hljs.highlightAll();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    const loadUserConversations = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const convoQuery = query(
        collection(db, 'conversations'),
        where('user', '==', currentUser.email),
        orderBy('time', 'desc')
      );
      const querySnapshot = await getDocs(convoQuery);
      const convos: Conversation[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        convos.push({
          id: doc.id,
          time: data.time?.toDate?.() ?? new Date(),
          userId: data.userId,
          user: data.user,
        });
      });

      setConversations(convos);

      if (convos.length > 0) {
        setCurrentConvoId(convos[0].id);
        await loadMessages(convos[0].id);
      } else {
        const greeting: Message = {
          id: '1',
          content: "Hi there! I'm Zylla, your AI assistant for Landmark University. How can I help you today?",
          isUser: false,
          time: new Date(),
          sender: 'bot',
        };
        setMessages([greeting]);
      }
    };

    loadUserConversations();
  }, []);

  const loadMessages = async (convoId: string) => {
    const q = query(
      collection(db, 'messages'),
      where('convoId', '==', convoId),
      orderBy('time', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const msgs: Message[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      msgs.push({
        id: doc.id,
        content: data.content,
        isUser: data.sender === auth.currentUser?.email,
        time: data.time?.toDate?.() ?? new Date(),
        sender: data.sender,
      });
    });

    setMessages(msgs);
  };

  const startNewConversation = async (initialUserMsg: Message) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const convoRef = await addDoc(collection(db, 'conversations'), {
      userId: currentUser.uid,
      user: currentUser.email,
      time: Timestamp.now(),
    });

    setCurrentConvoId(convoRef.id);
    await addDoc(collection(db, 'messages'), {
      convoId: convoRef.id,
      content: initialUserMsg.content,
      sender: currentUser.email,
      time: Timestamp.now(),
    });
  };
  
  const startNewChat = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const newConvoRef = await addDoc(collection(db, 'conversations'), {
        userId: currentUser.uid,
        user: currentUser.email,
        time: Timestamp.now(),
      });

      setCurrentConvoId(newConvoRef.id);
      setMessages([
        {
          id: '1',
          content: "Hi there! I'm Zylla, your AI assistant for Landmark University. How can I help you today?",
          isUser: false,
          time: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      isUser: true,
      time: new Date(),
      sender: auth.currentUser?.email,
    };

    setMessages((prev) => [...prev, userMessage]);

    if (!currentConvoId) {
      await startNewConversation(userMessage);
    } else {
      await addDoc(collection(db, 'messages'), {
        convoId: currentConvoId,
        content: messageText,
        sender: auth.currentUser?.email,
        time: Timestamp.now(),
      });
    }

    try {
      const aiResponseContent = await askZylla(messageText, chatHistory);

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponseContent,
        isUser: false,
        time: new Date(),
        sender: 'bot',
      };

      await addDoc(collection(db, 'messages'), {
        convoId: currentConvoId,
        content: aiResponseContent,
        sender: 'bot',
        time: Timestamp.now(),
      });

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: 'Sorry, something went wrong.',
          isUser: false,
          time: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isMarkdown = (text: string): boolean => {
    const markdownPatterns = [
      /^#{1,6}\s/,
      /\*\*.*\*\*/,
      /\*.*\*/,
      /\[.*\]\(.*\)/,
      /!\[.*\]\(.*\)/,
      /^>\s/,
      /^(\*|\-|\+)\s/,
      /^\d+\.\s/,
      /```[\s\S]*```/,
      /`.*`/,
      /^-{3,}$/,
    ];
    return markdownPatterns.some((pattern) => pattern.test(text));
  };

  const renderMessage = (content: string) => {
    if (isMarkdown(content)) {
      const html = marked(content);
      return <div dangerouslySetInnerHTML={{ __html: html }} className="markdown-content" />;
    }
    return <p>{content}</p>;
  };

  return (
    <div className="chat-container">
       {/* Sidebar */}
       <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-purple-500">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold text-white">Zylla</div>
              <span className="text-xs text-purple-200">v 0.9</span>
            </div>
            <button
              className="lg:hidden text-white hover:text-purple-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            <Button
              onClick={startNewChat}
              className="w-full bg-purple-500 hover:bg-purple-400 text-white border-0"
            >
              <Plus size={16} className="mr-2" />
              New Chat
            </Button>
          </div>

          <div className="flex-1 px-4, " style={{maxHeight:'50vh',overflowY:'scroll', padding:'0.6rem'}}>
            <div className="text-sm text-purple-200 mb-3">Recent</div>
            <div className="space-y-2">
              {conversations.length > 0 ? (
                conversations.map((convo) => (
                  <div
                    key={convo.id}
                    className="p-3 rounded-lg bg-purple-500/50 text-white text-sm cursor-pointer hover:bg-purple-500/70"
                    onClick={async () => {
                      setCurrentConvoId(convo.id);
                      await loadMessages(convo.id);
                    }}
                  >
                    <div className="font-medium">
                      {convo.user === auth.currentUser?.email ? 'You' : 'AI'} -{' '}
                      {convo.time?.toLocaleString?.() ?? 'N/A'}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-purple-200">No conversations found</p>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-purple-500 space-y-2">
            <Link to="/manage-profile">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-purple-500/50">
                <User size={16} className="mr-2" />
                Manage Profile
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-purple-500/50">
                <Home size={16} className="mr-2" />
                Home
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-purple-500/50"
              onClick={handleSignOut}
            >
              <LogOut size={16} className="mr-2" />
              Sign-out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="main-chat-area">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-purple-50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Zylla
              </div>
              <span className="text-xs text-purple-600">v0.9</span>
            </div>
          </div>
          <UserAvatar />
        </div>

        {/* Messages */}
        <ScrollArea className="messages-container">
          <div className="messages-wrapper">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className={`message-row ${message.isUser ? 'user-message' : 'bot-message'}`}
              >
                <div className={`message-bubble ${message.isUser ? 'user-bubble' : 'bot-bubble'}`}>
                  {renderMessage(message.content)}
                  <div className={`message-time ${message.isUser ? 'user-time' : 'bot-time'}`}>
                    {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message-row bot-message">
                <div className="message-bubble bot-bubble">
                  <div className="loading-dots">
                    <div className="dot"></div>
                    <div className="dot" style={{ animationDelay: '0.1s' }}></div>
                    <div className="dot" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="input-container">
          <form onSubmit={handleSendMessage} className="input-form">
            <div className="input-wrapper">
              <button type="button" className="input-icon">
                <Plus size={18} />
              </button>
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                type="text"
                placeholder="Type your message..."
                className="message-input"
                disabled={isLoading}
              />
              <button type="button" className="input-icon mic-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v10m0 0c-1.657 0-3 1.343-3 3v0c0 1.657 1.343 3 3 3s3-1.343 3-3v0c0-1.657-1.343-3-3-3zm0 0v10" />
                </svg>
              </button>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="send-button"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
