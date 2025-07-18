
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, HelpCircle, BookOpen, MessageCircle, Settings } from 'lucide-react';
import Header from '@/components/Header';

const Help = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "Zylla has been incredibly helpful for finding information about my courses and research opportunities. The responses are always accurate and detailed!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Graduate Student",
      content: "As an international student, Zylla helped me understand the university policies and procedures. It's like having a personal advisor available 24/7.",
      rating: 5
    },
    {
      name: "Dr. Emily Roberts",
      role: "Faculty Member",
      content: "I recommend Zylla to all my students. It provides consistent, reliable information about university resources and academic programs.",
      rating: 5
    },
    {
      name: "David Martinez",
      role: "Engineering Student",
      content: "The AI is surprisingly knowledgeable about specific departmental information. It saved me so much time when planning my course schedule.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "What kind of questions can I ask Zylla?",
      answer: "You can ask about academic programs, admission requirements, course schedules, university policies, campus facilities, research opportunities, and general institutional information."
    },
    {
      question: "How accurate is the information provided?",
      answer: "Zylla is trained on official university data and is regularly updated. However, for critical decisions, we recommend verifying information with the relevant department."
    },
    {
      question: "Is my conversation data secure?",
      answer: "Yes, all conversations are encrypted and stored securely using Firebase. We follow strict privacy guidelines to protect your personal information."
    },
    {
      question: "Can I use Zylla on my mobile device?",
      answer: "Absolutely! Zylla is fully responsive and works seamlessly on smartphones, tablets, and desktop computers."
    },
    {
      question: "What if Zylla doesn't know the answer to my question?",
      answer: "If Zylla can't provide a complete answer, she'll guide you to the appropriate university department or resource for further assistance."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Help & <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Testimonials</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get help using Zylla and see what our community has to say about their experience
          </p>
        </div>

        {/* Quick Help Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Getting Started</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow border-purple-100">
              <CardContent className="pt-6">
                <MessageCircle className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Start a Conversation</h3>
                <p className="text-gray-600">
                  Simply type your question in natural language. Zylla understands context and can help with follow-up questions.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-purple-100">
              <CardContent className="pt-6">
                <BookOpen className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Ask Specific Questions</h3>
                <p className="text-gray-600">
                  The more specific your question, the better Zylla can help. Ask about courses, deadlines, requirements, or policies.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-purple-100">
              <CardContent className="pt-6">
                <Settings className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Manage Your Profile</h3>
                <p className="text-gray-600">
                  Customize your experience and provide feedback to help improve Zylla's responses for everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Common questions about using Zylla</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-purple-100">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div>
          <div className="text-center mb-12">
            <Quote className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600">Real feedback from students and faculty</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-purple-100">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-20 text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="space-y-2">
            <p className="text-purple-100">Email: support@lsachatbot.com</p>
            <p className="text-purple-100">Or start a conversation with Zylla for immediate assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
