// Reads a list of texts with the browser's speech synthesis, one utterance per step, so the
// current step can be highlighted and long recipes are not cut off (Chrome stops very long utterances).
export const useReadAloud = (steps: MaybeRefOrGetter<string[]>) => {
  const isSupported = useSupported(() => 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
  const status = ref<'idle' | 'playing' | 'paused'>('idle');
  const currentStep = ref(-1);

  // Events of utterances from an earlier run can still fire after cancel(); they are ignored.
  let run = 0;

  const stop = () => {
    run++;
    if (isSupported.value) window.speechSynthesis.cancel();
    status.value = 'idle';
    currentStep.value = -1;
  };

  const play = (fromStep = 0) => {
    if (!isSupported.value) return;
    stop();
    const thisRun = run;
    const texts = toValue(steps);

    texts.slice(fromStep).forEach((text, offset) => {
      const index = fromStep + offset;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onstart = () => {
        if (thisRun === run) currentStep.value = index;
      };
      utterance.onend = () => {
        if (thisRun === run && index === texts.length - 1) stop();
      };
      utterance.onerror = event => {
        if (thisRun === run && event.error !== 'interrupted' && event.error !== 'canceled') stop();
      };
      window.speechSynthesis.speak(utterance);
    });
    status.value = 'playing';
  };

  const pause = () => {
    window.speechSynthesis.pause();
    status.value = 'paused';
  };

  const resume = () => {
    window.speechSynthesis.resume();
    status.value = 'playing';
  };

  tryOnScopeDispose(stop);

  return { isSupported, status, currentStep, play, pause, resume, stop };
};
