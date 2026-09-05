"use client";

export interface GyroCoords {
  normX: number; // Smoothed, normalized -1 to 1 (left to right)
  normY: number; // Smoothed, normalized -1 to 1 (up to down)
}

export type GyroCallback = (coords: GyroCoords) => void;

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const listeners = new Set<GyroCallback>();

let listening = false;
let rafId: number | null = null;

// Target values from hardware sensor
let targetX = 0;
let targetY = 0;

// Filtered/interpolated values (buttery smooth 60/120fps, zero sensor jitter)
let currentX = 0;
let currentY = 0;

// Calibrated baseline holding angle (locked once to user's initial posture)
let betaBaseline: number | null = null;

function handleOrientation(e: DeviceOrientationEvent) {
  if (e.beta === null || e.gamma === null) return;

  // Filter extreme sensor gimbal flips
  const rawBeta = clamp(e.beta, 20, 85);
  const rawGamma = clamp(e.gamma, -40, 40);

  // Calibrate baseline ONCE on first reading so direction never inverts or flips
  if (betaBaseline === null) {
    betaBaseline = rawBeta;
  }

  // Dynamic delta from calibrated neutral holding angle
  // 20 degrees divisor provides crisp, more noticeable response to wrist tilts
  const deltaX = rawGamma;
  const deltaY = rawBeta - betaBaseline;

  targetX = clamp(deltaX / 20, -1, 1);
  targetY = clamp(deltaY / 20, -1, 1);
}

// Single RAF loop running strictly at native screen refresh rate
function animationLoop() {
  if (!listening) return;

  // Exponential lerp smoothing (0.1): silky, immediate response with zero jitter
  currentX += (targetX - currentX) * 0.1;
  currentY += (targetY - currentY) * 0.1;

  // Dispatch only once per display frame
  if (listeners.size > 0) {
    const coords: GyroCoords = {
      normX: currentX,
      normY: currentY,
    };
    listeners.forEach((callback) => {
      try {
        callback(coords);
      } catch {
        // Safe guard
      }
    });
  }

  rafId = requestAnimationFrame(animationLoop);
}

function startListening() {
  if (listening || typeof window === "undefined") return;

  const isIOS =
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
      .requestPermission === "function";

  const onGranted = () => {
    if (listening) return;
    listening = true;
    window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    rafId = requestAnimationFrame(animationLoop);
  };

  if (isIOS) {
    const requestPermissionAndListen = async () => {
      try {
        const response = await (
          DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
        ).requestPermission();
        if (response === "granted") {
          onGranted();
        }
      } catch {
        // User dismissed
      }
    };

    window.addEventListener("touchstart", requestPermissionAndListen, { once: true, passive: true });
  } else if ("DeviceOrientationEvent" in window) {
    onGranted();
  }
}

function stopListening() {
  if (!listening || typeof window === "undefined") return;
  window.removeEventListener("deviceorientation", handleOrientation);
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  listening = false;
  betaBaseline = null;
  currentX = 0;
  currentY = 0;
  targetX = 0;
  targetY = 0;
}

/**
 * Ultra-smooth, RAF-throttled, jitter-free gyroscope engine for mobile.
 * Uses locked baseline calibration (never flips direction) and liquid exponential smoothing.
 */
export function registerGyroscope(callback: GyroCallback): () => void {
  if (typeof window === "undefined") return () => {};

  listeners.add(callback);
  if (listeners.size === 1) {
    startListening();
  }

  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      stopListening();
    }
  };
}
