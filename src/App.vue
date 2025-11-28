<script setup>
import {ref, onMounted} from "vue";

import {CycleList} from "@/assert/CycleList.mjs";

import CreateForm from './components/CreateForm.vue';

/**
 * API base URL for backend communication.
 */
const URL = "http://localhost:8000/api"

/**
 * Reactive reference to the current subject node in a cycle list used for calculating average grades.
 * The cycle list contains:
 * - Display name of the subject
 * - Tailwind CSS class for color styling
 * - Data property key used to access grade values
 */
const avg_subject = ref((new CycleList(
    ["All Sub", "text-red-500", "all_sub"],
    ["Eng", "text-gray-500", "englishGrade"],
    ["Math", "text-green-500", "mathGrade"],
    ["PE", "text-blue-500", 'peGrade'],
)).head);

/**
 * Reactive reference to the current subject node in a cycle list used for determining highest grades.
 * Same structure as [avg_subject](file://D:\Code\JS\web_design\src\App.vue#L9-L14).
 */
const hst_subject = ref((new CycleList(
    ["All Sub", "text-red-500", "all_sub"],
    ["Eng", "text-gray-500", "englishGrade"],
    ["Math", "text-green-500", "mathGrade"],
    ["PE", "text-blue-500", 'peGrade'],
)).head);

/**
 * Reference to the CreateForm component instance to control modal visibility.
 */
const create_form_ref = ref();

/**
 * Reactive array storing all student records fetched from the server.
 */
const tableData = ref(null);

/**
 * Number of students currently loaded into the system.
 */
const std_num = ref(0);

/**
 * Average grade calculated based on selected subject ([avg_subject](file://D:\Code\JS\web_design\src\App.vue#L9-L14)).
 */
const avg_grade = ref(0);

/**
 * Highest grade holder information formatted as "{grade}({studentName})".
 */
const hst_grade = ref('0(N/A)');

/**
 * Lifecycle hook that runs after component is mounted.
 * Fetches initial student data from the backend API, computes overall average per student,
 * updates reactive state variables, and triggers UI updates.
 */
onMounted(() => {
  fetch(`${URL}/grades`).then(res => res.json()).then(
      data => {
        // Compute overall average score across English, Math, and PE for each student
        data.forEach(data => {
          data['all_sub'] = Math.floor((data['englishGrade'] + data['mathGrade'] + data['peGrade']) / 3);
        });
        tableData.value = data;
        std_num.value = tableData.value.length;
        set_avg();
        set_hst();
      }
  )
})

/**
 * Calculates and sets the average grade for the currently selected subject in [avg_subject](file://D:\Code\JS\web_design\src\App.vue#L9-L14).
 * Uses reduce to sum up all relevant subject scores and divides by number of students.
 */
function set_avg() {
  const init = 0;

  const total = tableData.value.reduce(
      (acc, cur) => acc + cur[avg_subject.value.value[2]],
      init,
  );
  avg_grade.value = Math.floor(total/std_num.value);
}

/**
 * Determines the student with the highest grade in the currently selected subject in [hst_subject](file://D:\Code\JS\web_design\src\App.vue#L15-L20).
 * Updates [hst_grade](file://D:\Code\JS\web_design\src\App.vue#L25-L25) with the formatted string including both the top score and the student's name.
 */
function set_hst() {
  const init = 0;

  const total = tableData.value.reduce(
      (acc, cur) => {
        const subGrade = cur[hst_subject.value.value[2]];
        const is_cur_hst = subGrade > acc;
        hst_grade.value = is_cur_hst ? cur['name'] : hst_grade.value;
        return is_cur_hst ? subGrade : acc;
      },
      init
  );
  hst_grade.value = `${Math.floor(total)}(${hst_grade.value})`;
}

/**
 * Moves the [avg_subject](file://D:\Code\JS\web_design\src\App.vue#L9-L14) pointer to the previous item in the cycle list and recalculates average.
 */
function click_avg_pre() {
  avg_subject.value = avg_subject.value.pre;
  set_avg();
}

/**
 * Moves the [avg_subject](file://D:\Code\JS\web_design\src\App.vue#L9-L14) pointer to the next item in the cycle list and recalculates average.
 */
function click_avg_nxt() {
  avg_subject.value = avg_subject.value.nxt;
  set_avg();
}

