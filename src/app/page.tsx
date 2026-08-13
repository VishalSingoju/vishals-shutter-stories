"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    console.log("📸 Vishal's Shutter Stories");
    console.log("🎞️ Website development in progress...");
    console.log("❤️ Made with love by Vishal Singoju");
    console.log("✅ Website successfully loaded.");
    console.log("🚀 Vercel deployment test successful.");
  }, []);

  return (
    <main className="container">
      <section className="film-frame">
        <div className="eyebrow">Vishal&apos;s Shutter Stories</div>

        <h1>Website Under Development</h1>

        <p className="development">
          Just like <span>film.</span>
          <br />
          Good stories take time to develop.
        </p>

        <div className="line" />

        <p className="message">
          The gallery is currently being developed.
          <br />
          Meanwhile, the photographer is probably somewhere chasing good
          light and pretending it was planned.
        </p>

        <span className="shutter" />

        <div className="footer">
          Made with love by <strong>Vishal Singoju</strong>
          <br />
          <br />
          Vishal&apos;s Shutter Stories
        </div>
      </section>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          min-height: 100vh;
          background: #0b0b0b;
          color: #f5f5f5;
          font-family: "Inter", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
      `}</style>

      <style jsx>{`
        .container {
          width: 90%;
          max-width: 900px;
          text-align: center;
          margin: 0 auto;
        }

        .film-frame {
          border: 1px solid #2a2a2a;
          padding: 70px 30px;
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.03),
            transparent
          );
        }

        .film-frame::before,
        .film-frame::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 8px;
          background: repeating-linear-gradient(
            90deg,
            #171717 0px,
            #171717 20px,
            #0b0b0b 20px,
            #0b0b0b 35px
          );
        }

        .film-frame::before {
          top: 0;
        }

        .film-frame::after {
          bottom: 0;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 5px;
          font-size: 11px;
          color: #888;
          margin-bottom: 25px;
        }

        h1 {
          font-family: "Playfair Display", serif;
          font-size: clamp(42px, 8vw, 82px);
          font-weight: 400;
          line-height: 1;
          margin-bottom: 25px;
        }

        .development {
          font-size: clamp(18px, 3vw, 27px);
          font-weight: 300;
          color: #c9c9c9;
          margin-bottom: 35px;
        }

        .development span {
          color: #fff;
          font-weight: 500;
        }

        .line {
          width: 70px;
          height: 1px;
          background: #555;
          margin: 0 auto 30px;
        }

        .message {
          max-width: 550px;
          margin: auto;
          color: #777;
          font-size: 14px;
          line-height: 1.8;
        }

        .footer {
          margin-top: 45px;
          font-size: 12px;
          letter-spacing: 1px;
          color: #666;
        }

        .footer strong {
          color: #aaa;
          font-weight: 400;
        }

        .shutter {
          display: inline-block;
          margin-top: 30px;
          width: 8px;
          height: 8px;
          border: 1px solid #888;
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }

        @media (max-width: 600px) {
          .film-frame {
            padding: 60px 20px;
          }

          .message {
            font-size: 13px;
          }
        }
      `}</style>
    </main>
  );
}