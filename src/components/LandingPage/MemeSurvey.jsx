import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const MemeSurvey = () => {
  const [step, setStep] = useState("initial"); // initial, question, yes-response, no-response
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

  const handleStart = () => {
    setStep("question");
  };

  const handleYes = () => {
    setStep("yes-response");
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 4000);
  };

  const handleNo = () => {
    setStep("no-response");
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 4000);
  };

  if (!isVisible) return null;

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-white"
    >
      <div className="max-w-4xl mx-auto px-6 w-full">
        <AnimatePresence mode="wait">
          {/* Initial State - Wait meme */}
          {step === "initial" && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center min-h-[80vh] flex flex-col items-center justify-center"
            >
              {/* BIG wait.png image with simple fade in */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <img
                  src="/wait.png"
                  alt="Wait"
                  className="w-full max-w-2xl mx-auto object-contain"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Question State - Think meme */}
          {step === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center min-h-[80vh] flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <img
                  src="/think.jpg"
                  alt="Think"
                  className="w-64 h-64 mx-auto object-contain"
                />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-8 text-[#1a1a1a]"
              >
                Do you struggle with finding time to build your portfolio?
              </motion.h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  onClick={handleYes}
                  className="px-10 py-4 bg-[#fb8500] text-white font-bold text-lg rounded-lg hover:bg-[#e07400] transition-colors duration-200 min-w-[200px]"
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  YES, IT'S A NIGHTMARE
                </motion.button>
                <motion.button
                  onClick={handleNo}
                  className="px-10 py-4 border-2 border-[#fb8500] text-[#fb8500] font-bold text-lg rounded-lg hover:bg-[#fb8500] hover:text-white transition-colors duration-200 min-w-[200px]"
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  NAH, I'M GOOD
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Yes Response - I know that feel bro */}
          {step === "yes-response" && (
            <motion.div
              key="yes-response"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center min-h-[80vh] flex flex-col items-center justify-center"
            >
              <motion.div className="mb-6">
                <img
                  src="/wfy.jpg"
                  alt="I know that feel bro"
                  className="w-96 h-96 mx-auto object-contain"
                />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]"
              >
                WE FEEL YOU BRO
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600 mb-6"
              >
                That's exactly why we built AUREA. Let's fix that together!
              </motion.p>
            </motion.div>
          )}

          {/* No Response - Good for you bro */}
          {step === "no-response" && (
            <motion.div
              key="no-response"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center min-h-[80vh] flex flex-col items-center justify-center"
            >
              <motion.div className="mb-6">
                <img
                  src="/good-for-you.jpg"
                  alt="Good for you bro"
                  className="w-96 h-96 mx-auto object-contain"
                />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]"
              >
                GOOD FOR YOU BRO!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-600 mb-6"
              >
                But hey, AUREA can still make it even easier for you!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MemeSurvey;
