export interface CookingTimer {
  id: number;
  /** The duration as written in the step, e.g. "35 minutes". */
  label: string;
  meal: string;
  mealId: string;
  step: number;
  /** Set while running; paused and finished timers keep their time in remainingMs. */
  endsAt: number | null;
  remainingMs: number;
  done: boolean;
}

// Shared by every page, so timers keep running while browsing other recipes.
const timers = ref<CookingTimer[]>([]);
const now = ref(Date.now());
let ticker: ReturnType<typeof setInterval> | undefined;
let audio: AudioContext | undefined;
let nextId = 1;

const beep = () => {
  if (!audio) return;
  for (let i = 0; i < 3; i++) {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const start = audio.currentTime + i * 0.4;
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.3);
  }
};

const notify = async (timer: CookingTimer) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const title = `${timer.label} timer is done`;
  const options = { body: timer.meal, tag: `timer-${timer.id}`, icon: `${useRuntimeConfig().app.baseURL}icon-192.png` };
  try {
    // Phones only show notifications through the service worker.
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) await registration.showNotification(title, options);
    else new Notification(title, options);
  } catch {
    // The timer panel still shows that the timer is done.
  }
};

const finish = (timer: CookingTimer) => {
  timer.done = true;
  timer.endsAt = null;
  timer.remainingMs = 0;
  navigator.vibrate?.([300, 150, 300, 150, 300]);
  beep();
  notify(timer);
};

// Browsers slow down timers in background tabs, so a finished timer can be noticed up to a minute late
// there; the end time is absolute, so the countdown itself never drifts.
const tick = () => {
  now.value = Date.now();
  for (const timer of timers.value) {
    if (timer.endsAt && timer.endsAt <= now.value) finish(timer);
  }
  if (!timers.value.some(timer => timer.endsAt) && ticker) {
    clearInterval(ticker);
    ticker = undefined;
  }
};

const keepTicking = () => {
  now.value = Date.now();
  ticker ??= setInterval(tick, 1000);
};

export const useCookingTimers = () => {
  const remaining = (timer: CookingTimer) => (timer.endsAt ? timer.endsAt - now.value : timer.remainingMs);

  const find = (mealId: string, step: number, label: string) =>
    timers.value.find(timer => timer.mealId === mealId && timer.step === step && timer.label === label);

  const start = (timer: { label: string; seconds: number; meal: string; mealId: string; step: number }) => {
    // Sound and notification permission both need the click that starts the timer.
    if (!audio && 'AudioContext' in window) audio = new AudioContext();
    audio?.resume();
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();

    const { seconds, ...details } = timer;
    timers.value.push({
      id: nextId++,
      ...details,
      endsAt: Date.now() + seconds * 1000,
      remainingMs: seconds * 1000,
      done: false,
    });
    keepTicking();
  };

  const pause = (timer: CookingTimer) => {
    if (!timer.endsAt) return;
    timer.remainingMs = timer.endsAt - Date.now();
    timer.endsAt = null;
  };

  const resume = (timer: CookingTimer) => {
    if (timer.endsAt || timer.done) return;
    timer.endsAt = Date.now() + timer.remainingMs;
    keepTicking();
  };

  const addMinute = (timer: CookingTimer) => {
    if (timer.done) {
      timer.done = false;
      timer.endsAt = Date.now() + 60_000;
      keepTicking();
    } else if (timer.endsAt) {
      timer.endsAt += 60_000;
    } else {
      timer.remainingMs += 60_000;
    }
  };

  const dismiss = (timer: CookingTimer) => {
    timers.value = timers.value.filter(other => other.id !== timer.id);
  };

  return { timers, remaining, find, start, pause, resume, addMinute, dismiss };
};
