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
  <dialog ref="dialogRef" class="p-5">
    <div @submit.prevent class="flex flex-col gap-4">
      <template v-if="allowSave">
        <h1 class="text-lg font-semibold">Сохранить изменения?</h1>
        <h2>Перед переходом необходимо сохранить изменения.<br>Сохранить?</h2>
      </template>
      <template v-if="!allowSave">
        <h1 class="text-lg font-semibold">Перейти без сохранения?</h1>
        <h2>Перед переходом необходимо сохранить изменения, но не все группы заполнены<br>Отменить изменения и перейти?</h2>
      </template>

      <div class="w-full flex gap-2">
        <button v-if="allowSave" name="save" class="py-1 px-4 bg-blue-800 hover:bg-blue-900 text-white rounded-md" value="save">Сохранить</button>
        <button v-if="!allowSave" name="cancel-and-proceed" class="py-1 px-4 rounded-md bg-gray-50 hover:bg-gray-100" value="cancel">Отменить и перейти</button>
        <button name="cancel" class="py-1 px-4 rounded-md bg-gray-50 hover:bg-gray-100" value="cancel">Отменить</button>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>

import {groups, players} from '../data'
import {computed, ref, useAttrs, watch} from "vue";
import PlayersTable from "./PlayersTable.vue";
import PlayersGroup from "./PlayersGroup.vue";
import {Group, Player, PlayerData, PlayerGroupRecord} from "../types";
import {onBeforeRouteLeave} from "vue-router";

const modifiedPlayers = preprocessPlayers(structuredClone(players))
const playerList = ref(modifiedPlayers)

const allowSave = computed(() => playerList.value.length === 0)
const unsavedChanges = ref(false)
const dialogRef = ref<HTMLDialogElement>()

watch(playerList, () => {
  unsavedChanges.value = true
})

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
  unsavedChanges.value = false;
  console.log(preparedValue)
}

function showConfirm() {

  dialogRef.value?.showModal()

  return new Promise((resolve) => {
    const clickHandler = (event) => {
      resolve(event.target.name)
      dialogRef.value?.close()
    }
    const closeHandler = (event) => {
      resolve('cancel')
      dialogRef.value?.close()
    }

    dialogRef.value?.removeEventListener('click', clickHandler)
    dialogRef.value?.removeEventListener('close', closeHandler)

    dialogRef.value?.addEventListener('click', clickHandler)
    dialogRef.value?.addEventListener('close', closeHandler)
  })
}

onBeforeRouteLeave(async () => {
  if (unsavedChanges.value) {
    const result = await showConfirm()
    switch (result) {
      case 'save': {
        saveGroups()
        break
      }
      case 'cancel': {
        return false
      }
      case 'cancel-and-proceed' : {
        return true
      }
      default: {
        return false
      }
    }
  }
  return true
})

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