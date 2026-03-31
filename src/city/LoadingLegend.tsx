import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Route, TreePine, Building2, Bus, AlertTriangle, Activity, type LucideIcon, Bike, ArrowRight } from 'lucide-react';
import { useLayerStore, type LayerKey, REVEAL_SEQUENCE } from '../stores/layerStore';
// @ts-ignore
import Magnet from './Magnet';
// @ts-ignore
import TextType from './TextType';
import './TextType.css';

// Context for exclusive magnet activation
interface MagnetContextType {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

const MagnetContext = createContext<MagnetContextType>({
  activeId: null,
  setActiveId: () => {},
});

// Calculate the reveal delay for a set of layers (use the MAX delay since isRevealed waits for ALL)
function getRevealDelay(layers: LayerKey[]): number {
  let maxDelay = 0;
  for (const group of REVEAL_SEQUENCE) {
    if (layers.some(l => group.layers.includes(l))) {
      maxDelay = Math.max(maxDelay, group.delay);
    }
  }
  return maxDelay;
}

// Circular progress ring component
interface CircularProgressProps {
  progress: number; // 0-1
  size: number;
  strokeWidth?: number;
  color: string;
}

function CircularProgress({
  progress,
  size,
  strokeWidth = 2.5,
  color,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="absolute inset-0 -rotate-90"
      style={{ pointerEvents: 'none' }}
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={0.15}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

// Icon component with circular progress animation
interface LoadingIconProps {
  id: string;
  icon: LucideIcon;
  color: string;
  label: string;
  size?: 'sm' | 'md';
  layers: LayerKey[];
}

function LoadingIcon({
  id,
  icon: Icon,
  color,
  label,
  size = 'md',
  layers,
}: LoadingIconProps) {
  const dimensions = size === 'sm' ? 20 : 32;
  const iconSize = size === 'sm' ? 10 : 16;
  const strokeWidth = size === 'sm' ? 1.5 : 2;

  const revealed = useLayerStore((state) => state.revealed);
  const startTime = useLayerStore((state) => state.startTime);
  const setHoveredLayers = useLayerStore((state) => state.setHoveredLayers);
  const isRevealed = layers.every(l => revealed[l]);

  const { activeId, setActiveId } = useContext(MagnetContext);

  // Track progress animation
  const [progress, setProgress] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  // Get the delay for this layer group
  const revealDelay = getRevealDelay(layers);

  // Handle magnet activation
  const handleMagnetChange = useCallback((active: boolean) => {
    if (active) {
      setActiveId(id);
    } else if (activeId === id) {
      setActiveId(null);
    }
  }, [id, activeId, setActiveId]);

  // Is this icon's magnet disabled? (another icon is active OR not revealed)
  const isMagnetDisabled = !isRevealed || (activeId !== null && activeId !== id);

  // Animate progress based on startTime from store
  useEffect(() => {
    // If this layer reveals immediately, show full progress
    if (revealDelay === 0) {
      setProgress(1);
      if (isRevealed) setShowPulse(true);
      return;
    }

    // No start time yet - wait
    if (startTime === null) {
      return;
    }

    // Animate progress from 0 to 100% linearly based on elapsed time
    let rafId: number;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      // Progress reaches 100% exactly at revealDelay - linear interpolation
      const p = Math.min(1, elapsed / revealDelay);
      setProgress(p);

      // Show pulse when we hit 100%
      if (p >= 1 && !showPulse) {
        setShowPulse(true);
      }

      // Keep animating until we reach 100%
      if (p < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [revealDelay, startTime]);

  // Reset pulse after animation
  useEffect(() => {
    if (showPulse) {
      const timer = setTimeout(() => setShowPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [showPulse]);

  // Handle hover events for layer highlighting
  const handleMouseEnter = useCallback(() => {
    if (isRevealed) {
      setHoveredLayers(layers);
    }
  }, [isRevealed, layers, setHoveredLayers]);

  const handleMouseLeave = useCallback(() => {
    setHoveredLayers(null);
  }, [setHoveredLayers]);

  const isActive = activeId === id;

  return (
    <div className="relative flex items-center">
      {/* Label to the left of icon */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-full mr-4 flex items-center bg-espresso/70 backdrop-blur-sm rounded-full px-3 py-1.5"
          >
            <TextType
              text={label}
              typingSpeed={25}
              showCursor={true}
              cursorCharacter="_"
              loop={false}
              className="font-mono text-xs !whitespace-nowrap"
              style={{ color, whiteSpace: 'nowrap' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Magnet
        padding={12}
        magnetStrength={2}
        disabled={isMagnetDisabled}
        onActiveChange={handleMagnetChange}
      >
        <motion.div
          className="relative flex items-center justify-center rounded-full cursor-pointer"
          style={{
            width: dimensions,
            height: dimensions,
            backgroundColor: `${color}20`,
          }}
          animate={{
            opacity: isRevealed ? 1 : 0.5 + progress * 0.4,
            scale: isRevealed ? 1 : 0.92 + progress * 0.08,
          }}
          transition={{ duration: 0.3 }}
          whileHover={isRevealed ? { scale: 1.1 } : {}}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Circular progress (visible while loading) */}
          {!isRevealed && progress > 0 && (
            <CircularProgress
              progress={progress}
              size={dimensions}
              strokeWidth={strokeWidth}
              color={color}
            />
          )}

          {/* Completed ring */}
          {isRevealed && (
            <CircularProgress
              progress={1}
              size={dimensions}
              strokeWidth={strokeWidth}
              color={color}
            />
          )}

          {/* Pulse ring on completion */}
          {showPulse && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `${strokeWidth}px solid ${color}` }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}

          {/* Icon */}
          <Icon size={iconSize} style={{ color }} />
        </motion.div>
      </Magnet>
    </div>
  );
}

// Sub-icons for the Data group - colors with 70% opacity
const DATA_SUB_ICONS: { id: string; icon: LucideIcon; color: string; label: string; layers: LayerKey[] }[] = [
  { id: 'busStops', icon: Bus, color: '#0284c7', label: 'Amenities', layers: ['busStops'] },
  { id: 'bicingStations', icon: Bike, color: '#dc2626', label: 'Health', layers: ['bicingStations'] },
  { id: 'trafficViolations', icon: AlertTriangle, color: '#ea580c', label: 'Incidents', layers: ['trafficViolations'] },
  { id: 'flowParticles', icon: Activity, color: '#ea580c', label: 'Flow', layers: ['flowParticles'] },
];

export function LoadingLegend() {
  // Track which icon's magnet is active (for exclusive activation)
  const [activeId, setActiveId] = useState<string | null>(null);


  const handleExplore = () => {
    window.location.href = '/explore';
  };

  return (
    <MagnetContext.Provider value={{ activeId, setActiveId }}>
            {/* Vertical icon column - right side, vertically centered */}
            <div className="absolute z-50 top-0 right-0 h-full flex flex-col justify-center pr-1">
              <motion.div
                className="flex flex-col items-center gap-2 rounded-full px-2 py-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Infrastructure */}
                <LoadingIcon
                  id="roads"
                  icon={Route}
                  color="#c6a181"
                  label="Infrastructure"
                  layers={['roads']}
                />

                {/* Canopy */}
                <LoadingIcon
                  id="trees"
                  icon={TreePine}
                  color="#16a34a"
                  label="Canopy"
                  layers={['trees']}
                />

                {/* Data group - encapsulated by orange ring */}
                <div
                  className="relative flex flex-col items-center gap-2 py-2 px-1.5 rounded-full"
                  style={{
                    border: '1.5px solid rgba(234, 88, 12, 0.4)',
                    backgroundColor: 'rgba(234, 88, 12, 0.05)',
                  }}
                >
                  {DATA_SUB_ICONS.map(({ id, icon, color, label, layers }) => (
                    <LoadingIcon
                      key={id}
                      id={id}
                      icon={icon}
                      color={color}
                      label={label}
                      size="sm"
                      layers={layers}
                    />
                  ))}
                </div>

                {/* Built environment */}
                <LoadingIcon
                  id="buildings"
                  icon={Building2}
                  color="#7f5e46"
                  label="Built Environment"
                  layers={['buildings']}
                />

                {/* Explore button - same size as icons */}
                <motion.button
                  onClick={handleExplore}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-linen/10 hover:bg-linen/20 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Explore full city"
                >
                  <ArrowRight size={16} className="text-linen/60" />
                </motion.button>
              </motion.div>
            </div>
    </MagnetContext.Provider>
  );
}
