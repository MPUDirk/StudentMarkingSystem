<script setup>
import {onMounted, onUnmounted, ref} from 'vue';

const emits = defineEmits(['create']);

const modalVisible = ref(false);

function showModal() {
  modalVisible.value = true;
}

defineExpose({
  showModal
});
</script>

<template>
  <div
      class="z-9999 fixed inset-0 bg-gray-600/50 h-full w-full"
      :class="modalVisible?'':'hidden'"
      @click.self="modalVisible=false"
  >
    <div class="mt-[10%] mx-auto w-[50%] lg:w-[30%] p-5 bg-white rounded-md">
      <h3 class="mb-5">Add a new record</h3>

      <form class="grid grid-cols-1 gap-2">
        <div>
          <label for="std-name">Student Name</label>
          <div class="group-inputs">
            <input class="rounded-[5px]" id="std-name" type="text">
          </div>
        </div>
        <div>
          <label for="eng">English Grade</label>
          <div class="group-inputs">
            <button type="button" class="group-btn rounded-l-[5px]">+</button>
            <input id="eng" type="text">
            <button type="button" class="group-btn rounded-r-[5px]">-</button>
          </div>
        </div>
        <div>
          <label for="math">Math Grade</label>
          <div class="group-inputs">
            <button type="button" class="group-btn rounded-l-[5px]">+</button>
            <input id="math" type="text">
            <button type="button" class="group-btn rounded-r-[5px]">-</button>
          </div>
        </div>
        <div>
          <label for="pe">PE Grade</label>
          <div class="group-inputs">
            <button type="button" class="group-btn rounded-l-[5px]">+</button>
            <input id="pe" type="text">
            <button type="button" class="group-btn rounded-r-[5px]">-</button>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="p-1 text-white bg-red-300 hover:bg-red-400 active:bg-red-500 rounded-[7px]">
            Cancel
          </button>
          <button type="button" class="p-1 text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-[7px]">
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";
form div{
  @apply lg:flex lg:flex-row lg:gap-2 w-[90%];
}
form div label{
  @apply text-end w-[30%];
}
.group-inputs{
  @apply w-[60%] outline-1 -outline-offset-1 outline-gray-400 flex gap-0 rounded-[5px];
}
form div div input{
  @apply grow min-w-0 border-0 outline -outline-offset-1 outline-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black pl-1;
}
.group-btn{
  @apply h-full w-[10%] text-center bg-gray-300 active:bg-gray-400;
}
</style>