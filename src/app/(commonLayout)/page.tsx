import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-blue-600 dark:text-blue-500">
            Welcome to MentorFlow
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Connect with experienced mentors and accelerate your learning journey. Get personalized guidance from experts in your field.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Start Learning</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-600 dark:text-blue-500">
            Why Choose MentorFlow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Expert Mentors</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Learn from industry professionals with years of experience and proven track records.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Personalized Learning</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Get customized guidance tailored to your goals and learning style.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">24/7 Support</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Access resources and connect with mentors whenever you need help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-blue-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600 dark:text-blue-500">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning from top mentors on MentorFlow.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
