'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Clock, Heart } from 'lucide-react';
import { useState } from 'react';

// Import our enhanced components
import { Button, MotionButton } from '@/components/ui/Button';
import { Card, MotionCard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  fadeInUp, 
  scaleIn, 
  staggerContainer, 
  hoverScale, 
  hoverLift,
  springTransition 
} from '@/components/ui/motion-primitives';

export function InteractiveComponentsExample() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">
          Interactive Components Demo
        </h1>
        <p className="text-muted-foreground text-lg">
          Showcasing proper Framer Motion integration with TypeScript
        </p>
      </motion.div>

      {/* Button Examples */}
      <motion.section variants={fadeInUp} className="space-y-4">
        <h2 className="text-2xl font-semibold">Enhanced Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Regular button with animation prop */}
          <Button variant="field" size="lg" animated>
            <Target className="w-5 h-5" />
            Animated Button
          </Button>

          {/* Motion button with custom animations */}
          <MotionButton
            variant="trophy"
            size="lg"
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -1, 1, 0],
              boxShadow: "0 10px 30px rgba(251, 191, 36, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={springTransition}
          >
            <Trophy className="w-5 h-5" />
            Custom Motion
          </MotionButton>

          {/* Loading state with animated spinner */}
          <Button variant="stadium" size="lg" isLoading animated>
            Loading...
          </Button>
        </div>
      </motion.section>

      {/* Card Examples */}
      <motion.section variants={fadeInUp} className="space-y-4">
        <h2 className="text-2xl font-semibold">Interactive Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <MotionCard
              key={index}
              variant="glass"
              className="cursor-pointer"
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCard(activeCard === index ? null : index)}
              animate={{
                scale: activeCard === index ? 1.02 : 1,
                borderColor: activeCard === index ? "hsl(var(--primary))" : "transparent"
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: activeCard === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className="w-5 h-5 text-primary" />
                  </motion.div>
                  Card {index}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Click to activate with smooth animations
                </p>
                <AnimatePresence>
                  {activeCard === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-3 bg-primary/10 rounded-lg"
                    >
                      <p className="text-sm text-primary">
                        Extra content revealed with AnimatePresence!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </MotionCard>
          ))}
        </div>
      </motion.section>

      {/* Complex Animation Example */}
      <motion.section variants={fadeInUp} className="space-y-4">
        <h2 className="text-2xl font-semibold">Complex Animations</h2>
        <Card variant="premium" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Game Stats</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowModal(true)}
              animated
            >
              Show Modal
            </Button>
          </div>
          
          <motion.div 
            className="grid grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { icon: Trophy, label: "Wins", value: "42", color: "text-amber-500" },
              { icon: Target, label: "Accuracy", value: "89%", color: "text-emerald-500" },
              { icon: Clock, label: "Time", value: "2:34", color: "text-sky-500" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className="text-center p-4 bg-muted/50 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-8 h-8 mx-auto mb-2 ${stat.color}`}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  <stat.icon className="w-full h-full" />
                </motion.div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.section>

      {/* Modal Example */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-card border rounded-2xl p-6 max-w-md w-full shadow-2xl"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                transition={springTransition}
              >
                <h3 className="text-xl font-semibold mb-4">Modal Dialog</h3>
                <p className="text-muted-foreground mb-6">
                  This modal demonstrates proper entrance and exit animations 
                  with AnimatePresence and backdrop handling.
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowModal(false)}
                    animated
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="field" 
                    onClick={() => setShowModal(false)}
                    animated
                  >
                    Confirm
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}