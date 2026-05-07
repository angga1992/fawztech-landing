"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-28 lg:py-40 border-t border-black/5 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 grid-bg opacity-20 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] glow-orb opacity-30"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-12 gap-8 sm:gap-10">
          <div className="col-span-12 md:col-span-6">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] sm:tracking-[0.3em] text-electric flex items-center gap-3 font-mono">
              <span className="w-6 sm:w-8 h-px bg-electric" /> 06 — Contact
            </p>
            <h2 className="mt-5 sm:mt-6 font-display font-medium text-[clamp(2.5rem,9vw,7rem)] leading-[0.9] tracking-[-0.04em] text-balance">
              Mulai{" "}
              <em className="text-plasma not-italic font-light">proyek</em>
              <br />
              berikutnya.
            </h2>

            <div className="mt-10 sm:mt-12 space-y-5 sm:space-y-6 text-sm">
              <div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-ink-mute mb-1 font-mono">
                  Email
                </div>
                <a
                  href="mailto:hello@nexvoid.id"
                  className="font-display font-medium text-xl sm:text-2xl hover:text-electric transition-colors break-all"
                >
                  hello@nexvoid.id
                </a>
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-ink-mute mb-1 font-mono">
                  Phone
                </div>
                <a
                  href="tel:+62224532324"
                  className="font-display font-medium text-xl sm:text-2xl hover:text-electric transition-colors"
                >
                  (022) 4532324
                </a>
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-ink-mute mb-1 font-mono">
                  Studio
                </div>
                <address className="font-display text-lg sm:text-xl not-italic text-ink-dim">
                  Jl. Asia Afrika No. 1
                  <br />
                  Kota Bandung, Jawa Barat
                </address>
              </div>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="col-span-12 md:col-span-6 md:col-start-7 rounded-2xl sm:rounded-3xl border border-black/10 bg-white/60 backdrop-blur p-6 sm:p-8 lg:p-10"
          >
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-ink-mute mb-6 sm:mb-8 font-mono">
              <span>Brief.form</span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>

            <div className="space-y-5">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Company" name="company" />
              <Field
                label="Project budget"
                name="budget"
                placeholder="e.g. IDR 500M – 1B"
              />
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-ink-mute mb-2 font-mono">
                  About the project
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full bg-transparent border-b border-black/15 focus:border-electric py-2 text-sm text-ink placeholder:text-ink-mute focus:outline-none transition-colors resize-none"
                  placeholder="Mobile app, ERP, AI integration, atau campuran ketiganya…"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sent}
              className="group mt-8 sm:mt-10 w-full inline-flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 rounded-full bg-ink text-void-950 hover:bg-electric hover:text-void-950 transition-colors disabled:opacity-60"
            >
              <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.2em] sm:tracking-[0.22em] font-mono">
                {sent ? "Brief received" : "Send brief"}
              </span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">
                {sent ? "✓" : "↗"}
              </span>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-ink-mute mb-2 font-mono"
      >
        {label}
        {required && <span className="text-electric"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-black/15 focus:border-electric py-2 text-sm text-ink placeholder:text-ink-mute focus:outline-none transition-colors"
      />
    </div>
  );
}