/**
 * Moves the [hst_subject](file://D:\Code\JS\web_design\src\App.vue#L15-L20) pointer to the previous item in the cycle list and recalculates highest scorer.
 */
function click_hst_pre() {
  hst_subject.value = hst_subject.value.pre;
  set_hst();
}

/**
 * Moves the [hst_subject](file://D:\Code\JS\web_design\src\App.vue#L15-L20) pointer to the next item in the cycle list and recalculates highest scorer.
 */
function click_hst_nxt() {
  hst_subject.value = hst_subject.value.nxt;
  set_hst();
}

/**
 * Triggers the display of the CreateForm modal dialog for adding new student records.
 */
function click_create() {
  create_form_ref.value.showModal();
}

/**
 * Handles deletion of a student record at index `i`. Sends DELETE request to backend API,
 * removes the entry locally from [tableData](file://D:\Code\JS\web_design\src\App.vue#L22-L22), decrements student count, and refreshes statistics.
 *
 * @param {number} i - Index of the row being deleted in the tableData array
 * @param {Object} data - Full data object representing the student record to be deleted
 */
function handle_delete(i, data) {
  const sid = data.studentId;
  fetch(
      `${URL}/grade/${sid}`,
      {method: "DELETE",},
  ).then(() => {
    tableData.value.splice(i, 1);
    std_num.value--;
    set_avg();
    set_hst();
  });
}

/**
 * Event handler triggered when a new student record has been successfully created via the form.
 * Adds the new record to local storage, increments student count, recomputes overall average,
 * and refreshes displayed statistics.
 *
 * @param {Object} data - Newly created student data received from the form submission
 */
function event_created(data) {
  std_num.value++;

  data['all_sub'] = Math.floor((data['englishGrade'] + data['mathGrade'] + data['peGrade']) / 3);
  tableData.value.push(data);

  set_avg();
  set_hst();
}
</script>

<template>
  <!-- Page header section containing title and description -->
  <header class="m-5 p-3 bg-linear-to-br from-purple-800 to-blue-500 rounded-2xl flex flex-col gap-2 items-center">
    <h1 class="text-white">Student Marking System</h1>
    <span class="text-white">Efficiently manage student performance and view statistical analysis in real time</span>
  </header>

  <!-- Modal form component for creating new student records -->
  <CreateForm ref="create_form_ref" v-model="URL" @created="event_created"/>

  <!-- Dashboard cards showing key metrics: student count, average grade, and highest scorer -->
  <div class="m-5 grid grid-cols-3 gap-5">
    <div class="card">
      <span class="text-gray-400">Num Of Stds</span>
      <h3 class="py-3">{{ std_num }}</h3>
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
      <h3 class="py-3">{{ avg_grade }}</h3>
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
      <h3 class="py-3">{{ hst_grade }}</h3>
    </div>
  </div>

  <!-- Main content area with operations panel and student records table -->
  <div class="m-5 grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-x-5">
    <div class="self-start rounded-[5px] p-5 bg-white shadow-md">
      <h3 class="card-title">Operations</h3>
      <button
          @click="click_create()"
          class="my-2 py-1 px-2 bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white rounded-[7px]"
      >
        Add New Record
      </button>
    </div>

    <div class="col-span-2 rounded-[5px] p-5 bg-white shadow-md">
      <h3 class="card-title">Student Performance Records</h3>
      <el-table :data="tableData" table-layout="auto">
        <el-table-column class-name="text-xs" prop="name" label="Name" sortable></el-table-column>
        <el-table-column class-name="text-xs" prop="englishGrade" label="English" sortable></el-table-column>
        <el-table-column class-name="text-xs" prop="mathGrade" label="Mathematics" sortable></el-table-column>
        <el-table-column class-name="text-xs" prop="peGrade" label="Physical Education" sortable></el-table-column>
        <el-table-column class-name="text-xs" prop="all_sub" label="Average" sortable>
          <template #default="scope">
            {{ scope.row.all_sub }}<span v-if="scope.row.all_sub < 60" class="text-red-500">**</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <button
                @click="handle_delete(scope.$index, scope.row)"
                class="p-1 bg-red-400 hover:bg-red-500 active:bg-red-600 text-white rounded-[7px]"
            >
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

.btn-page {
  @apply text-gray-600 cursor-pointer;
}
</style>
