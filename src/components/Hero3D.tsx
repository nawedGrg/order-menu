import { Suspense, lazy } from "react";

const Scene = lazy(() => import("./Hero3DScene"));

const Hero3D = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent to-primary/5">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground font-body text-sm">Loading experience...</p>
            </div>
          </div>
        }
      >
        <Scene />
      </Suspense>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center space-y-4 px-6">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground drop-shadow-lg">
            Fresh & Flavorful
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-body max-w-md mx-auto">
            Handcrafted dishes made with love, served with style
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero3D;
