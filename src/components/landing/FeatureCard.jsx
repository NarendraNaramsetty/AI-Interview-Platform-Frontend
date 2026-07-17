import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

export default function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient,
  index = 0 
}) {
  const { theme } = useAuthStore();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring configs for smooth animation
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [10, -10]),
    { stiffness: 200, damping: 30 }
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-10, 10]),
    { stiffness: 200, damping: 30 }
  );

  // Shine effect position
  const shineX = useTransform(mouseX, [0, 1], ['0%', '100%']);
  const shineY = useTransform(mouseY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="h-full"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`relative h-full p-8 rounded-3xl border-2 overflow-hidden group cursor-pointer ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 border-gray-700/50'
            : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-200/50'
        }`}
      >
        {/* Animated shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle 200px at ${shineX} ${shineY}, rgba(255,255,255,0.1), transparent 80%)`,
          }}
        />

        {/* Gradient glow border effect */}
        <motion.div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
          initial={false}
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col" style={{ transform: "translateZ(30px)" }}>
          
          {/* Icon with animated gradient background */}
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-6"
          >
            <motion.div
              className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} p-4 shadow-lg`}
              animate={isHovered ? {
                boxShadow: [
                  "0 10px 30px rgba(0,0,0,0.1)",
                  "0 15px 40px rgba(34, 197, 94, 0.3)",
                  "0 10px 30px rgba(0,0,0,0.1)",
                ]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Icon className="w-full h-full text-white" strokeWidth={2} />
              
              {/* Floating particles around icon */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  animate={isHovered ? {
                    x: [0, Math.random() * 20 - 10],
                    y: [0, Math.random() * 20 - 10],
                    opacity: [0, 1, 0],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-3 leading-tight">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
              {title}
            </span>
          </h3>

          {/* Description */}
          <p className={`text-sm leading-relaxed flex-grow ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </p>

          {/* Hover indicator */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '100%' : '0%' }}
            transition={{ duration: 0.3 }}
            className={`mt-6 h-1 rounded-full bg-gradient-to-r ${gradient}`}
          />

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>

        {/* Corner accent */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isHovered ? { scale: 1, opacity: 0.2 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} blur-2xl`}
        />
      </motion.div>
    </motion.div>
  );
}
