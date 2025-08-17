// email crafting page
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { submitContactForm } from "./actions";

/**
 * Contact form component using Next.js Form with server actions
 * Handles email, subject, and message submission
 */
export default function EmailContact() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  
  // Next.js Form state management using useActionState
  const [state, formAction] = useActionState(submitContactForm, null);
  
  // Reset form and redirect on successful submission
  useEffect(() => {
    if (state?.success) {
      // Reset form
      formRef.current?.reset();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [state?.success, router]);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background pt-14 px-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
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

        {/* Contact Form - Using Next.js Form Component */}
        <motion.form 
          ref={formRef}
          action={formAction}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Email Input Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Your Email
            </label>
            <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-2 sm:p-3">
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your.email@example.com"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full text-sm sm:text-base border-0 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 transition-all bg-card text-foreground placeholder:text-muted-foreground shadow-none ring-0 outline-none [&:-webkit-autofill]:bg-card [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--card))_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--card))_inset] [&:-webkit-autofill]:border-0 [&:-webkit-autofill]:-webkit-text-fill-color:hsl(var(--foreground)) [&:-webkit-autofill]:caret-color:hsl(var(--foreground)) [&:autofill]:bg-card [&:autofill]:text-foreground [&:autofill]:border-0"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              />
            </div>
          </div>

          {/* Subject Input Field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
              Subject
            </label>
            <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-2 sm:p-3">
              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="What's this about?"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full text-sm sm:text-base border-0 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 transition-all bg-card text-foreground placeholder:text-muted-foreground shadow-none ring-0 outline-none [&:-webkit-autofill]:bg-card [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--card))_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--card))_inset] [&:-webkit-autofill]:border-0 [&:-webkit-autofill]:-webkit-text-fill-color:hsl(var(--foreground)) [&:-webkit-autofill]:caret-color:hsl(var(--foreground)) [&:autofill]:bg-card [&:autofill]:text-foreground [&:autofill]:border-0"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              />
            </div>
          </div>

          {/* Message Textarea Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Message
            </label>
            <div className="bg-card rounded-2xl border border-border/50 shadow-lg p-2 sm:p-3">
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder="Tell me more about what you'd like to discuss..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full text-sm sm:text-base border-0 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 transition-all resize-none bg-card text-foreground placeholder:text-muted-foreground shadow-none ring-0 outline-none [&:-webkit-autofill]:bg-card [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--card))_inset] dark:[&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--card))_inset] [&:-webkit-autofill]:border-0 [&:-webkit-autofill]:-webkit-text-fill-color:hsl(var(--foreground)) [&:-webkit-autofill]:caret-color:hsl(var(--foreground)) [&:autofill]:bg-card [&:autofill]:text-foreground [&:autofill]:border-0"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              />
            </div>
          </div>

          {/* Submit Button - Using Next.js Form Status */}
          <div className="flex justify-end">
            <SubmitButton />
          </div>

          {/* Error Message Display */}
          {state?.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-center"
            >
              ❌ {state.error}
            </motion.div>
          )}
        </motion.form>

        {/* Success Animation Overlay */}
        {state?.success && (
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
              {/* Success Checkmark Icon */}
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
              
              {/* Success Message */}
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

/**
 * Submit button component using Next.js Form status
 * Automatically shows loading state during form submission
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      variant="outline"
      disabled={pending}
      className="py-2 px-6 rounded-xl border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
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
  );
}
