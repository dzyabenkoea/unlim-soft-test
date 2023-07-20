<template>
  <div>
    <bars-arrow-down-icon v-show="!props.isAscending" class="h-4"/>
    <bars-arrow-up-icon v-show="props.isAscending" class="h-4"/>
  </div>
</template>

<script setup lang="ts">
import {BarsArrowDownIcon, BarsArrowUpIcon} from "@heroicons/vue/24/outline";

const props = defineProps<{ isAscending: boolean }>()
</script>
<script lang="ts">
/**
 * Компонент для выбора направления сортировки
 * @vue-prop {Boolean} isAscending - Признак сортировки по возрастанию
 */
export default {
  name: "SortControl.vue",
}
</script>

<style scoped>

</style>