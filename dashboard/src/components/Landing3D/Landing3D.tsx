import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene from './Scene';
import { Data } from '../Data';

gsap.registerPlugin(ScrollTrigger);

export default function Landing3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // We create a ScrollTrigger that ties the entire container scroll to progressRef.current
    gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
        onUpdate: (self) => {
          const p = self.progress; // 0 to 1 across 6 sections
          let uP = 0;
          if (p < 0.2) {
            uP = (p / 0.2) * 1.0; // 0 to 1 (Shield to Nodes)
          } else if (p < 0.4) {
            uP = 1.0 + ((p - 0.2) / 0.2) * 1.0; // 1 to 2 (Nodes to Fragmented)
          } else if (p < 0.6) {
            uP = 2.0 + ((p - 0.4) / 0.2) * 1.0; // 2 to 3 (Fragmented to Reconverged)
          } else {
            uP = 3.0; // Stay Reconverged for the last two sections
          }
          progressRef.current = uP;
        }
      }
    });

    // We can also animate text opacities or positions if needed, but since we want to keep it simple,
    // we let CSS and Framer Motion (or simple CSS opacity tied to scroll) handle the text, 
    // or we just rely on standard scrolling for the HTML overlay.
    // Actually, to make it perfectly sync like Razorpay, we can fade text in/out using ScrollTrigger.
    
    const sections = containerRef.current.querySelectorAll('.scene-section');
    sections.forEach((sec) => {
      // Fade in/out each section
      gsap.fromTo(sec, 
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: sec,
            start: 'top center',
            end: 'center center',
            scrub: true,
          }
        }
      );
      gsap.to(sec, {
        opacity: 0,
        scrollTrigger: {
          trigger: sec,
          start: 'center center',
          end: 'bottom center',
          scrub: true,
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 text-paper bg-transparent font-sans">
      
      {/* 3D Background */}
      <Scene progressRef={progressRef} />

      {/* Nav for Landing */}
      <nav className="fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-50 mix-blend-difference">
        <div className="font-display font-bold text-xl flex items-center gap-2">
          <div className="w-8 h-8 bg-signal-blue rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-ink rounded-full" />
          </div>
          Agent Passport
        </div>
        <Link 
          to="/console" 
          className="px-6 py-2 border border-steel/50 hover:bg-steel/20 rounded font-display uppercase tracking-wider text-sm transition-colors"
        >
          Enter Control Room
        </Link>
      </nav>

      {/* HTML Content Overlay */}
      <div className="relative z-10 w-full pointer-events-none">
        
        {/* Scene 1: Hero */}
        <section className="scene-section h-[120vh] flex flex-col justify-center px-8 lg:px-24">
          <div className="max-w-4xl pointer-events-auto">
            <h1 className="font-voice italic text-6xl lg:text-8xl font-bold leading-tight mb-8">
              Let AI buy. <br/> <span className="text-mist">Safely.</span>
            </h1>
            <p className="font-body text-xl lg:text-2xl text-mist max-w-2xl leading-relaxed mb-12">
              A deterministic policy firewall that sits between autonomous buyer agents and your checkout. Inspect, negotiate, and block actions in milliseconds.
            </p>
            <Link 
              to="/console" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-signal-blue text-ink rounded-lg font-display font-bold text-lg uppercase tracking-wider hover:bg-signal-blue/90 transition-colors"
            >
              Watch it live
              <div className="w-2 h-2 rounded-full bg-ink animate-pulse" />
            </Link>
          </div>
        </section>

        {/* Scene 2: Mechanism */}
        <section className="scene-section h-[150vh] flex flex-col justify-center px-8 lg:px-24">
          <div className="max-w-2xl ml-auto pointer-events-auto">
            <p className="font-voice italic text-3xl lg:text-4xl text-paper leading-relaxed mb-8">
              Every agent action passes through one deterministic gate before it becomes money.
            </p>
            <p className="font-body text-xl text-mist">
              Agent intent → Catalog limits → Policy firewall → Audit log.
            </p>
          </div>
        </section>

        {/* Scene 3: Problem */}
        <section className="scene-section h-[150vh] flex items-center px-8 lg:px-24">
          <div className="max-w-3xl pointer-events-auto">
            <h2 className="font-voice italic text-5xl lg:text-6xl font-bold mb-8">
              Agents operate at superhuman speed. Your checkout was built for humans.
            </h2>
            <p className="font-body text-2xl text-mist leading-relaxed">
              Without a deterministic gateway, you either block all AI traffic or risk unpredictable, unauthorized transactions at scale.
            </p>
          </div>
        </section>

        {/* Scene 4: Reconverged Reveal */}
        <section className="scene-section h-[120vh] flex flex-col items-center justify-center px-8 text-center">
          <div className="pointer-events-auto">
            <h2 className="font-voice italic text-6xl lg:text-8xl font-bold mb-6">Agent Passport</h2>
            <p className="font-body text-2xl text-mist max-w-2xl mx-auto mb-12">
              The missing authorization layer for the autonomous web.
            </p>
            <Link 
              to="/console" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-signal-blue text-ink rounded-lg font-display font-bold text-lg uppercase tracking-wider hover:bg-signal-blue/90 transition-colors"
            >
              Watch it live
            </Link>
          </div>
        </section>

        {/* Scene 5: Proof / Stats */}
        <section className="scene-section h-[120vh] flex items-center px-8 lg:px-24">
          <div className="w-full pointer-events-auto grid grid-cols-1 md:grid-cols-2 gap-24">
            <div>
              <h2 className="font-voice italic text-4xl lg:text-5xl font-bold mb-6">Built for machine scale.</h2>
              <p className="font-body text-xl text-mist">
                Every decision is logged, mathematically evaluated against your policy config, and returned in milliseconds. Zero hallucinations in the authorization layer.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {[
                { stat: "5", label: "Deterministic rules enforced" },
                { stat: "100%", label: "Of declines logged & explained" },
                { stat: "0", label: "Unauthorized payments" },
                { stat: "<200ms", label: "Average verdict time" },
              ].map((item, i) => (
                <div key={i}>
                  <Data className="text-5xl font-bold text-signal-blue block mb-2">{item.stat}</Data>
                  <span className="font-body text-mist text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scene 6: Footer */}
        <section className="scene-section h-[100vh] flex flex-col items-center justify-center">
          <div className="pointer-events-auto flex flex-col items-center">
            <h2 className="font-voice italic text-4xl lg:text-5xl font-bold mb-12">Ready to secure your catalog?</h2>
            <Link 
              to="/console" 
              className="px-8 py-4 border border-signal-blue text-signal-blue rounded-lg font-display font-bold uppercase tracking-wider hover:bg-signal-blue hover:text-ink transition-colors"
            >
              Enter the Control Room
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
