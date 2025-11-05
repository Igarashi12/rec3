<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SearchView from './components/Search.vue'

</script>

<template>
  <header>
    <div>
      <SearchView />
      <nav class="weatherType">
        <RouterLink to="/"><v-btn class="btn">today</v-btn></RouterLink>
        <RouterLink to="/week"><v-btn class="btn">week</v-btn></RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>
