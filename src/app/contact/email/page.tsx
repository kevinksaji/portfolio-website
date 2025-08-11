"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// API endpoint for sending emails
const EMAIL_API_ENDPOINT = "/api/contact/send";

export default function EmailContact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Using our custom Nodemailer API endpoint
      const response = await fetch(EMAIL_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ email: "", subject: "", message: "" });
        setShowSuccess(true);
        
        // Redirect to homepage after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background pt-14 px-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-6xl md:text-7xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Send me a message.
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            I&apos;m always open to new opportunities, collaborations, and interesting conversations!
          </motion.p>
        </div>

        {/* Contact Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Your Email
            </label>
            <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-2 sm:p-3">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full text-sm sm:text-base border-0 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 transition-all bg-card text-foreground placeholder:text-muted-foreground shadow-none ring-0 outline-none"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
              Subject
            </label>
            <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-2 sm:p-3">
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What's this about?"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full text-sm sm:text-base border-0 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 transition-all bg-card text-foreground placeholder:text-muted-foreground shadow-none ring-0 outline-none"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Message
            </label>
            <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-2 sm:p-3">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell me more about what you'd like to discuss..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full text-sm sm:text-base border-0 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 transition-all resize-none bg-card text-foreground placeholder:text-muted-foreground shadow-none ring-0 outline-none"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="outline"
              disabled={isSubmitting}
              className="py-2 px-6 rounded-xl border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaPaperPlane className="w-4 h-4 mr-2" />
                  Send Message
                </div>
              )}
            </Button>
          </div>

          {/* Error Message Only */}
          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-center"
            >
              ❌ Something went wrong. Please try again or contact me through other channels.
            </motion.div>
          )}
        </motion.form>

        {/* Success Animation Overlay */}
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2
              }}
            >
              {/* Tick Icon */}
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.4
                }}
              >
                <FaCheck className="w-12 h-12 text-white" />
              </motion.div>
              
              {/* Success Text */}
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Message Sent Successfully!
              </motion.h2>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
