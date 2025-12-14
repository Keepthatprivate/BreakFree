// Animation assets for Break Screens
// 24 total images: 12 for boy animations, 12 for girl animations
// Each of 4 animations has 3 images showing emotional arc: distress → crying → healing → hope

// Boy Animations
import boyAnim1Img1 from '@assets/ChatGPT_Image_14_déc._2025,_05_34_06_1765687552867.png';
import boyAnim1Img2 from '@assets/ChatGPT_Image_14_déc._2025,_05_37_20_1765687591926.png';
import boyAnim1Img3 from '@assets/ChatGPT_Image_14_déc._2025,_05_39_29_1765687684108.png';

import boyAnim2Img1 from '@assets/ChatGPT_Image_14_déc._2025,_05_39_29_1765687832136.png';
import boyAnim2Img2 from '@assets/ChatGPT_Image_14_déc._2025,_05_42_11_1765690518553.png';
import boyAnim2Img3 from '@assets/ChatGPT_Image_14_déc._2025,_06_33_59_1765690558979.png';

import boyAnim3Img1 from '@assets/ChatGPT_Image_14_déc._2025,_06_33_59_1765690596119.png';
import boyAnim3Img2 from '@assets/ChatGPT_Image_14_déc._2025,_05_45_03_1765690612426.png';
import boyAnim3Img3 from '@assets/ChatGPT_Image_14_déc._2025,_06_28_31_1765690633341.png';

import boyAnim4Img1 from '@assets/ChatGPTImage3nov.202523_39_37_1765690683401.png';
import boyAnim4Img2 from '@assets/ChatGPT_Image_14_déc._2025,_06_00_32_1765690703534.png';
import boyAnim4Img3 from '@assets/ChatGPT_Image_14_déc._2025,_06_33_56_1765690722405.png';

// Girl Animations
import girlAnim1Img1 from '@assets/ChatGPT_Image_14_déc._2025,_06_43_47_1765691050277.png';
import girlAnim1Img2 from '@assets/ChatGPT_Image_14_déc._2025,_06_19_08_1765691067705.png';
import girlAnim1Img3 from '@assets/ChatGPT Image 3 nov. 2025, 23_58_06_1762221503587.png';

import girlAnim2Img1 from '@assets/ChatGPT Image 3 nov. 2025, 23_58_06_1762210700504.png';
import girlAnim2Img2 from '@assets/ChatGPT Image 4 nov. 2025, 00_01_56_1762210925157.png';
import girlAnim2Img3 from '@assets/ChatGPT Image 4 nov. 2025, 00_04_08_1762211177295.png';

import girlAnim3Img1 from '@assets/ChatGPT Image 4 nov. 2025, 00_04_08_1762211269756.png';
import girlAnim3Img2 from '@assets/ChatGPT Image 4 nov. 2025, 00_08_51_1762211339720.png';
import girlAnim3Img3 from '@assets/ChatGPT Image 4 nov. 2025, 00_12_00_1762211527493.png';

import girlAnim4Img1 from '@assets/ChatGPT Image 4 nov. 2025, 00_12_00_1762211574138.png';
import girlAnim4Img2 from '@assets/ChatGPT Image 4 nov. 2025, 00_15_30_1762213071374.png';
import girlAnim4Img3 from '@assets/ChatGPT Image 4 nov. 2025, 00_34_35_1762213117495.png';

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
      images: [boyAnim1Img1, boyAnim1Img2, boyAnim1Img3],
    },
    {
      images: [boyAnim2Img1, boyAnim2Img2, boyAnim2Img3],
    },
    {
      images: [boyAnim3Img1, boyAnim3Img2, boyAnim3Img3],
    },
    {
      images: [boyAnim4Img1, boyAnim4Img2, boyAnim4Img3],
    },
  ],
  girl: [
    {
      images: [girlAnim1Img1, girlAnim1Img2, girlAnim1Img3],
    },
    {
      images: [girlAnim2Img1, girlAnim2Img2, girlAnim2Img3],
    },
    {
      images: [girlAnim3Img1, girlAnim3Img2, girlAnim3Img3],
    },
    {
      images: [girlAnim4Img1, girlAnim4Img2, girlAnim4Img3],
    },
  ],
};
