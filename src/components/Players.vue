<template>
  <div class="flex gap-4">
    <div class="shrink-0 grow-0">
      <players-table :model-value="playerList" class="min-w-[20rem]" @player-selected="player => addPlayer(player)"/>
    </div>
    <div class="flex flex-col gap-2 grow">
      <div class="flex gap-4 w-full">
        <div v-for="group in groupedPlayers" class="grow">
          <players-group :model-value="group" @player-remove="player => removePlayer(player, group)"/>
        </div>
      </div>
      <button class="px-6 py-2 rounded-md self-end"
              :class="{'bg-blue-800 hover:bg-blue-900 text-white':allowSave, 'bg-gray-200 text-gray-800': !allowSave}"
              @click="saveGroups()"
              :disabled="!allowSave">
        Сохранить
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {groups, players} from '../data'
import {computed, ref} from "vue";
import PlayersTable from "./PlayersTable.vue";
import PlayersGroup from "./PlayersGroup.vue";
import {Group, Player, PlayerData, PlayerGroupRecord} from "../types";

const modifiedPlayers = preprocessPlayers(structuredClone(players))
const playerList = ref(modifiedPlayers)

const allowSave = computed(() => playerList.value.length === 0)

const _groupedPlayers: Group[] = groups.map(group => ({group_id: group.group_id, players: []}))
const groupedPlayers = ref<Group[]>(_groupedPlayers)

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