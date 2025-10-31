<script setup>
import {ref, onMounted} from "vue";

import {CycleList} from "@/assert/CycleList.mjs";

import CreateForm from './components/CreateForm.vue';

const tableData = [
  {
    name: "John Doe",
    eng: "80",
    math: "90",
    pe: "85",
    edu: "95",
  },
  {
    name: "Jane Doe",
    eng: "75",
    math: "85",
    pe: "90",
    edu: "80",
  },
  {
    name: "Jimmy Doe",
    eng: "65",
    math: "75",
    pe: "80",
  }
]

const avg_subject = ref((new CycleList(
    ["All-Sub", "text-red-500"],
    ["Eng", "text-gray-500"],
    ["Math", "text-green-500"],
    ["Phy", "text-blue-500"],
    ["Edu", "text-yellow-500"],
)).head);
const hst_subject = ref((new CycleList(
    ["All-Sub", "text-red-500"],
    ["Eng", "text-gray-500"],
    ["Math", "text-green-500"],
    ["Phy", "text-blue-500"],
    ["Edu", "text-yellow-500"],
)).head);
const create_form_ref = ref();

onMounted(() => {
  document.addEventListener(
      "click",
      (e) => {
        if (e.target.className === ".z9999") {

        }
      }
  )
})

function click_avg_pre() {
  avg_subject.value = avg_subject.value.pre;
}

function click_avg_nxt() {
  avg_subject.value = avg_subject.value.nxt;
}

function click_hst_pre() {
  hst_subject.value = hst_subject.value.pre;
}

function click_hst_nxt() {
  hst_subject.value = hst_subject.value.nxt;
}

function click_create() {
  create_form_ref.value.showModal();
}
</script>

<template>
  <header class="m-5 p-3 bg-linear-to-br from-purple-800 to-blue-500 rounded-2xl flex flex-col gap-2 items-center">
    <h1 class="text-white">Student Marking System</h1>
    <span class="text-white">Efficiently manage student performance and view statistical analysis in real time</span>
  </header>

  <CreateForm ref="create_form_ref"/>

  <div class="m-5 grid grid-cols-3 gap-5">
    <div class="card">
      <span class="text-gray-400">Num Of Stds</span>
      <h3 class="py-3">0</h3>
    </div>

    <div class="card">
      <div class="flex justify-center w-full">
        <button @click="click_avg_pre()" class="btn-page lg:left-[25%]"><</button>
        <div class="w-2/3 flex justify-center">
          <span class="text-gray-400">
            <span :class="avg_subject.value[1]">{{ avg_subject.value[0] }}</span>
            Average
          </span>
        </div>
        <button @click="click_avg_nxt()" class="btn-page lg:right-[25%]">></button>
      </div>
      <h3 class="py-3">0</h3>
    </div>

    <div class="card">
      <div class="flex justify-center w-full">
        <button @click="click_hst_pre()" class="btn-page lg:left-[25%]"><</button>
        <div class="w-2/3 flex justify-center">
          <span class="text-gray-400">
            <span :class="hst_subject.value[1]">{{ hst_subject.value[0] }}</span>
            Highest
          </span>
        </div>
        <button @click="click_hst_nxt()" class="btn-page lg:right-[25%]">></button>
      </div>
      <h3 class="py-3">0</h3>
    </div>
  </div>

  <div class="m-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
    <div class="self-start rounded-[5px] p-5 bg-white shadow-md">
      <h3 class="card-title">Operations</h3>
      <button
          @click="click_create()"
          class="my-2 p-1 bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white rounded-[7px]"
      >
        Add New Record
      </button>
    </div>

    <div class="col-span-2 rounded-[5px] p-5 bg-white shadow-md">
      <h3 class="card-title">Student Performance Records</h3>
      <el-table :data="tableData">
        <el-table-column class-name="text-xs" prop="name" label="Name" sortable></el-table-column>
        <el-table-column class-name="text-xs" prop="eng" label="English" sortable></el-table-column>
        <el-table-column class-name="text-xs" prop="math" label="Mathematics" sortable></el-table-column>
        <el-table-column class-name="text-xs" prop="pe" label="Physical Education" sortable></el-table-column>
        <el-table-column>
          <template #default>
            <button class="p-1 bg-red-400 hover:bg-red-500 active:bg-red-600 text-white rounded-[7px]">
              Delete
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";

el-table-column {
  @apply text-xs;
}

.card {
  @apply p-5 bg-white shadow-md rounded-[5px] flex flex-col items-center;
}

.card-title {
  @apply pb-3 border-b-4 border-double border-b-gray-200;
}

.btn {
  @apply cursor-pointer;
}

.btn-page {
  @apply text-gray-600 cursor-pointer;
}
</style>
