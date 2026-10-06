<template>
  <footer class="bg-white dark:bg-gray-900">
    <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
      <div class="md:flex md:justify-between">
        <div class="mb-6 md:mb-0">
          <nuxt-link to="/" class="flex items-center">
            <img src="/meal-icon.png" class="h-8 me-3" alt="" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Feast Finder</span>
          </nuxt-link>
        </div>
        <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          <div v-for="group in linkGroups" :key="group.title">
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">{{ group.title }}</h2>
            <ul class="text-gray-600 dark:text-gray-400 font-medium space-y-4">
              <li v-for="link in group.links" :key="link.label">
                <nuxt-link v-if="link.to" :to="link.to" class="hover:underline">{{ link.label }}</nuxt-link>
                <a v-else :href="link.href" class="hover:underline" target="_blank" rel="noopener noreferrer">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div class="sm:flex sm:items-center sm:justify-between">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          © {{ year }} Feast Finder. Recipe data and images from
          <a href="https://www.themealdb.com/" class="hover:underline" target="_blank" rel="noopener noreferrer">
            TheMealDB</a
          >.
        </p>
        <div class="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
          <a
            href="https://github.com/AkosKappel"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 hover:text-gray-900 dark:hover:text-white"
          >
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd" />
            </svg>
            <span class="sr-only">GitHub profile</span>
          </a>
          <a
            href="https://www.linkedin.com/in/%C3%A1kos-kappel-b53344220"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 hover:text-gray-900 dark:hover:text-white"
          >
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5ZM8 19H5V8h3v11ZM6.5 6.73a1.76 1.76 0 1 1 0-3.53 1.76 1.76 0 0 1 0 3.53ZM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V8h3v1.76c1.4-2.59 7-2.78 7 2.47V19Z" />
            </svg>
            <span class="sr-only">LinkedIn profile</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();

const linkGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Meals', to: '/meals' },
      { label: 'Ingredients', to: '/ingredients' },
      { label: 'Categories', to: '/categories' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Source code', href: 'https://github.com/AkosKappel/FeastFinder' },
      { label: 'TheMealDB API', href: 'https://www.themealdb.com/api.php' },
    ],
  },
  {
    title: 'Built with',
    links: [
      { label: 'Nuxt', href: 'https://nuxt.com/' },
      { label: 'Tailwind CSS', href: 'https://tailwindcss.com/' },
    ],
  },
];
</script>
