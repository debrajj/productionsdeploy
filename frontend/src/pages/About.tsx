import React from "react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
            O² Nutrition – Our Story
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            At O² Nutrition, we believe that fitness is not just about building bodies — it's about building trust, discipline, and a future where every athlete has access to the right fuel for their journey.
          </p>
        </div>
      </section>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg p-8 shadow-md mb-8">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              We started with one simple idea: give athletes what they truly deserve — authentic supplements, transparent guidance, and real value. In an industry crowded with shortcuts, false promises, and fakes, we chose the harder path — honesty. Every product we provide is genuine, tested, and trusted, because we know that when it comes to your body, there can be no compromises.
            </p>
            <p className="mb-6">
              Our name comes from the most vital element of life — Oxygen (O²). Just like oxygen flows through every breath, our mission flows into every corner of the fitness community. We are here not only to supply supplements, but also to provide clarity, direction, and support for every individual — from the young beginner stepping into the gym to the seasoned athlete preparing for national-level competitions.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">What We Stand For:</h2>
            <ul className="space-y-3 mb-6">
              <li><strong>Transparency in Dealing</strong> – Clear communication, no hidden agendas. What you see is what you get.</li>
              <li><strong>Authentic Supplements</strong> – Only genuine, fresh, and certified products, because your health is our first responsibility.</li>
              <li><strong>Value for Money</strong> – Premium quality at the right price, ensuring you get maximum return on every rupee you invest in your fitness.</li>
              <li><strong>Right Guidance</strong> – Personalized support for your fitness journey, from daily nutrition to advanced performance planning.</li>
              <li><strong>Competition Preparation</strong> – Expert strategies, supplement cycles, and mentorship for athletes chasing the national and international stage.</li>
              <li><strong>National-Level Presence</strong> – A brand born in India, for India, with a vision to serve athletes across every state, every city, every gym.</li>
            </ul>
            
            <p className="mb-8">
              The flash in our logo represents the spark of life and the unstoppable energy that drives transformation. It is not just a design — it's a reminder of what we deliver: strength, power, and performance at the speed of trust.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The People Behind O² Nutrition</h2>
            <p className="mb-4">
              O² Nutrition is more than a company — it is the vision, passion, and relentless effort of a team of individuals who live and breathe fitness:
            </p>
            <ul className="space-y-2 mb-6">
              <li><strong>Sumit Pal Singh</strong> – The Founder. The visionary who laid the foundation of O² Nutrition with the belief that authenticity and trust can change the fitness industry.</li>
              <li><strong>Rajbir Gill</strong> – The Man Behind Change and Growth. Driving innovation and steering the brand toward new heights with strategic direction.</li>
              <li><strong>Bharat Mehra</strong> – The Run Man for Everything. The powerhouse who ensures that every aspect of the brand keeps moving, no matter the challenge.</li>
              <li><strong>Robinpuneet Singh</strong> – The Guardian of Essentials. Overseeing the critical pillars of the brand and making sure nothing is ever compromised.</li>
              <li><strong>Nipun Gakhar</strong> – The Presence Builder. Strengthening O² Nutrition's reach and influence day by day, making the brand stronger across India.</li>
              <li><strong>Manan Gakhar</strong> – The Ground Commander. Leading the on-ground team and ensuring smooth execution of work at every level.</li>
              <li><strong>Siddhant Sharma</strong> – The Cloud Operations Manager. Handling the digital backbone and ensuring our operations remain strong and seamless.</li>
            </ul>
            
            <p className="mb-8 italic text-center">
              Together, they form the heart of O² Nutrition — a family bound not just by business, but by a shared passion for fitness, a commitment to authenticity, and a dream to build India's most trusted nutrition company.
            </p>
            
            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Founder's Note – Sumit Pal Singh</h2>
              <blockquote className="italic text-gray-700">
                <p className="mb-4">
                  "When I started O² Nutrition, it wasn't just about selling supplements — it was about solving a problem. I saw athletes and fitness lovers struggling with fake products, false promises, and a lack of real guidance. I knew something had to change.
                </p>
                <p className="mb-4">
                  From day one, my mission was clear: to create a brand built on trust, authenticity, and value. At O² Nutrition, we don't just provide products — we provide clarity, support, and a partner in your fitness journey.
                </p>
                <p className="mb-4">
                  This journey hasn't been mine alone. With Rajbir, Bharat, Robinpuneet, Nipun, Manan, Jasvinder, Raja And Siddhant by my side, O² Nutrition has grown into a family — a family that shares the same fire and vision to serve athletes across India.
                </p>
                <p className="mb-4">
                  Every scoop, every capsule, every consultation is built on one promise: your health, your performance, and your trust come first.
                </p>
                <p className="mb-4">
                  Thank you for believing in us. Together, we will keep building not just stronger bodies, but a stronger fitness culture for India."
                </p>
                <footer className="text-right font-semibold">— Sumit Pal Singh, Founder, O² Nutrition</footer>
              </blockquote>
            </div>
            
            <div className="text-center bg-gradient-to-r from-[#F9A246] to-orange-400 rounded-lg p-6 text-white">
              <p className="text-lg mb-2">We are more than a supplement company.</p>
              <p className="text-lg mb-2">We are a family, a movement, a partner in your journey.</p>
              <p className="mb-4">With every product, every consultation, every step forward, we stand by one promise:</p>
              <p className="text-xl font-bold">O² Nutrition – Authentic Fuel. Real Results. Trusted Nationwide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;