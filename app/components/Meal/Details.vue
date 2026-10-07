<template>
  <article class="container mx-auto px-4 py-6">
    <button
      type="button"
      class="mb-4 inline-flex items-center gap-1 text-gray-700 hover:text-orange-700 print:hidden"
      @click="goBack"
    >
      <ArrowLeft class="h-4 w-4" aria-hidden="true" />
      Back
    </button>

    <header class="mb-6">
      <h1 class="text-4xl font-bold md:text-5xl">{{ meal.strMeal }}</h1>
      <p v-if="meal.strMealAlternate" class="mt-1 text-gray-600">Also known as {{ meal.strMealAlternate }}</p>

      <ul class="mt-4 flex flex-wrap gap-2" aria-label="Meal details">
        <li v-if="meal.strCategory">
          <nuxt-link :to="`/categories/${encodeURIComponent(meal.strCategory)}`" :class="chipClass">
            <Tag class="h-4 w-4" aria-hidden="true" />
            <span class="sr-only">Category:</span> {{ meal.strCategory }}
          </nuxt-link>
        </li>
        <li v-if="meal.strCountry">
          <nuxt-link :to="`/cuisines/${encodeURIComponent(meal.strCountry)}`" :class="chipClass">
            <Globe class="h-4 w-4" aria-hidden="true" />
            <span class="sr-only">Cuisine:</span> {{ meal.strCountry }}
          </nuxt-link>
        </li>
        <li v-for="tag in tags" :key="tag">
          <span :class="tagClass">
            <Hash class="h-4 w-4" aria-hidden="true" />
            <span class="sr-only">Tag:</span> {{ tag }}
          </span>
        </li>
      </ul>

      <div class="mt-4 flex flex-wrap gap-2 print:hidden">
        <FavouriteButton :meal="meal" with-label :class="actionClass" />
        <button type="button" :class="actionClass" @click="share">
          <component :is="copied ? Check : Share2" class="h-5 w-5" aria-hidden="true" />
          {{ copied ? 'Link copied' : 'Share' }}
        </button>
        <button type="button" :class="actionClass" @click="print">
          <Printer class="h-5 w-5" aria-hidden="true" />
          Print
        </button>
        <button
          v-if="canKeepScreenOn"
          type="button"
          :class="actionClass"
          :aria-pressed="screenOn"
          @click="toggleScreenOn"
        >
          <Sun class="h-5 w-5" :class="screenOn && 'text-orange-700'" aria-hidden="true" />
          {{ screenOn ? 'Screen stays on' : 'Keep screen on' }}
        </button>
      </div>
    </header>

    <div class="grid gap-8 lg:grid-cols-5">
      <div class="lg:col-span-3">
        <img
          :src="meal.strMealThumb"
          :alt="meal.strMeal"
          width="700"
          height="700"
          fetchpriority="high"
          class="aspect-[4/3] w-full rounded-2xl bg-bay-100 object-cover"
          @error="onImageError"
        />
        <p v-if="meal.strImageSource" class="mt-1 text-sm text-gray-600">
          Image:
          <a
            :href="meal.strImageSource"
            target="_blank"
            rel="noopener noreferrer"
            class="underline hover:text-orange-700"
          >
            {{ hostnameOf(meal.strImageSource) }}
          </a>
        </p>
      </div>

      <section class="lg:col-span-2" aria-labelledby="ingredients-heading">
        <h2 id="ingredients-heading" class="mb-3 text-2xl font-semibold">Ingredients</h2>
        <ul class="divide-y divide-bay-50 overflow-hidden rounded-2xl bg-white shadow-xs ring-1 ring-bay-100">
          <li v-for="ingredient in ingredients" :key="ingredient.name" class="flex items-center">
            <label class="flex shrink-0 cursor-pointer self-stretch items-center pl-3 pr-1 print:hidden">
              <input
                v-model="gathered"
                type="checkbox"
                :value="ingredient.name"
                class="h-5 w-5 accent-orange-700"
                :aria-label="`Got ${ingredient.name}`"
              />
            </label>
            <nuxt-link
              :to="`/ingredients/${encodeURIComponent(ingredient.name)}`"
              class="flex flex-1 items-center gap-3 px-3 py-2 hover:bg-orange-50"
              :class="gathered.includes(ingredient.name) && 'text-gray-500 line-through'"
            >
              <img
                :src="ingredientThumbUrl(ingredient.name, 'small')"
                alt=""
                width="40"
                height="40"
                loading="lazy"
                class="h-10 w-10 shrink-0 object-contain"
              />
              <span class="capitalize">{{ ingredient.name }}</span>
              <span v-if="ingredient.measure" class="ml-auto text-right text-gray-600">{{ ingredient.measure }}</span>
            </nuxt-link>
          </li>
        </ul>
      </section>
    </div>

    <section v-if="steps.length" class="mt-10" aria-labelledby="instructions-heading">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="instructions-heading" class="text-2xl font-semibold">Instructions</h2>
        <div v-if="readAloud.isSupported.value" class="flex gap-2 print:hidden">
          <button v-if="readAloud.status.value === 'idle'" type="button" :class="actionClass" @click="readAloud.play()">
            <Volume2 class="h-5 w-5" aria-hidden="true" />
            Read aloud
          </button>
          <template v-else>
            <button
              v-if="readAloud.status.value === 'playing'"
              type="button"
              :class="actionClass"
              @click="readAloud.pause()"
            >
              <Pause class="h-5 w-5" aria-hidden="true" />
              Pause
            </button>
            <button v-else type="button" :class="actionClass" @click="readAloud.resume()">
              <Play class="h-5 w-5" aria-hidden="true" />
              Resume
            </button>
            <button type="button" :class="actionClass" @click="readAloud.stop()">
              <Square class="h-5 w-5" aria-hidden="true" />
              Stop
            </button>
          </template>
        </div>
      </div>
      <ol class="space-y-3">
        <li
          v-for="(step, index) in steps"
          :key="index"
          class="rounded-2xl shadow-xs ring-1 ring-bay-100 transition-colors"
          :class="readAloud.currentStep.value === index ? 'bg-orange-100' : 'bg-white'"
          :aria-current="readAloud.currentStep.value === index ? 'step' : undefined"
        >
          <!-- The whole step ticks off; the number turns into a check mark. -->
          <label class="flex cursor-pointer gap-4 p-3">
            <input v-model="doneSteps" type="checkbox" :value="index" class="peer sr-only" />
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold peer-focus-visible:ring-2 peer-focus-visible:ring-orange-600 peer-focus-visible:ring-offset-2"
              :class="doneSteps.includes(index) ? 'bg-bay-100 text-bay-700' : 'bg-orange-700 text-white'"
              aria-hidden="true"
            >
              <Check v-if="doneSteps.includes(index)" class="h-5 w-5" />
              <template v-else>{{ index + 1 }}</template>
            </span>
            <span class="pt-1" :class="doneSteps.includes(index) && 'text-gray-500 line-through'">{{ step }}</span>
          </label>
        </li>
      </ol>
    </section>

    <section v-if="videoId" class="mt-10 print:hidden" aria-labelledby="video-heading">
      <h2 id="video-heading" class="mb-4 flex items-center gap-2 text-2xl font-semibold">
        <CirclePlay class="h-6 w-6 text-orange-700" aria-hidden="true" />
        Video
      </h2>
      <div class="aspect-video w-full max-w-3xl overflow-hidden rounded-lg bg-black">
        <iframe
          :src="`https://www.youtube-nocookie.com/embed/${videoId}`"
          :title="`${meal.strMeal} video`"
          class="h-full w-full"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </section>

    <p v-if="meal.strSource" class="mt-8 flex items-center gap-2 text-gray-700">
      <ExternalLink class="h-4 w-4" aria-hidden="true" />
      Original recipe:
      <a :href="meal.strSource" target="_blank" rel="noopener noreferrer" class="underline hover:text-orange-700">
        {{ hostnameOf(meal.strSource) }}
      </a>
    </p>
  </article>
