import { create } from 'zustand';
import * as THREE from 'three';

interface KartState {
  // Local Player
  position: THREE.Vector3;
  rotation: THREE.Euler;
  speed: number;
  steering: number;
  lap: number;
  checkpoint: number;
  powerup: string | null;
  isDrifting: boolean;
  boostAmount: number;
  
  // Opponent (Interpolated)
  opponentPosition: THREE.Vector3;
  opponentRotation: THREE.Euler;
  opponentSpeed: number;
  opponentLap: number;
  opponentPowerup: string | null;

  // Game Match State
  gameState: 'loading' | 'lobby' | 'countdown' | 'racing' | 'finished';
  countdown: number;
  raceTime: number;

  // Actions
  setLocalState: (partial: Partial<KartState>) => void;
  setOpponentState: (partial: Partial<KartState>) => void;
  
  // Mobile Controls
  mobileControls: { forward: boolean; backward: boolean; left: boolean; right: boolean; drift: boolean; useItem: boolean };
  setMobileControls: (controls: Partial<KartState['mobileControls']>) => void;
}

export const useKartStore = create<KartState>((set) => ({
  position: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0),
  speed: 0,
  steering: 0,
  lap: 1,
  checkpoint: 0,
  powerup: null,
  isDrifting: false,
  boostAmount: 0,

  opponentPosition: new THREE.Vector3(0, 0, 0),
  opponentRotation: new THREE.Euler(0, 0, 0),
  opponentSpeed: 0,
  opponentLap: 1,
  opponentPowerup: null,

  gameState: 'loading',
  countdown: 3,
  raceTime: 0,

  setLocalState: (partial) => set((state) => ({ ...state, ...partial })),
  setOpponentState: (partial) => set((state) => ({ ...state, ...partial })),

  mobileControls: { forward: false, backward: false, left: false, right: false, drift: false, useItem: false },
  setMobileControls: (controls) => set((state) => ({ mobileControls: { ...state.mobileControls, ...controls } })),
}));
