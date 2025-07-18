
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Database, Zap, Users, Target, Award } from 'lucide-react';
import Header from '@/components/Header';
import FadeInOnView from "@/components/ui/scroll-slide-in";
import '../css/about.css';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <FadeInOnView duration={0.5}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Zylla</span>
            </h1>
          </FadeInOnView>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet Zylla, your intelligent companion designed to revolutionize how students and staff 
            interact with institutional information at Landmark University.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600">
              Zylla is a cutting-edge AI chatbot specifically designed to answer questions about 
              the Institute of Landmark Buea. She serves as your personal academic assistant, 
              providing instant access to institutional knowledge and support.
            </p>
            <p className="text-lg text-gray-600">
              Built with advanced AI technologies including Google's Gemini, Zylla is trained on 
              comprehensive data from the LMUI website and official university resources to ensure 
              accurate, reliable, and up-to-date information.
            </p>
          </div>
          <FadeInOnView delay={0.4} duration={1}>
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white">
                <div className="space-y-4">
                  <Brain className="w-12 h-12" />
                  <h3 className="text-2xl font-bold">Powered by AI</h3>
                  <p className="text-purple-100">
                    Advanced machine learning algorithms trained specifically on Landmark University data
                  </p>
                </div>
              </div>
            </div>
          </FadeInOnView>

        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Makes Zylla Special</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeInOnView delay={0.2} once={false}>
              <Card className="p-6 hover:shadow-lg transition-shadow border-purple-100">
                <CardContent className="pt-6">
                  <Database className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Database</h3>
                  <p className="text-gray-600">
                    Trained on official LMUI data, academic programs, policies, and frequently asked questions
                  </p>
                </CardContent>
              </Card>
            </FadeInOnView>

            <FadeInOnView delay={0.4} once={false}>
              <Card className="p-6 hover:shadow-lg transition-shadow border-purple-100">
                <CardContent className="pt-6">
                  <Zap className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Responses</h3>
                  <p className="text-gray-600">
                    Get immediate answers to your questions 24/7, no waiting for office hours
                  </p>
                </CardContent>
              </Card>
            </FadeInOnView>

            <FadeInOnView delay={0.6} once={false}>
              <Card className="p-6 hover:shadow-lg transition-shadow border-purple-100">
                <CardContent className="pt-6">
                  <Users className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Student-Centric Design</h3>
                  <p className="text-gray-600">
                    Tailored specifically for Landmark University students, faculty, and staff
                  </p>
                </CardContent>
              </Card>
            </FadeInOnView>

            <FadeInOnView delay={0.8} once={false}>
              <Card className="p-6 hover:shadow-lg transition-shadow border-purple-100">
                <CardContent className="pt-6">
                  <Target className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Accurate Information</h3>
                  <p className="text-gray-600">
                    Reliable data sourced directly from official university administration
                  </p>
                </CardContent>
              </Card>
            </FadeInOnView>

            <FadeInOnView delay={1.0} once={false}>
              <Card className="p-6 hover:shadow-lg transition-shadow border-purple-100">
                <CardContent className="pt-6">
                  <Award className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Research Support</h3>
                  <p className="text-gray-600">
                    Assists with academic research and provides relevant institutional information
                  </p>
                </CardContent>
              </Card>
            </FadeInOnView>

            <FadeInOnView delay={1.2} once={false}>
              <Card className="p-6 hover:shadow-lg transition-shadow border-purple-100">
                <CardContent className="pt-6">
                  <Brain className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Continuous Learning</h3>
                  <p className="text-gray-600">
                    Constantly updated with new information and improved responses
                  </p>
                </CardContent>
              </Card>
            </FadeInOnView>

          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-purple-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built with Cutting-Edge Technology</h2>
            <p className="text-lg text-gray-600">
              Zylla leverages the latest in AI and cloud technologies to provide you with the best experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">AI & Machine Learning</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Google Gemini AI for natural language processing</li>
                <li>• Advanced machine learning algorithms</li>
                <li>• Context-aware conversation handling</li>
                <li>• Continuous model improvement</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Infrastructure & Security</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Firebase cloud infrastructure</li>
                <li>• Secure user data management</li>
                <li>• Scalable architecture</li>
                <li>• Real-time data synchronization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
