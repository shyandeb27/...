export interface ApologyData {
  recipientName: string;
  senderName: string;
  whatHappened: string;
  whatIllDoDifferently: string;
}

export type EnvelopeState = 'closed' | 'opening' | 'opened';

export interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  type: 'heart' | 'petal' | 'sparkle';
  oscillationSpeed: number;
  oscillationDistance: number;
  age: number;
  lifespan: number;
}
