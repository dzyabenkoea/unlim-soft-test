<script setup lang="ts">
import {useRoute} from "vue-router";

const router = useRoute()

</script>
<script lang="ts">
/**
 * Корневой компонент приложения
 */
export default {
  name:"App.vue"
}
</script>

<template>
  <div class="bg-gray-100 h-screen">
    <header class="py-2 px-5 flex gap-1 bg-blue-800 text-white">
      <router-link class="hover:bg-blue-900 px-4 py-1 rounded"
                   :class="{'bg-white text-blue-800 hover:bg-gray-100':router.fullPath === '/'}" to="/">Главная
      </router-link>
      <router-link class="hover:bg-blue-900 px-4 py-1 rounded"
                   :class="{'bg-white text-blue-800 hover:bg-gray-100':router.fullPath.startsWith('/players')}"
                   to="/players">Формирование групп
      </router-link>
    </header>
    <div class="bg-white">
      <div class="p-5">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
