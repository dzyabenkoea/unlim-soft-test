<template>
  <section>
    <h2 class="font-semibold">Группа {{ modelValue.group_id }}</h2>
    <div class="mt-2 min-h-[20rem] min-w-[10rem] bg-gray-100 rounded-md border overflow-auto shadow-inner">
      <ul class="divide-y shadow">
        <li class="px-3 py-1 cursor-pointer select-none bg-white" v-for="player in modelValue.players"
            @dblclick="emits('playerRemove', player)">
          {{ player.fio }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {Group, Player} from "../types";

interface Emits {
  (e:'playerRemove', value: Player)
}

const props = defineProps<{modelValue:Group}>()
const emits = defineEmits<Emits>()
</script>
<script lang="ts">
/**
 * Компонент для вывода группы игроков
 * @vue-prop {Group} modelValue - группа игроков
 * @vue-event {Player} playerRemove - Событие удаления игрока из группы
 */
export default {
  name: "PlayersGroup"
}
</script>

<style scoped>

</style>