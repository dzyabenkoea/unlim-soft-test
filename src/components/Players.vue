<template>
  <div class="flex gap-4">
    <div class="shrink-0 grow-0">
      <players-table :model-value="playerList" class="min-w-[20rem]" @player-selected="(player) => addPlayer(player)"/>
    </div>
    <div class="flex flex-col gap-2 grow">
      <div class="flex gap-4 w-full">
        <div v-for="group in groupedPlayers" class="grow">
          <players-group :model-value="group" @player-remove="player => removePlayer(player, group)"/>
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
import PlayersTable from "./PlayersTable.vue";
import PlayersGroup from "./PlayersGroup.vue";

const modifiedPlayers = preprocessPlayers(structuredClone(players))
const playerList = ref(modifiedPlayers)

const _groupedPlayers: Group[] = groups.map(group => ({group_id: group.group_id, players: []}))
const groupedPlayers = ref<Group[]>(_groupedPlayers)

const sortColumn = ref('fio')
const sortDirectionAsc = ref(true)

export interface PlayerData {
  id: number,
  name: string,
  surname: string,
  birthday: string,
}

export interface Player {
  id: number,
  name: string,
  surname: string,
  birthday: string,
  fio: string
}

export interface Group {
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