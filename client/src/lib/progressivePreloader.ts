type PreloadPriority = 'critical' | 'high' | 'low';

interface PreloadTask {
  src: string;
  type: 'image' | 'audio';
  priority: PreloadPriority;
}

const loadedAssets = new Set<string>();
const pendingLoads = new Map<string, Promise<void>>();

const scheduleIdleCallback = (callback: () => void): number => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return (window as Window & { requestIdleCallback: (cb: IdleRequestCallback, options?: IdleRequestOptions) => number }).requestIdleCallback(callback, { timeout: 2000 });
  }
  return setTimeout(callback, 1) as unknown as number;
};

const cancelIdleCallback = (id: number): void => {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

export function isAssetLoaded(src: string): boolean {
  return loadedAssets.has(src);
}

export function preloadImage(src: string): Promise<void> {
  if (loadedAssets.has(src)) {
    return Promise.resolve();
  }

  if (pendingLoads.has(src)) {
    return pendingLoads.get(src)!;
  }

  const promise = new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      loadedAssets.add(src);
      pendingLoads.delete(src);
      resolve();
    };
    img.onerror = () => {
      loadedAssets.add(src);
      pendingLoads.delete(src);
      resolve();
    };
    img.src = src;
  });

  pendingLoads.set(src, promise);
  return promise;
}

export function preloadAudio(src: string): Promise<void> {
  if (loadedAssets.has(src)) {
    return Promise.resolve();
  }

  if (pendingLoads.has(src)) {
    return pendingLoads.get(src)!;
  }

  const promise = new Promise<void>((resolve) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => {
      loadedAssets.add(src);
      pendingLoads.delete(src);
      resolve();
    };
    audio.onerror = () => {
      loadedAssets.add(src);
      pendingLoads.delete(src);
      resolve();
    };
    audio.preload = 'auto';
    audio.src = src;
  });

  pendingLoads.set(src, promise);
  return promise;
}

export function preloadInBackground(tasks: PreloadTask[]): void {
  const criticalTasks = tasks.filter((t) => t.priority === 'critical');
  const highTasks = tasks.filter((t) => t.priority === 'high');
  const lowTasks = tasks.filter((t) => t.priority === 'low');

  criticalTasks.forEach((task) => {
    if (task.type === 'image') preloadImage(task.src);
    else preloadAudio(task.src);
  });

  if (highTasks.length > 0) {
    scheduleIdleCallback(() => {
      highTasks.forEach((task) => {
        if (task.type === 'image') preloadImage(task.src);
        else preloadAudio(task.src);
      });
    });
  }

  if (lowTasks.length > 0) {
    scheduleIdleCallback(() => {
      lowTasks.forEach((task) => {
        if (task.type === 'image') preloadImage(task.src);
        else preloadAudio(task.src);
      });
    });
  }
}

export function preloadAnimationChapter(
  animationImages: string[],
  priority: PreloadPriority = 'high'
): void {
  const tasks: PreloadTask[] = animationImages.map((src) => ({
    src,
    type: 'image',
    priority,
  }));
  preloadInBackground(tasks);
}

let backgroundPreloadId: number | null = null;

export function startBackgroundPreload(
  allAnimationImages: string[][],
  currentChapterIndex: number
): void {
  if (backgroundPreloadId !== null) {
    cancelIdleCallback(backgroundPreloadId);
  }

  const preloadNext = (index: number) => {
    if (index >= allAnimationImages.length) return;

    backgroundPreloadId = scheduleIdleCallback(() => {
      const chapterImages = allAnimationImages[index];
      if (chapterImages) {
        chapterImages.forEach((src) => preloadImage(src));
      }
      preloadNext(index + 1);
    });
  };

  const nextChapter = currentChapterIndex + 1;
  preloadNext(nextChapter);
}

export function preloadQuizAssets(
  gender: 'boy' | 'girl',
  animations: { boy: { images: string[] }[]; girl: { images: string[] }[] },
  currentAnimationIndex: number,
  geometricPattern: string,
  audioFiles: string[]
): void {
  const genderAnimations = animations[gender];
  const allAnimationImages = genderAnimations.map((a) => a.images);

  if (currentAnimationIndex >= 0 && currentAnimationIndex < allAnimationImages.length) {
    preloadAnimationChapter(allAnimationImages[currentAnimationIndex], 'critical');
  }

  if (currentAnimationIndex + 1 < allAnimationImages.length) {
    preloadAnimationChapter(allAnimationImages[currentAnimationIndex + 1], 'high');
  }

  preloadInBackground([{ src: geometricPattern, type: 'image', priority: 'high' }]);

  scheduleIdleCallback(() => {
    audioFiles.forEach((src) => preloadAudio(src));
  });

  startBackgroundPreload(allAnimationImages, currentAnimationIndex + 1);
}
