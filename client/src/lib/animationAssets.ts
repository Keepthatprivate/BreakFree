// Animation assets for Break Screens
// 24 total images: 12 for boy animations, 12 for girl animations
// Each of 4 animations has 3 images showing emotional arc: distress → crying → healing → hope
//
// IMPORTANT: These are string paths to assets in /public/assets/animations/
// They are NOT bundled - they load on-demand when the Quiz component needs them
// This reduces initial bundle size by ~60MB

const ANIMATION_BASE_PATH = '/assets/animations';

export type AnimationSequence = {
  images: [string, string, string];
};

export type GenderAnimations = {
  boy: AnimationSequence[];
  girl: AnimationSequence[];
};

export const animations: GenderAnimations = {
  boy: [
    {
      images: [
        `${ANIMATION_BASE_PATH}/boy-anim1-img1.png`,
        `${ANIMATION_BASE_PATH}/boy-anim1-img2.png`,
        `${ANIMATION_BASE_PATH}/boy-anim1-img3.png`,
      ],
    },
    {
      images: [
        `${ANIMATION_BASE_PATH}/boy-anim2-img1.png`,
        `${ANIMATION_BASE_PATH}/boy-anim2-img2.png`,
        `${ANIMATION_BASE_PATH}/boy-anim2-img3.png`,
      ],
    },
    {
      images: [
        `${ANIMATION_BASE_PATH}/boy-anim3-img1.png`,
        `${ANIMATION_BASE_PATH}/boy-anim3-img2.png`,
        `${ANIMATION_BASE_PATH}/boy-anim3-img3.png`,
      ],
    },
    {
      images: [
        `${ANIMATION_BASE_PATH}/boy-anim4-img1.png`,
        `${ANIMATION_BASE_PATH}/boy-anim4-img2.png`,
        `${ANIMATION_BASE_PATH}/boy-anim4-img3.png`,
      ],
    },
  ],
  girl: [
    {
      images: [
        `${ANIMATION_BASE_PATH}/girl-anim1-img1.png`,
        `${ANIMATION_BASE_PATH}/girl-anim1-img2.png`,
        `${ANIMATION_BASE_PATH}/girl-anim1-img3.png`,
      ],
    },
    {
      images: [
        `${ANIMATION_BASE_PATH}/girl-anim2-img1.png`,
        `${ANIMATION_BASE_PATH}/girl-anim2-img2.png`,
        `${ANIMATION_BASE_PATH}/girl-anim2-img3.png`,
      ],
    },
    {
      images: [
        `${ANIMATION_BASE_PATH}/girl-anim3-img1.png`,
        `${ANIMATION_BASE_PATH}/girl-anim3-img2.png`,
        `${ANIMATION_BASE_PATH}/girl-anim3-img3.png`,
      ],
    },
    {
      images: [
        `${ANIMATION_BASE_PATH}/girl-anim4-img1.png`,
        `${ANIMATION_BASE_PATH}/girl-anim4-img2.png`,
        `${ANIMATION_BASE_PATH}/girl-anim4-img3.png`,
      ],
    },
  ],
};
