<template>
  <div class="container mx-auto px-4">
    <CategoryList
      heading-tag="h1"
      title="Categories"
      :categories="categories"
      :loading="pending"
      :error="Boolean(error)"
      @retry="refresh()"
    />
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Categories' });

const { data: categories, pending, error, refresh } = useAsyncData('categories', () => mealDb.getCategories());
</script>
