<template>
  <div class="flex gap-4">
    <div class="relative shrink-0 grow-0 h-fit w-fit">
      <img class="rounded-full h-24 w-24" src="../../public/photo.jpg" alt="">
      <a class="absolute -right-1 -bottom-1"
         href="https://tyumen.hh.ru/resume/0f3bb8e4ff0b8e10500039ed1f5a576a415378"
         target="_blank"
         title="Портфолио на hh.ru">
        <img class="h-8 w-8 opacity-60 hover:opacity-100 transition-opacity" src="../../public/hh.ru__min_.svg" alt="">
      </a>
    </div>
    <div>
      <h2 class="text-lg font-semibold">Дзябенко Егор Анатольевич</h2>
      <p><span class="font-semibold">Возраст:</span> 26 лет</p>
      <ul class="flex gap-1 mt-2">
        <li class="rounded px-4 py-1 bg-gray-100">Vue.js</li>
        <li class="rounded px-4 py-1 bg-gray-100">TypeScript</li>
        <li class="rounded px-4 py-1 bg-gray-100">Tailwind CSS</li>
      </ul>
      <h2 class="mt-4 text-lg font-semibold">Сопроводительное письмо:</h2>
      <p class="mt-2">
        <span class="font-semibold">Опыт работы фронтенд разработчиком:</span> 7 месяцев.<br>
        <span class="font-semibold">Ожидаемая ЗП:</span> 50-70 тыс. руб.<br>
        <br>
        На текущем месте работы занимаюсь разработкой виджетов для amoCRM (встраиваемые SPA).<br>
        <span class="font-semibold">Стэк: </span>Vue.js, Pinia (обновленный Vuex), Twig.js, TypeScript, Tailwind CSS,
        SCSS/SASS.<br>
        <span class="font-semibold">Обязанности:</span><br>
        верстка по макетам Figma;<br>
        интеграция с бэкендом через REST API;<br>
        адаптивная верстка и верстка под мобильные устройства;<br>
        <br>
        Для сборки проектов использовал Webpack и Vite.<br>
        Есть опыт командной разработки в Gitlab, и навыки работы с git<br>
        <br>
        Пример разработанного SPA для магазина виджетов: <a class="underline" target="_blank"
                                                            href="https://widgets.makeroi.ru/">https://widgets.makeroi.ru/</a><br>
        Исходники: <a class="underline" target="_blank" href="https://github.com/dzyabenkoea/makeroi-widget-page">https://github.com/dzyabenkoea/makeroi-widget-page</a>
      </p><br>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>
<script lang="ts">
/**
 * Страница "Обо мне"
 */
export default {
  name: "About.vue"
}
</script>
