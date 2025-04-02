
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { AuthenticatedOnly, UnauthenticatedOnly } from '@/components/auth/AuthWrapper';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.div 
            className="flex flex-col gap-4 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block p-2 bg-muted rounded-lg mb-4">
              <img 
                src="/lovable-uploads/0d1e3e9b-51a0-4dff-87fc-047ce00b238a.png" 
                alt="Study Bee Logo" 
                className="h-20 w-20 object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-b from-[#f5d742] to-[#1e3a8a] text-transparent bg-clip-text">
              Master Various Subjects With Study Bee
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-[800px]">
              Personalized learning paths, spaced repetition, and AI-powered assessments
              to help you succeed in professional qualifications.
            </p>
          </motion.div>

          <UnauthenticatedOnly>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Create Account</Link>
              </Button>
            </motion.div>
          </UnauthenticatedOnly>

          <AuthenticatedOnly>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/dashboard">My Dashboard</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/qualifications">Browse Qualifications</Link>
              </Button>
            </motion.div>
          </AuthenticatedOnly>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
