const animations = [
  'bounce',
  'flash',
  'pulse',
  'rotate',
  'rubberBand',
  'shake',
  'swing',
  'tada',
  'wobble',
] as const;

export function getRandomAnimation() {
  return animations[Math.floor(Math.random() * animations.length)];
}
