<template>
  <div>
    <bars-arrow-down-icon v-show="!props.isAscending" class="h-4"/>
    <bars-arrow-up-icon v-show="props.isAscending" class="h-4"/>
  </div>
</template>

<script setup lang="ts">
import {BarsArrowDownIcon, BarsArrowUpIcon} from "@heroicons/vue/24/outline";

/**
 * @vue-prop {Number} initialCounter - Initial counter's value
 * @vue-prop {Number} [step=1] - Step
 * @vue-data {Number} counter - Current counter's value
 * @vue-computed {String} message
 * @vue-event {Number} increment - Emit counter's value after increment
 * @vue-event {Number} decrement - Emit counter's value after decrement
 */
const props = defineProps<{ isAscending: boolean }>()
</script>

<style scoped>

</style>