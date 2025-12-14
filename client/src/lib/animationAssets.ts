// Animation assets for Break Screens
// 24 total images: 12 for boy animations, 12 for girl animations
// Each of 4 animations has 3 images showing emotional arc: distress → crying → healing → hope

// Boy Animations
import boyAnim1Img1 from '@assets/ChatGPT_Image_14_déc._2025,_05_34_06_1765687552867.png';
import boyAnim1Img2 from '@assets/ChatGPT Image 3 nov. 2025, 23_07_27_1762207697459.png';
import boyAnim1Img3 from '@assets/ChatGPT Image 3 nov. 2025, 23_08_52_1762207742718.png';

import boyAnim2Img1 from '@assets/ChatGPT Image 3 nov. 2025, 23_08_52_1762216711000.png';
import boyAnim2Img2 from '@assets/ChatGPT Image 3 nov. 2025, 23_32_19_1762216733669.png';
import boyAnim2Img3 from '@assets/ChatGPT Image 3 nov. 2025, 23_00_18_1762216756091.png';

import boyAnim3Img1 from '@assets/ChatGPT Image 3 nov. 2025, 23_00_18_1762209169225.png';
import boyAnim3Img2 from '@assets/ChatGPT Image 3 nov. 2025, 23_35_55_1762209624312.png';
import boyAnim3Img3 from '@assets/ChatGPT Image 3 nov. 2025, 23_39_37_1762209655079.png';

import boyAnim4Img1 from '@assets/ChatGPT Image 3 nov. 2025, 23_39_37_1762209696501.png';
import boyAnim4Img2 from '@assets/ChatGPT Image 3 nov. 2025, 23_48_37_1762210126943.png';
import boyAnim4Img3 from '@assets/ChatGPT Image 4 nov. 2025, 00_36_58_1762213042349.png';

// Girl Animations
import girlAnim1Img1 from '@assets/ChatGPT Image 3 nov. 2025, 17_45_30_1762221432155.png';
import girlAnim1Img2 from '@assets/ChatGPT Image 3 nov. 2025, 23_55_53_1762221480866.png';
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
