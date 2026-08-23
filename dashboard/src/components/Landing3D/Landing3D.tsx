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
  const cameraZRef = useRef(15); // Start at 15 for Logo

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
          const p = self.progress; // 0 to 1 across 5 sections
          let uP = 0;
          
          if (p < 0.2) {
            uP = 0; // 0-20%: Logo
            cameraZRef.current = 15;
          } else if (p < 0.4) {
            uP = ((p - 0.2) / 0.2) * 1.0; // 20-40%: Morph to Sphere
            // Push camera Z forward during this morph
            cameraZRef.current = 15 - (((p - 0.2) / 0.2) * 5); // 15 down to 10
          } else if (p < 0.6) {
            uP = 1.0 + ((p - 0.4) / 0.2) * 1.0; // 40-60%: Sphere to Clusters
            cameraZRef.current = 10;
          } else if (p < 0.8) {
            uP = 2.0 + ((p - 0.6) / 0.2) * 1.0; // 60-80%: Clusters to Lines
            cameraZRef.current = 10;
          } else {
            uP = 3.0 + ((p - 0.8) / 0.2) * 1.0; // 80-100%: Lines to 2D Grid
            cameraZRef.current = 10;
          }
          
          progressRef.current = uP;
        }
      }
    });

    const sections = containerRef.current.querySelectorAll('.scene-section');
    sections.forEach((sec, i) => {
      // Fade in/out each section text
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
      // Don't fade out the very last section completely so stats stay visible
      if (i < sections.length - 1) {
        gsap.to(sec, {
          opacity: 0,
          scrollTrigger: {
            trigger: sec,
            start: 'center center',
            end: 'bottom center',
            scrub: true,
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 text-paper bg-transparent font-sans">
      
      {/* 3D Background */}
      <Scene progressRef={progressRef} cameraZRef={cameraZRef} />

      {/* Nav for Landing */}
      <nav className="fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-50 mix-blend-difference pointer-events-auto">
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
        
        {/* Section 1: Logo (0-20%) */}
        <section className="scene-section h-[100vh] flex flex-col justify-center px-8 lg:px-24">
          <div className="max-w-4xl pointer-events-auto">
            <h1 className="font-voice italic text-6xl lg:text-8xl font-bold leading-tight mb-8">
              Step into the world of <br/> <span className="text-signal-blue">autonomous agents.</span>
            </h1>
          </div>
        </section>

        {/* Section 2: Sphere (20-40%) */}
        <section className="scene-section h-[100vh] flex flex-col justify-center px-8 lg:px-24 items-end text-right">
          <div className="max-w-2xl pointer-events-auto">
            <p className="font-voice italic text-5xl lg:text-6xl text-paper leading-relaxed mb-8">
              Agent networks are complex.
            </p>
            <p className="font-body text-2xl text-mist">
              Thousands of models interacting at superhuman speeds. 
            </p>
          </div>
        </section>

        {/* Section 3: Clusters (40-60%) */}
        <section className="scene-section h-[100vh] flex items-center px-8 lg:px-24">
          <div className="max-w-3xl pointer-events-auto">
            <h2 className="font-voice italic text-5xl lg:text-6xl font-bold mb-8">
              Fragmented intent. Unpredictable outcomes.
            </h2>
            <p className="font-body text-2xl text-mist leading-relaxed">
              Without a deterministic gateway, you either block all AI traffic or risk unauthorized transactions at scale.
            </p>
          </div>
        </section>

        {/* Section 4: Lines (60-80%) */}
        <section className="scene-section h-[100vh] flex flex-col items-center justify-center px-8 text-center">
          <div className="pointer-events-auto">
            <h2 className="font-voice italic text-6xl lg:text-8xl font-bold mb-6">Agent Passport</h2>
            <p className="font-body text-2xl text-mist max-w-2xl mx-auto mb-12">
              The missing authorization layer. Every agent action passes through one deterministic gate before it becomes money.
            </p>
          </div>
        </section>

        {/* Section 5: 2D Grid & Glassmorphism Stats (80-100%) */}
        <section className="scene-section h-[100vh] flex items-end justify-center pb-20 px-8">
          <div className="w-full max-w-5xl pointer-events-auto bg-white/5 backdrop-blur-md border border-steel/20 rounded-2xl p-12 shadow-premium transform transition-all translate-y-10 group-hover:translate-y-0">
            <h2 className="font-voice italic text-4xl lg:text-5xl font-bold mb-12 text-center">Built for machine scale.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { stat: "50k+", label: "Particles Rendered" },
                { stat: "100%", label: "Of intents evaluated" },
                { stat: "0", label: "Unauthorized payments" },
                { stat: "<10ms", label: "Average verdict time" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Data className="text-4xl lg:text-5xl font-bold text-signal-blue block mb-4">{item.stat}</Data>
                  <span className="font-display uppercase tracking-[0.05em] text-mist text-xs">{item.label}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link 
                to="/console" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-signal-blue text-ink rounded-lg font-display font-bold text-lg uppercase tracking-wider hover:bg-signal-blue/90 hover:-translate-y-1 transition-all"
              >
                Enter the Control Room
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
