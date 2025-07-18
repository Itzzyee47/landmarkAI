
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Shield, Clock, Users } from 'lucide-react';
import FadeInOnView from "@/components/ui/scroll-slide-in";
import '../css/anistyles.css';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              
              <div className="space-y-6">
                <FadeInOnView once={false} delay={0.2} duration={1}>
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight slide_in">
                    <span className="text-gray-900">Hi there stranger!</span>
                    <br />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                      Welcome to Landmark's Student Assistant ChatBot
                    </span>
                  </h1>
                </FadeInOnView>

                <p className="text-xl text-gray-600 max-w-lg">
                  Zylla is a chatbot designed to answer questions about the institute of Landmark Buea. 
                  She is trained on data gotten from the LMUI website and makes use of current AI technologies 
                  (Gemini) to assist students or personels with research and more.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-lg px-8 py-4 rounded-full"
                  >
                    Get started
                  </Button>
                </Link>
                <Link to="/about">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto border-purple-200 text-purple-700 hover:bg-purple-50 text-lg px-8 py-4 rounded-full"
                  >
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Illustration */}
           <FadeInOnView once={false} delay={0.8} duration={1.4}> 
            <div className="relative">
                <div className="relative mx-auto w-full max-w-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl opacity-20 blur-3xl"></div>
                  <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-purple-100">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        <div className="text-sm text-gray-500">Zylla AI</div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-100 rounded-2xl p-4 max-w-xs">
                          <p className="text-sm">Hello, what can I study in Landmark?</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 ml-8">
                          <p className="text-sm">There are a variety of courses we offer, what are you into?</p>
                        </div>
                        <div className="bg-gray-100 rounded-2xl p-4 max-w-xs">
                          <p className="text-sm">I love animation and I'm good at computer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           </FadeInOnView>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 slide_in">
              Why Choose Our AI Assistant?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ensuring safety and scalability by using cloud service providers (Firebase) to manage users and user data alike. 
              Available 24/7 with reliable data gotten from LMU administration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FadeInOnView delay={0} once={false}>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-purple-100">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Conversations</h3>
                <p className="text-gray-600">AI-powered responses trained on official university data</p>
              </CardContent>
            </Card>
          </FadeInOnView>

          <FadeInOnView delay={0.5} once={false}>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-purple-100">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Safe</h3>
                <p className="text-gray-600">Built with Firebase for reliable data management</p>
              </CardContent>
            </Card>
          </FadeInOnView>

          <FadeInOnView delay={1.0} once={false}>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-purple-100">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Available</h3>
                <p className="text-gray-600">Get help anytime, anywhere with instant responses</p>
              </CardContent>
            </Card>
          </FadeInOnView>

          <FadeInOnView delay={1.5} once={false}>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-purple-100">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Focused</h3>
                <p className="text-gray-600">Designed specifically for Landmark University students</p>
              </CardContent>
            </Card>
          </FadeInOnView>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of students already using our AI assistant for their academic journey.
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full"
            >
              Start Chatting Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
