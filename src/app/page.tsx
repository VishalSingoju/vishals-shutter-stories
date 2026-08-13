"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({ name: "", email: "", idea: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    console.log("📸 Vishal's Shutter Stories");
    console.log("🎞️ Website development in progress...");
    console.log("❤️ Made with love by Vishal Singoju");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // Sending data to our Next.js backend API
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", idea: "" }); // Clear the form
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
      setStatus("error");
    }
  };

  return (
    <main className="container">
      <section className="film-frame">
        <div className="eyebrow">Vishal&apos;s Shutter Stories</div>
        <h1>Website Under Development</h1>
        <p className="development">
          Just like <span>film.</span><br />
          Good stories take time to develop.
        </p>
        <div className="line" />
        <p className="message">
          The gallery is currently being developed.<br />
          Meanwhile, the photographer is probably somewhere chasing good light and pretending it was planned.
        </p>
        <span className="shutter" />

        {/* --- UPDATED IDEA SECTION --- */}
        <div className="idea-section">
          <h2>Drop an Idea</h2>
          
          {status === "success" ? (
            <div className="success-message">
              Thank you! Your idea has been saved to the database.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <textarea
                name="idea"
                value={formData.idea}
                onChange={handleChange}
                placeholder="Share your creative thoughts, shoot concepts, or feedback here..."
                required
              />
              <button type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Submitting..." : "Submit Idea"}
              </button>
              {status === "error" && <p className="error-text">Something went wrong. Please try again.</p>}
            </form>
          )}
        </div>
        {/* --------------------------- */}

        <div className="footer">
          Made with love by <strong>Vishal Singoju</strong><br /><br />
          Vishal&apos;s Shutter Stories
        </div>
      </section>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          min-height: 100vh;
          background: #0b0b0b;
          color: #f5f5f5;
          font-family: "Inter", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: auto;
        }
      `}</style>

      <style jsx>{`
        .container {
          width: 90%;
          max-width: 900px;
          text-align: center;
          margin: 40px auto;
        }
        .film-frame {
          border: 1px solid #2a2a2a;
          padding: 70px 30px;
          position: relative;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), transparent);
        }
        .film-frame::before, .film-frame::after {
          content: "";
          position: absolute;
          left: 0; right: 0; height: 8px;
          background: repeating-linear-gradient(90deg, #171717 0px, #171717 20px, #0b0b0b 20px, #0b0b0b 35px);
        }
        .film-frame::before { top: 0; }
        .film-frame::after { bottom: 0; }
        .eyebrow {
          text-transform: uppercase; letter-spacing: 5px; font-size: 11px; color: #888; margin-bottom: 25px;
        }
        h1 {
          font-family: "Playfair Display", serif; font-size: clamp(42px, 8vw, 82px); font-weight: 400; line-height: 1; margin-bottom: 25px;
        }
        .development { font-size: clamp(18px, 3vw, 27px); font-weight: 300; color: #c9c9c9; margin-bottom: 35px; }
        .development span { color: #fff; font-weight: 500; }
        .line { width: 70px; height: 1px; background: #555; margin: 0 auto 30px; }
        .message { max-width: 550px; margin: auto; color: #777; font-size: 14px; line-height: 1.8; }
        
        /* --- IDEA SECTION STYLES --- */
        .idea-section {
          margin: 50px auto 0;
          max-width: 550px;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: left;
        }
        .idea-section h2 {
          font-family: "Playfair Display", serif;
          font-size: 22px; font-weight: 400; color: #e0e0e0; margin-bottom: 20px; text-align: center;
        }
        form { display: flex; flex-direction: column; gap: 15px; }
        
        .input-group {
          display: flex; gap: 15px;
        }
        
        input, textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid #444;
          color: #f5f5f5;
          padding: 15px;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          border-radius: 4px;
          outline: none;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        
        textarea { min-height: 120px; resize: vertical; }
        input::placeholder, textarea::placeholder { color: #666; }
        input:focus, textarea:focus { border-color: #888; background: rgba(255, 255, 255, 0.06); }
        
        button {
          align-self: center; background: #f5f5f5; color: #0b0b0b; border: none; padding: 12px 30px;
          font-family: "Inter", sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 1px;
          text-transform: uppercase; cursor: pointer; border-radius: 2px;
          transition: background 0.3s ease, transform 0.1s ease;
        }
        button:hover:not(:disabled) { background: #d4d4d4; }
        button:active:not(:disabled) { transform: scale(0.98); }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .success-message {
          text-align: center; padding: 20px; background: rgba(255, 255, 255, 0.05); border: 1px solid #555; border-radius: 4px; color: #e0e0e0;
        }
        .error-text { color: #ff6b6b; font-size: 13px; text-align: center; margin-top: 10px; }
        /* --------------------------- */

        .footer { margin-top: 50px; font-size: 12px; letter-spacing: 1px; color: #666; }
        .footer strong { color: #aaa; font-weight: 400; }
        .shutter {
          display: inline-block; margin-top: 30px; width: 8px; height: 8px;
          border: 1px solid #888; border-radius: 50%; animation: blink 2s infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }

        @media (max-width: 600px) {
          .film-frame { padding: 60px 20px; }
          .message { font-size: 13px; }
          .idea-section { padding-top: 30px; }
          .input-group { flex-direction: column; }
        }
      `}</style>
    </main>
  );
}