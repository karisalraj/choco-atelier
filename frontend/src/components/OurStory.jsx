import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./OurStory.css";

gsap.registerPlugin(ScrollTrigger);

function OurStory() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const pieces = gsap.utils.toArray(".story-piece");
      const rings = gsap.utils.toArray(".story-ring");
      const revealItems = gsap.utils.toArray(".story-reveal");

      // Initial states
      gsap.set(revealItems, {
        y: 60,
        opacity: 0,
      });

      gsap.set(".story-center", {
        scale: 0.6,
        opacity: 0,
      });

      gsap.set(pieces, {
        scale: 0.5,
        opacity: 0,
      });

      gsap.set(rings, {
        scale: 0.7,
        opacity: 0,
        rotation: -30,
      });

      // Main cinematic scroll timeline
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2600",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      timeline
        .to(".story-kicker", {
          opacity: 1,
          y: 0,
          duration: 0.4,
        })

        .to(
          ".story-title-line",
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.7,
          },
          "-=0.1"
        )

        .to(
          ".story-center",
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.3"
        )

        .to(
          rings,
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            stagger: 0.1,
            duration: 0.8,
          },
          "-=0.5"
        )

        .to(
          pieces,
          {
            scale: 1,
            opacity: 1,
            stagger: 0.08,
            duration: 0.8,
            ease: "back.out(1.4)",
          },
          "-=0.5"
        )

        .to(
          ".story-center",
          {
            scale: 1.15,
            rotation: 8,
            duration: 0.8,
          }
        )

        .to(
          ".story-piece-one",
          {
            x: -80,
            y: -70,
            rotation: -35,
            duration: 0.8,
          },
          "<"
        )

        .to(
          ".story-piece-two",
          {
            x: 85,
            y: -55,
            rotation: 30,
            duration: 0.8,
          },
          "<"
        )

        .to(
          ".story-piece-three",
          {
            x: -75,
            y: 70,
            rotation: 25,
            duration: 0.8,
          },
          "<"
        )

        .to(
          ".story-piece-four",
          {
            x: 80,
            y: 65,
            rotation: -30,
            duration: 0.8,
          },
          "<"
        )

        .to(
          ".story-intro",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.4"
        )

        .to(
          ".story-copy",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          }
        )

        .to(
          ".story-values",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          }
        )

        .to(
          ".story-final",
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
          }
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="our-story"
      id="story"
    >
      <div className="our-story-noise" />

      <div className="our-story-container">

        {/* LEFT / CINEMATIC VISUAL */}

        <div className="story-visual">

          <div className="story-visual-label">
            <span>01</span>
            <span>THE BEGINNING</span>
          </div>

          <div className="story-orbit">

            <span className="story-ring story-ring-one" />
            <span className="story-ring story-ring-two" />
            <span className="story-ring story-ring-three" />

            <span className="story-piece story-piece-one" />
            <span className="story-piece story-piece-two" />
            <span className="story-piece story-piece-three" />
            <span className="story-piece story-piece-four" />

            <div className="story-center">

              <span className="story-center-monogram">
                CA
              </span>

              <span className="story-center-name">
                CHOCO
              </span>

              <span className="story-center-name">
                ATELIER
              </span>

            </div>

          </div>

          <div className="story-visual-bottom">
            <span>ARTISAN CHOCOLATE</span>
            <span>SMALL BATCH</span>
          </div>

        </div>

        {/* RIGHT / STORY CONTENT */}

        <div className="story-content">

          <div className="story-kicker">
            OUR STORY
          </div>

          <h2 className="story-title">

            <span className="story-title-line">
              It starts
            </span>

            <span className="story-title-line story-title-accent">
              with a detail.
            </span>

          </h2>

          <div className="story-intro">
            Chocolate is more than a sweet moment.
            It is texture, aroma, craftsmanship and
            anticipation — brought together in one
            unforgettable experience.
          </div>

          <div className="story-copy">
            <p>
              At Choco Atelier, every collection begins
              with a desire to make chocolate feel
              extraordinary.
            </p>

            <p>
              From the first selection to the final
              presentation, we focus on the details that
              transform a simple box of chocolate into
              something worth remembering.
            </p>
          </div>

          <div className="story-values">

            <article className="story-value">
              <span>01</span>

              <div>
                <small>THE CRAFT</small>
                <h3>Made with intention.</h3>
              </div>
            </article>

            <article className="story-value">
              <span>02</span>

              <div>
                <small>THE FLAVOUR</small>
                <h3>Balanced. Rich. Refined.</h3>
              </div>
            </article>

            <article className="story-value">
              <span>03</span>

              <div>
                <small>THE EXPERIENCE</small>
                <h3>Created to be remembered.</h3>
              </div>
            </article>

          </div>

          <div className="story-final">
            <span>CRAFTED SLOWLY.</span>
            <strong>MADE BEAUTIFULLY.</strong>
          </div>

        </div>

      </div>

      <div className="story-scroll-indicator">
        <span>SCROLL TO DISCOVER</span>
        <i />
      </div>

    </section>
  );
}

export default OurStory;