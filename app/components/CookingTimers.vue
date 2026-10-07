<template>
  <ul v-if="timers.length" class="flex flex-col gap-2 print:hidden" aria-label="Cooking timers">
    <li
      v-for="timer in timers"
      :key="timer.id"
      class="w-72 rounded-2xl p-3 text-white shadow-xl ring-1"
      :class="timer.done ? 'bg-orange-800 ring-orange-600' : 'bg-bay-950 ring-bay-800'"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="text-sm text-bay-100">{{ timer.label }} · step {{ timer.step + 1 }}</p>
          <nuxt-link :to="`/meals/${timer.mealId}`" class="block truncate font-semibold hover:underline">
            {{ timer.meal }}
          </nuxt-link>
        </div>
        <button
          type="button"
          class="-m-1 rounded-lg p-2 hover:bg-white/10"
          :aria-label="`Remove the ${timer.label} timer`"
          @click="dismiss(timer)"
        >
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div class="mt-1 flex items-center justify-between gap-2">
        <p v-if="timer.done" role="alert" class="flex items-center gap-2 text-2xl font-bold">
          <BellRing class="h-6 w-6 motion-safe:animate-bounce" aria-hidden="true" />
          Done
        </p>
        <p v-else class="font-display text-3xl font-bold tabular-nums">{{ formatCountdown(remaining(timer)) }}</p>
        <div class="flex gap-1">
          <button
            v-if="!timer.done"
            type="button"
            class="rounded-lg p-2 hover:bg-white/10"
            :aria-label="timer.endsAt ? 'Pause' : 'Resume'"
            @click="timer.endsAt ? pause(timer) : resume(timer)"
          >
            <component :is="timer.endsAt ? Pause : Play" class="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="rounded-lg px-2 py-1.5 text-sm font-semibold hover:bg-white/10"
            aria-label="Add one minute"
            @click="addMinute(timer)"
          >
            +1 min
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { BellRing, Pause, Play, X } from '@lucide/vue';

const { timers, remaining, pause, resume, addMinute, dismiss } = useCookingTimers();
</script>
