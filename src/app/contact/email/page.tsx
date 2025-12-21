// email crafting page
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRef, useEffect } from "react";
import { FaPaperPlane, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { submitContactForm } from "./actions";
import { cn } from "@/lib/utils";

/**
 * Contact form component using Next.js Form with server actions
 * Handles email, subject, and message submission
 */
export default function EmailContact() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const fieldWrapperClassName =
    "bg-card rounded-2xl border border-border/50 shadow-lg p-2 sm:p-3";

  const fieldClassName =
    "w-full h-auto text-sm sm:text-base border-0 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-card text-foreground placeholder:text-muted-foreground shadow-none ring-0 outline-none transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6">
            Send me a message.
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            I&apos;m always open to new opportunities, collaborations, and interesting conversations!
          </p>
        </div>

        {/* Contact Form - Using Next.js Form Component */}
        <form
          ref={formRef}
          action={formAction}
          className="space-y-6"
        >
          {/* Email Input Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Your Email
            </label>
            <div className={fieldWrapperClassName}>
              <Input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your.email@example.com"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className={fieldClassName}
              />
            </div>
          </div>

          {/* Subject Input Field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
              Subject
            </label>
            <div className={fieldWrapperClassName}>
              <Input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="What's this about?"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className={fieldClassName}
              />
            </div>
          </div>

          {/* Message Textarea Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Message
            </label>
            <div className={fieldWrapperClassName}>
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
                className={cn(fieldClassName, "resize-none")}
              />
            </div>
          </div>

          {/* Submit Button - Using Next.js Form Status */}
          <div className="flex justify-end">
            <SubmitButton />
          </div>

          {/* Error Message Display */}
          {state?.error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-center">
              ❌ {state.error}
            </div>
          )}
        </form>

        {/* Success Animation Overlay */}
        {state?.success && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          >
            <div className="text-center">
              {/* Success Checkmark Icon */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center">
                <FaCheck className="w-12 h-12 text-white" />
              </div>

              {/* Success Message */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Message Sent Successfully!
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
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
