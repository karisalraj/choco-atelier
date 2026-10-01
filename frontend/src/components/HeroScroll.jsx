
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HeroScroll.css";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;
const FRAME_PATH = "/frames/ezgif-frame-";

function getFramePath(index) {
  const frameNumber = String(index + 1).padStart(3, "0");
  return `${FRAME_PATH}${frameNumber}.jpg`;
}

function HeroScroll() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!section || !canvas || !context) return;

    let images = [];
    let loadedCount = 0;
    let currentFrame = 0;
    let animation;
    let resizeObserver;

    const getCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();

      return {
        width: rect.width,
        height: rect.height,
      };
    };

    const drawFrame = (frameIndex) => {
      const image = images[frameIndex];
      if (!image?.complete || !image.naturalWidth) return;

      const { width, height } = getCanvasSize();
      if (!width || !height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      // Fill the screen with one frame, preserving its aspect ratio.
      const scale = Math.max(
        width / image.naturalWidth,
        height / image.naturalHeight
      );

      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;

      
const isMobile = window.matchMedia("(max-width: 767px)").matches;

const mobileOffset = isMobile ? width * 0.15 : 0;

const x = (width - drawWidth) / 2 + mobileOffset;
const y = (height - drawHeight) / 2;

      context.drawImage(image, x, y, drawWidth, drawHeight);
    };

    const renderCurrentFrame = () => {
      drawFrame(currentFrame);
    };

    const loadFrames = () => {
      images = Array.from({ length: FRAME_COUNT }, (_, index) => {
        const image = new Image();

        image.onload = () => {
          loadedCount += 1;

          if (index === 0 || index === currentFrame) {
            renderCurrentFrame();
          }

          if (loadedCount === FRAME_COUNT) {
            ScrollTrigger.refresh();
          }
        };

        image.onerror = () => {
          console.error(`Could not load frame: ${getFramePath(index)}`);
        };

        image.src = getFramePath(index);
        return image;
      });
    };

    const playhead = { frame: 0 };

    animation = gsap.to(playhead, {
      frame: FRAME_COUNT - 1,
      ease: "none",
      onUpdate: () => {
        currentFrame = Math.round(playhead.frame);
        renderCurrentFrame();
      },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    resizeObserver = new ResizeObserver(() => {
      renderCurrentFrame();
    });

    resizeObserver.observe(canvas);

    loadFrames();

    return () => {
      animation?.scrollTrigger?.kill();
      animation?.kill();
      resizeObserver?.disconnect();
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, []);

  return (
    <section className="hero-scroll" id="home" ref={sectionRef}>
      <div className="hero-stage">
        <canvas
          className="hero-canvas"
          ref={canvasRef}
          aria-label="Cinematic chocolate animation"
        />

        <div className="hero-shade" />

        <div className="hero-copy">
          <p className="hero-eyebrow">CRAFTED WITH PASSION</p>

          <h1 className="hero-title">
            A Little More
            <br />
            Chocolate
          </h1>

          <p className="hero-description">
            Artisan chocolates crafted for
            <br className="desktop-break" />
            sweet moments in life.
          </p>

          <a className="hero-cta" href="#shop">
            Explore Collection
          </a>
        </div>

        <div className="hero-scroll-cue" aria-hidden="true">
          <span className="scroll-line" />
          <span>SCROLL TO EXPLORE</span>
        </div>
      </div>
    </section>
  );
}

export default HeroScroll;