import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Animated Background */}
      <div className="animated-bg" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [-10, 10, -10]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-[120px] mb-6"
        >
          🐷
        </motion.div>
        
        <h1 className="font-display text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          Oops! This piggy got lost. The page you're looking for doesn't exist.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button className="btn-primary gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Button 
            onClick={() => window.history.back()} 
            className="btn-secondary gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;