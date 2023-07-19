<template>
  <div class="flex gap-4">
    <div class="shrink-0 grow-0">
      <table class="min-w-[20rem]">
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
        <tr v-if="!playerList.length">
          <td class="text-center text-gray-400" colspan="3">Нет игроков</td>
        </tr>
        <tr class="divide-x hover:bg-gray-50" v-for="(player, index) in sortedPlayerList" :key="player.id">
          <td class="px-2 py-1">{{ index + 1 }}</td>
          <td class="px-2 py-1 cursor-pointer select-none" @dblclick="addPlayer(player)">{{ player.fio }}</td>
          <td class="px-2 py-1">{{ player.birthday }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="flex flex-col gap-2 grow">
      <div class="flex gap-4 w-full">
        <div v-for="group in groupedPlayers" class="grow">
          <h2 class="font-semibold">Группа {{ group.group_id }}</h2>
          <div class="mt-2 min-h-[20rem] min-w-[10rem] bg-gray-100 rounded-md border overflow-auto shadow-inner">
            <ul class="divide-y shadow">
              <li class="px-3 py-1 cursor-pointer select-none bg-white" v-for="player in group.players"
                  @dblclick="removePlayer(player, group)">
                {{ player.fio }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button class="px-6 py-2 bg-blue-800 hover:bg-blue-900 rounded-md text-white self-end" @click="saveGroups()">
        Сохранить
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {groups, players} from '../data'
import {computed, ref} from "vue";
import SortControl from "./SortControl.vue";

const modifiedPlayers = preprocessPlayers(structuredClone(players))
const playerList = ref(modifiedPlayers)

const sortedPlayerList = computed(() => {
  if (!sortColumn.value)
    return playerList.value

  const sorted = playerList.value.sort((a, b) => {
    const aValue: string = a[sortColumn.value]
    const bValue: string = b[sortColumn.value]
    return sortDirectionAsc.value ? aValue.localeCompare(bValue) : -aValue.localeCompare(bValue)
  })
  return sorted
})

const _groupedPlayers: Group[] = groups.map(group => ({group_id: group.group_id, players: []}))
const groupedPlayers = ref<Group[]>(_groupedPlayers)

const sortColumn = ref('fio')
const sortDirectionAsc = ref(true)

interface PlayerData {
  id: number,
  name: string,
  surname: string,
  birthday: string,
}

interface Player {
  id: number,
  name: string,
  surname: string,
  birthday: string,
  fio: string
}

interface Group {
  group_id: number,
  players: Player[]
}

interface PlayerGroupRecord {
  player_id: number,
  group_id: number
}

/**
 * Выполняет предобработку "сырых" игроков
 *
 * @param {PlayerData[]} data - данные об игроках
 * @returns {Player[]} - Обработанные данные
 */
function preprocessPlayers(data: PlayerData[]): Player[] {
  return data.map(player => ({...player, fio: player.surname + ' ' + player.name}))
}

/**
 * Добавляет игрока в группу с наименьшим количеством игроков
 *
 * @param {Player} addedPlayer - добавляемый игрок
 */
function addPlayer(addedPlayer: Player) {
  smallestGroup().players.push(addedPlayer)
  playerList.value = playerList.value.filter(player => player.id !== addedPlayer.id)
}

/**
 * Удаляет игрока из группы
 *
 * @param {Player} removedPlayer - удаляемый игрок
 * @param {Group} containingGroup - группа, из которой удаляется игрок
 */
function removePlayer(removedPlayer: Player, containingGroup: Group) {
  containingGroup.players = containingGroup.players.filter(_player => _player.id !== removedPlayer.id)
  playerList.value.push(removedPlayer)
}

/**
 * Возвращает группу с наименьшим количеством игроков
 *
 * @returns {Group} - группа с наименьшим количеством игроков
 */
function smallestGroup(): Group {
  let min = groupedPlayers.value[0].players.length
  let smallestGroup = groupedPlayers.value[0]

  groupedPlayers.value.forEach(group => {
    const playersCount = group.players.length
    if (playersCount < min) {
      min = playersCount
      smallestGroup = group
    }
  })

  return smallestGroup
}

/**
 * Возвращает группу с наименьшим количеством игроков
 *
 * @param {Group[]} groups - сгруппированные игроки
 * @returns {PlayerGroupRecord[]} - сгруппированные игроки в формате для отправки на бэкенд
 */
function prepareForSaving(groups: Group[]): PlayerGroupRecord[] {
  const result: PlayerGroupRecord[] = []
  for (let group of groups) {
    for (let player of group.players) {
      result.push({
        player_id: player.id,
        group_id: group.group_id
      })
    }
  }
  return result
}

/**
 * Выводит подготовленное к отправке на бэкенд значение групп
 */
function saveGroups() {
  const preparedValue = prepareForSaving(groupedPlayers.value)
  console.log(preparedValue)
}

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
 * Компонент для отображения страницы с игроками
 */
export default {
  name: "Players.vue"
}
</script>

<style scoped>

</style>