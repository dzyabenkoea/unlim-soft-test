<template>
  <table>
    <thead>
    <tr class="border-b">
      <th class="cursor-pointer">№</th>
      <th class="cursor-pointer flex justify-center" @click="onSortChange('fio')">
        <div class="flex gap-1 items-end">
          ФИО
          <sort-control v-show="sortColumn==='fio'" :is-ascending="sortDirectionAsc"/>
        </div>
      </th>
      <th class="cursor-pointer" @click="onSortChange('birthday')">
        <div class="flex gap-1 items-end">
          Дата рождения
          <sort-control v-show="sortColumn==='birthday'" :is-ascending="sortDirectionAsc"/>
        </div>
      </th>
    </tr>
    </thead>
    <tbody class="divide-y min-h-[10rem] max-h-[20rem] overflow-auto">
    <tr v-if="!modelValue.length">
      <td class="text-center text-gray-400" colspan="3">Нет игроков</td>
    </tr>
    <tr class="divide-x hover:bg-gray-50" v-for="(player, index) in sortedPlayerList" :key="player.id">
      <td class="px-2 py-1">{{ index + 1 }}</td>
      <td class="px-2 py-1 cursor-pointer select-none" @dblclick="emits('player-selected', player)">
        {{ player.fio }}
      </td>
      <td class="px-2 py-1">{{ player.birthday }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import SortControl from "./SortControl.vue";
import {computed, ref} from "vue";
import {Player} from "../types";

const sortColumn = ref('fio')
const sortDirectionAsc = ref(true)

interface Emits {
  (e: 'update:modelValue', value: Player[]),
  (e: 'playerSelected', value: Player)
}

const props = defineProps<{ modelValue: Player[] }>()
const emits = defineEmits<Emits>()

const sortedPlayerList = computed(() => {
  if (!sortColumn.value)
    return props.modelValue

  const sorted = props.modelValue.sort((a, b) => {
    const aValue: string = a[sortColumn.value]
    const bValue: string = b[sortColumn.value]
    return sortDirectionAsc.value ? aValue.localeCompare(bValue) : -aValue.localeCompare(bValue)
  })
  return sorted
})

/**
 * Обработчик нажатия на заголовок колонки таблицы с игроками
 *
 * @param {string} sortKey - ключ сортировки игроков в таблице
 */
function onSortChange(sortKey: string) {
  // Не менять направление если меняем колонку
  if (sortKey === sortColumn.value)
    sortDirectionAsc.value = !sortDirectionAsc.value
  sortColumn.value = sortKey
}

</script>
<script lang="ts">
/**
 * Компонент для вывода таблицы игроков
 * @vue-prop {Player[]} modelValue - таблица с игроками
 * @vue-event {Player[]} update:modelValue - изменение таблицы
 * @vue-event {Player} playerSelected - событие выбора игрока в таблице
 */
export default {
  name: "PlayersTable"
}
</script>

<style scoped>

</style>