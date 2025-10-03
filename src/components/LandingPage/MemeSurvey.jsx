import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const MemeSurvey = () => {
  const [step, setStep] = useState("initial");
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (step === "initial" && isInView) {
      const timer = setTimeout(() => {
        setStep("question");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, isInView]);

  const handleYes = () => {
    setStep("yes-response");
    setTimeout(() => setIsVisible(false), 4000);
  };

  const handleNo = () => {
    setStep("no-response");
    setTimeout(() => setIsVisible(false), 4000);
  };

  if (!isVisible) return null;

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-neutral-50 py-20"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <AnimatePresence mode="wait">
          {step === "initial" && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center min-h-[80vh] flex items-center justify-center"
            >
              <img
                src="/wait.png"
                alt="Wait"
                className="w-full max-w-xl mx-auto"
              />
            </motion.div>
          )}
          {step === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-[80vh] flex items-center justify-center"
            >
              <div className="text-center">
                <img
                  src="/think.jpg"
                  alt="Think"
                  className="w-48 h-48 mx-auto mb-12 object-cover rounded-lg"
                />
                <h3 className="text-2xl md:text-3xl font-medium mb-12 text-neutral-800 max-w-2xl mx-auto leading-relaxed">
                  Real talk: Do you struggle with finding time to build your
                  portfolio?
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleYes}
                    className="px-8 py-3.5 bg-[#fb8500] text-white font-semibold text-base rounded hover:bg-[#e07400] transition-all"
                  >
                    Yeah, it's rough
                  </button>
                  <button
                    onClick={handleNo}
                    className="px-8 py-3.5 bg-white border-2 border-neutral-300 text-neutral-700 font-semibold text-base rounded hover:border-neutral-400 transition-all"
                  >
                    Nah, I'm good
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {step === "yes-response" && (
            <motion.div
              key="yes-response"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-[80vh] flex items-center justify-center"
            >
              <div className="text-center">
                <img
                  src="/wfy.jpg"
                  alt="We feel you"
                  className="w-64 h-64 mx-auto mb-8 object-cover rounded-lg"
                />
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-800">
                  We get it
                </h3>
                <p className="text-lg text-neutral-600 max-w-md mx-auto">
                  Building a portfolio shouldn't take weeks. That's why AUREA
                  exists.
                </p>
              </div>
            </motion.div>
          )}
          {step === "no-response" && (
            <motion.div
              key="no-response"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-[80vh] flex items-center justify-center"
            >
              <div className="text-center">
                <img
                  src="/good-for-you.jpg"
                  alt="Nice"
                  className="w-64 h-64 mx-auto mb-8 object-cover rounded-lg"
                />
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-800">
                  Nice!
                </h3>
                <p className="text-lg text-neutral-600 max-w-md mx-auto">
                  Even so, AUREA can save you even more time. Just saying.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MemeSurvey;