</template>

<script setup lang="ts">
import {
  ArrowLeft,
  Check,
  CirclePlay,
  ExternalLink,
  Globe,
  Hash,
  Pause,
  Play,
  Printer,
  Share2,
  Square,
  Sun,
  Tag,
  Volume2,
} from '@lucide/vue';
import type { Meal } from '@/types/Meal';

const props = defineProps<{ meal: Meal }>();

const chipClass =
  'inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-gray-800 shadow-xs hover:text-orange-700';
const tagClass = 'inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700';
const actionClass =
  'inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-gray-800 shadow-xs ring-1 ring-bay-100 hover:bg-orange-50';

const ingredients = computed(() => getIngredientsFromMeal(props.meal));
const steps = computed(() => splitInstructions(props.meal.strInstructions));
const tags = computed(() => formatMealTags(props.meal).split(', ').filter(Boolean));
const videoId = computed(() => youtubeVideoId(props.meal.strYoutube));

const readAloud = useReadAloud(steps);
const { onImageError } = usePlaceholderImage();

// Cooking checklist: ingredients gathered and steps done, for this visit only.
const gathered = ref<string[]>([]);
const doneSteps = ref<number[]>([]);

watch(
  () => props.meal.idMeal,
  () => {
    readAloud.stop();
    gathered.value = [];
    doneSteps.value = [];
  },
);

const router = useRouter();
const goBack = () => (window.history.state?.back ? router.back() : router.push('/meals'));

// Native share sheet where available (mostly phones), otherwise copy the link.
const { share: shareNatively, isSupported: canShare } = useShare();
const { copy, copied } = useClipboard({ copiedDuring: 2000 });
const share = async () => {
  const url = window.location.href;
  if (!canShare.value) return copy(url);
  try {
    await shareNatively({ title: props.meal.strMeal, url });
  } catch {
    // The user closed the share sheet.
  }
};

const print = () => window.print();

// Screen Wake Lock: stops the phone from dimming while cooking. Released when leaving the page.
const { isSupported: canKeepScreenOn, isActive: screenOn, request, release } = useWakeLock();
const toggleScreenOn = () => (screenOn.value ? release() : request('screen'));
</script>
