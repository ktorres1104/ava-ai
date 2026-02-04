import Link from 'next/link';
import { ArrowLeft, Heart, Users, Target, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                Ava
              </span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-purple-600 transition">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Democratizing Personal Assistants
          </h1>
          <p className="text-xl text-gray-600">
            Everyone deserves help managing their life—not just CEOs.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">The Story</h2>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <p>
              Hi, I'm Kevin Torres, and I built Ava out of pure necessity.
            </p>
            
            <p>
              As a single father, I'm constantly juggling:
            </p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Work calendar on Google (meetings, deadlines, team events)</li>
              <li>Personal calendar on Yahoo (doctor appointments, personal commitments)</li>
              <li>My son's school schedule (pickups, events, parent-teacher conferences)</li>
              <li>Fitness goals (workouts, runs—I'm trying to stay healthy!)</li>
              <li>Household chores (grocery runs, cleaning, maintenance)</li>
              <li>Tech ideas I want to pursue (I'm an entrepreneur at heart)</li>
            </ul>

            <p className="font-semibold text-gray-900">
              I was drowning.
            </p>

            <p>
              Every day was a battle against my own schedule. I'd check Google Calendar for work. 
              Then remember to check Yahoo for personal stuff. Then check my phone for school notifications. 
              Then try to remember if I needed to work out today.
            </p>

            <p>
              One missed app check meant disaster: forgotten pickup, missed appointment, broken promise to my son.
            </p>

            <p>
              I watched CEOs in my network manage infinitely more complex schedules with ease. 
              Their secret? Personal assistants costing $50,000-$300,000 per year.
            </p>

            <p className="text-2xl font-bold text-purple-600">
              That's when it hit me: Why should only the wealthy get this level of support?
            </p>

            <p>
              Regular people—single parents, busy professionals, students, freelancers—we need help just as much. 
              Maybe more. But we can't afford $100K+ assistants.
            </p>

            <p>
              So I decided to build one. An AI assistant that:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Costs $19/month, not $100K/year</li>
              <li>Knows about ALL my calendars in one place</li>
              <li>Proactively reminds me before I forget</li>
              <li>Understands natural language (I can just say "add dentist Tuesday 2pm")</li>
              <li>Works on my phone (because that's where my life is)</li>
            </ul>

            <p>
              That's Ava.
            </p>

            <p className="text-xl font-semibold text-gray-900">
              I built Ava for me. But it's for you, too.
            </p>

            <p>
              Because everyone juggling multiple calendars, responsibilities, and dreams deserves help staying organized.
            </p>

            <p>
              Because being a good parent, employee, and human shouldn't require superhuman organizational skills.
            </p>

            <p>
              Because personal assistants should be democratized.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Mission</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Heart className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Make Help Accessible</h3>
              <p className="text-gray-700">
                Personal assistant capabilities shouldn't be a luxury. We're making them affordable 
                and accessible to everyone who needs help managing their complex lives.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Serve Regular People</h3>
              <p className="text-gray-700">
                We're not building for executives. We're building for single parents, students, 
                freelancers, and busy professionals who are doing their best.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Target className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Solve Real Problems</h3>
              <p className="text-gray-700">
                No gimmicks. We're solving the actual pain of calendar chaos, missed commitments, 
                and organizational overwhelm that millions experience daily.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Build Trust First</h3>
              <p className="text-gray-700">
                We handle your most personal data—your schedule, your life. We take that responsibility 
                seriously with transparency, security, and respect for your privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Our Values</h2>

          <div className="space-y-8">
            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-2xl font-bold mb-2">Human-Centric</h3>
              <p className="text-gray-700">
                Technology serves people, not the other way around. Every feature must make your life genuinely better.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-2xl font-bold mb-2">Transparent</h3>
              <p className="text-gray-700">
                We're open about our challenges, costs, and decisions. You deserve to know how things work.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-2xl font-bold mb-2">Accessible</h3>
              <p className="text-gray-700">
                Affordable pricing, inclusive design, clear communication. No jargon, no gatekeeping.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-2xl font-bold mb-2">Trustworthy</h3>
              <p className="text-gray-700">
                Privacy-first, security-conscious, no data selling. Your trust is earned, not assumed.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-2xl font-bold mb-2">Authentic</h3>
              <p className="text-gray-700">
                Real founder story, real problems, real solutions. We're building this because we need it too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">The Vision</h2>
          <div className="text-xl text-gray-700 space-y-6">
            <p>
              By 2029, we want Ava used by <strong>100,000+ people</strong> managing their lives with confidence.
            </p>
            <p>
              We want "having an AI assistant" to be as normal as having a smartphone.
            </p>
            <p className="text-2xl font-bold text-purple-600">
              We're proving that you don't need to be a CEO to deserve help.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Join the Movement
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Be part of democratizing personal assistants. Join our waitlist.
          </p>
          <Link 
            href="/#waitlist"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Join the Waitlist →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2026 Ava AI. All rights reserved.</p>
          <p className="mt-2 text-gray-500">
            Built with ❤️ by a single dad who needed this to exist.
          </p>
        </div>
      </footer>
    </div>
  );
}
