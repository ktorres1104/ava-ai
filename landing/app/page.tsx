import Link from 'next/link';
import { ArrowRight, Calendar, MessageSquare, Bell, Shield, Zap, CheckCircle, AlertCircle, DollarSign, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                Ava
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-700 hover:text-purple-600 transition">
                About
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-purple-600 transition">
                How It Works
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-purple-600 transition">
                Pricing
              </Link>
              <Link 
                href="#waitlist" 
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dark Gradient */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-purple-900 via-purple-700 to-teal-700 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-sm font-medium shadow-lg">
              <Zap className="h-4 w-4" />
              The assistant CEOs have, now for everyone
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Your Personal AI Assistant
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Stop juggling multiple apps. Let Ava manage your calendars, schedule, and life—so you can focus on what matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="#waitlist"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-700 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform"
            >
              Join the Waitlist
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-full text-lg font-semibold hover:bg-white/20 transition shadow-lg">
              Watch Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-purple-200">
            <CheckCircle className="h-4 w-4" />
            <span>2,143 people already signed up • Early access launching soon</span>
          </div>
        </div>

        {/* Hero Image / Mockup Placeholder */}
        <div className="max-w-5xl mx-auto mt-16 px-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 aspect-video flex items-center justify-center hover:scale-105 transition-transform duration-500">
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Calendar className="h-12 w-12 opacity-80" />
              </div>
              <p className="text-2xl font-semibold">App Mockup Coming Soon</p>
              <p className="text-purple-200 mt-2">Beautiful mobile interface showcase</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
            Sound Familiar?
          </h2>
          <p className="text-xl text-gray-700 text-center mb-16 max-w-3xl mx-auto">
            You're not alone. Millions of people are drowning in calendar chaos.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl hover:shadow-red-500/10 border border-gray-100 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Multiple Calendars</h3>
              <p className="text-gray-700">
                Google for work, Yahoo personal, school schedules, fitness apps... 
                You're constantly switching between 5+ apps just to see your day.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 border border-gray-100 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Everything Falls Apart</h3>
              <p className="text-gray-700">
                Forget to check one app? Missed pickup. Double-booked? Disaster. 
                One small mistake ruins your entire day.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10 border border-gray-100 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Can't Afford Help</h3>
              <p className="text-gray-700">
                CEOs have $300K/year personal assistants. You have chaos and exhaustion. 
                Why should only the wealthy get help?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Meet Ava: Your AI Assistant
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Ava watches all your calendars, understands your life, and keeps you on track—proactively.
            </p>
          </div>

          {/* Chat Example */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-purple-500/20 transition-shadow duration-300">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl rounded-tl-none p-5 flex-1 border border-purple-100">
                    <p className="text-gray-900 leading-relaxed">
                      Good morning! Today you have:
                      <br />• 9am Team call
                      <br />• 3pm School pickup
                      <br />• 5:30pm Gym
                      <br /><br />
                      <span className="font-semibold text-purple-700">Traffic is heavy—leave by 2:40pm for pickup.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-700 mt-6 font-medium">
              Real conversation with Ava—just like texting a friend who knows your life.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            What Ava Does For You
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Unified Calendar"
              description="See Google, Yahoo, Outlook, iCloud—all in one place. No more app switching."
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="AI Conversations"
              description='"Add dentist Tuesday 2pm" — Done. Natural language, understands context.'
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8" />}
              title="Proactive Alerts"
              description="Reminds you before you forget. Traffic delays, conflicts, forgotten tasks."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Conflict Detection"
              description="Catches double-bookings automatically. Suggests solutions before chaos."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Smart Scheduling"
              description="Finds the best time for your workout, meeting, or family time."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8" />}
              title="Daily Briefings"
              description="Morning summary of your day. Evening planning for tomorrow. Always prepared."
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Why People Love Ava
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Ava saved my life. I haven't missed a school pickup in 3 months."
              author="Sarah M."
              role="Single Mom"
            />
            <TestimonialCard
              quote="It's like having an executive assistant for $19/month. Game changer."
              author="Mike R."
              role="Freelancer"
            />
            <TestimonialCard
              quote="I stopped juggling 5 apps. Now just Ava. So much calmer."
              author="James T."
              role="Small Business Owner"
            />
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">Why I Built Ava</h2>
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 mx-auto mb-6 shadow-xl ring-4 ring-purple-100"></div>
          
          <div className="text-lg text-gray-800 space-y-4 text-left bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <p>
              I'm a single father juggling work, my kid's schedule, workouts, and life goals. 
              I was drowning in apps—Google Calendar, Yahoo Calendar, fitness trackers, to-do lists.
            </p>
            <p>
              One forgotten app check meant disaster: missed pickup, forgotten appointment, broken promise.
            </p>
            <p>
              I saw CEOs with $300K/year personal assistants and thought: <strong className="text-purple-700">Why not everyone?</strong>
            </p>
            <p>
              So I built Ava—the AI assistant regular people can actually afford.
            </p>
            <p className="text-purple-700 font-bold text-xl">
              Because you deserve help managing your life, too.
            </p>
          </div>

          <Link 
            href="/about"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
          >
            Learn more about our mission
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
            Simple, Affordable Pricing
          </h2>
          <p className="text-xl text-gray-700 text-center mb-16">
            No hidden fees. Cancel anytime. Start free.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Free"
              price="$0"
              period="/month"
              features={[
                "2 calendars",
                "50 AI messages/mo",
                "Basic features",
                "Mobile app"
              ]}
              cta="Try Free"
              highlight={false}
            />
            <PricingCard
              name="Personal"
              price="$19"
              period="/month"
              features={[
                "Unlimited calendars",
                "500 AI messages/mo",
                "All features",
                "Priority support",
                "Daily briefings"
              ]}
              cta="Start Trial"
              highlight={true}
            />
            <PricingCard
              name="Pro"
              price="$49"
              period="/month"
              features={[
                "Everything in Personal",
                "Unlimited AI messages",
                "Email integration",
                "Premium support",
                "Early access features"
              ]}
              cta="Contact Us"
              highlight={false}
            />
          </div>

          <p className="text-center text-gray-500 mt-8">
            💳 No credit card required for free tier
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-br from-purple-600 via-purple-700 to-teal-600 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Your Life Back?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join 2,000+ people on the waitlist. Early access launching soon.
          </p>

          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-purple-700 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform"
              >
                Join Waitlist →
              </button>
            </div>
          </form>

          <div className="mt-10 grid md:grid-cols-3 gap-4 text-purple-100">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>Early access when we launch</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>Exclusive 50% discount</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>No credit card needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-400 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-teal-500"></div>
                <h3 className="text-white font-bold text-xl">Ava</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your personal AI assistant. Democratizing help for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/how-it-works" className="hover:text-purple-400 transition">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-purple-400 transition">Pricing</Link></li>
                <li><Link href="#waitlist" className="hover:text-purple-400 transition">Join Waitlist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-purple-400 transition">About</Link></li>
                <li><Link href="/blog" className="hover:text-purple-400 transition">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-purple-400 transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/privacy" className="hover:text-purple-400 transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-purple-400 transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">© 2026 Ava AI. All rights reserved.</p>
            <p className="mt-3 text-gray-500 flex items-center justify-center gap-2">
              <span>Built with</span>
              <span className="text-red-400">❤️</span>
              <span>by a single dad who needed this to exist.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Components
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-xl">★</span>
        ))}
      </div>
      <p className="text-gray-800 mb-6 text-lg leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-teal-500"></div>
        <div>
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ 
  name, 
  price, 
  period, 
  features, 
  cta, 
  highlight 
}: { 
  name: string; 
  price: string; 
  period: string; 
  features: string[]; 
  cta: string; 
  highlight: boolean;
}) {
  return (
    <div className={`p-8 rounded-3xl transition-all duration-300 ${
      highlight 
        ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white ring-4 ring-purple-300 scale-105 shadow-2xl shadow-purple-500/50' 
        : 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-2xl hover:-translate-y-1'
    }`}>
      {highlight && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
            Most Popular
          </span>
        </div>
      )}
      <h3 className={`text-2xl font-bold mb-2 ${highlight ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
      <div className="mb-6">
        <span className="text-5xl font-bold">{price}</span>
        <span className={highlight ? 'text-purple-200' : 'text-gray-600'}>{period}</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${highlight ? 'text-purple-200' : 'text-purple-600'}`} />
            <span className={`${highlight ? 'text-purple-50' : 'text-gray-700'} leading-relaxed`}>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
        highlight 
          ? 'bg-white text-purple-700 hover:bg-gray-100' 
          : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
      }`}>
        {cta}
      </button>
    </div>
  );
}
