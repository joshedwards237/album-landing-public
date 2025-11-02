import "@fontsource/great-vibes";
import "@fontsource/crimson-text/400.css";
import "@fontsource/crimson-text/600.css";
import "@fontsource/crimson-text/400-italic.css";
import "./index.css";
import Countdown from "./components/Countdown";
import { useEffect, useRef } from "react";

export default function App() {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const computeAverage = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        const w = 64, h = 64;
        canvas.width = w; canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let r = 0, g = 0, b = 0, c = 0;
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 48) continue; // skip near-transparent
          r += data[i]; g += data[i + 1]; b += data[i + 2]; c++;
        }
        if (c) {
          r = Math.round(r / c); g = Math.round(g / c); b = Math.round(b / c);
          // Slightly darken to serve as a background
          const factor = 0.75;
          r = Math.round(r * factor); g = Math.round(g * factor); b = Math.round(b * factor);
          document.documentElement.style.setProperty("--album-bg-rgb", `${r}, ${g}, ${b}`);
        }
      } catch (_) {
        // Ignore cross-origin issues or canvas errors
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      computeAverage();
    } else {
      img.addEventListener("load", computeAverage, { once: true });
    }

    return () => img.removeEventListener("load", computeAverage);
  }, []);

  return (
    <>
      <div className="snow-overlay" aria-hidden="true" />
      <main className="page">
        <h1 className="title">Good Folk</h1>

        {/* Replace src with your album artwork or hero image */}
        <img
          ref={imgRef}
          src="/hero-image.JPEG"
          alt="Good Folk Album Artwork"
          className="hero-image"
        />

        <p className="tagline">A Christmas album by Josh Edwards</p>
        <Countdown />

        <div className="links">
          <a href="https://open.spotify.com" className="link-button link-button-spotify" target="_blank" rel="noopener noreferrer">Spotify</a>
          <a href="https://music.apple.com" className="link-button link-button-apple" target="_blank" rel="noopener noreferrer">Apple Music</a>
          <a href="https://www.instagram.com/joshedwardsofficial/" target="_blank" rel="noopener noreferrer" className="link-button link-button-instagram">Instagram</a>
        </div>
      </main>
    </>
  );
}
