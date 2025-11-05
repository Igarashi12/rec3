import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'today',
      component: () => import('../components/TodayWeather.vue'),
    },
    {
      path: '/week',
      name: 'week',
      component: () => import('../components/WeekWeather.vue'),
    },
  ],
})

export default router
