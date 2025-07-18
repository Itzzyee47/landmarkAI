// components/illustator.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const messages = [
  { text: "Hello, what can I study in Landmark?", user: "user" },
  { text: "There are a variety of courses we offer, what are you into?", user: "ai" },
  { text: "I love animation and I'm good at computer", user: "user" },
  { text: "Great! We have excellent animation programs.", user: "ai" },
  { text: "What software do you currently use?", user: "ai" },
  { text: "I've used Blender and a bit of Maya", user: "user" },
  { text: "Perfect! Our courses cover both extensively.", user: "ai" },
  { text: "We also teach industry-standard techniques", user: "ai" },
  { text: "That sounds amazing!", user: "user" },
  { text: "What's the duration of the program?", user: "user" },
  { text: "Our diploma program is 18 months", user: "ai" },
  { text: "With optional specialization tracks", user: "ai" },
  { text: "What about job placement after?", user: "user" },
  { text: "We have a 92% placement rate", user: "ai" },
  { text: "With partnerships at major studios", user: "ai" },
  { text: "That's impressive!", user: "user" },
  { text: "When can I apply?", user: "user" },
  { text: "Applications open next month", user: "ai" },
  { text: "Can I visit the campus first?", user: "user" },
  { text: "Of course! We offer campus tours weekly", user: "ai" }
];

export default function AnimatedChat() {
  const [displayedMessages, setDisplayedMessages] = useState([messages[0]]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages]);

  // Message cycling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedMessages(prev => {
        // When we reach the end, start over
        if (currentIndex >= messages.length) {
          setCurrentIndex(1); // Reset to 1 (0 will be added next)
          return [messages[0]];
        }
        
        // Add next message
        const newMessage = messages[currentIndex];
        const updatedMessages = [...prev, newMessage];
        
        // Limit to 6 messages to prevent excessive DOM nodes
        if (updatedMessages.length > 6) {
          return updatedMessages.slice(-6);
        }
        return updatedMessages;
      });
      
      setCurrentIndex(prev => (prev + 1) % (messages.length + 1));
    }, 1500); // 1.5 second between messages

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative h-full">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl opacity-20 blur-3xl"></div>
        <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-purple-100 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <div className="text-sm text-gray-500">Zylla AI</div>
          </div>
          
          {/* Chat container with max height and scrolling */}
          <div 
            ref={containerRef}
            className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
          >
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {displayedMessages.map((message, index) => (
                  <motion.div
                    key={`${index}-${message.text}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={
                      message.user === "user"
                        ? "bg-gray-100 rounded-2xl p-4 max-w-xs"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 ml-8"
                    }
                  >
                    <p className="text-sm">{message.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}