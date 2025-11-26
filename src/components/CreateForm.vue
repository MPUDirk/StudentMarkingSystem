<script setup>
import {ref} from 'vue';

/**
 * Define the model for URL binding.
 */
const URL = defineModel();

/**
 * Define custom events that can be emitted by this component.
 */
const emits = defineEmits(['created']);

/**
 * Initialize form data with default values.
 * @returns {Object} The initialized form object containing student information fields.
 */
const init_form = () => {
  return {
    name: "",
    englishGrade: 0,
    mathGrade: 0,
    peGrade: 0,
  };
};

/**
 * Reactive reference to the current form data.
 */
const form_data = ref(init_form());

/**
 * Initialize error messages for each field in the form.
 * @returns {Object} An object mapping field names to empty strings representing initial validation states.
 */
const init_errors = () => {
  return {
    name: "",
    englishGrade: "",
    mathGrade: "",
    peGrade: "",
  }
};

/**
 * Reactive reference to field-specific validation errors.
 */
const field_errors = ref(init_errors());

/**
 * Validation rules for each input field.
 * Each rule includes a test function and an associated error message.
 */
const field_validators = {
  name: [
    {
      test: (val) => val.length > 0,
      message: "Name is required"
    }
  ],
  englishGrade: [
    {
      test: (val) => Number(val) >= 0 && Number(val) <= 100 && val !== "",
      message: "English grade must be between 0 and 100"
    }
  ],
  mathGrade: [
    {
      test: (val) => Number(val) >= 0 && Number(val) <= 100 && val !== "",
      message: "Math grade must be between 0 and 100"
    }
  ],
  peGrade: [
    {
      test: (val) => Number(val) >= 0 && Number(val) <= 100 && val !== "",
      message: "PE grade must be between 0 and 100"
    }
  ]
};

/**
 * Controls visibility of the modal dialog.
 */
const modal_visible = ref(false);

/**
 * Stores the element where mouse down event was triggered, used to detect clicks outside content area.
 */
let mouse_down_target = null;

/**
 * Show the modal dialog.
 */
function showModal() {
  modal_visible.value = true;
}

/**
 * Validate a single input field based on its defined validators.
 * @param {HTMLInputElement} target - The DOM input element being validated.
 * @returns {boolean} True if valid, false otherwise.
 */
function validate_input(target) {
  const input_name = target.name;
  const validators = field_validators[input_name];
  for (const validator of validators) {
    if (!validator.test(form_data.value[input_name])) {
      field_errors.value[input_name] = validator.message;
      target.setCustomValidity(field_errors.value[input_name]);
      return false;
    }
  }
  target.setCustomValidity('');
  field_errors.value[input_name] = "";
  return true;
}

/**
 * Validate all form fields before submission.
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function validate_form() {
  let is_valid = true;

  for (const input_name in field_validators) {
    if (!validate_input(document.getElementById(input_name))) {
      is_valid = false;
    }
  }
  return is_valid;
}

/**
 * Handle click events on the backdrop to close the modal when clicking outside the content area.
 * @param {MouseEvent} event - Mouse up event object.
 */
function click_hidden(event) {
  if (mouse_down_target === event.currentTarget && event.target === event.currentTarget) {
    modal_visible.value = false;
  }
}

/**
 * Increment the value of a numeric input field.
 * @param {string} input_name - Name of the field to increment.
 */
function click_add(input_name) {
  form_data.value[input_name]++;
  validate_input(document.getElementById(input_name));
}

/**
 * Decrement the value of a numeric input field.
 * @param {string} input_name - Name of the field to decrement.
 */
function click_minus(input_name) {
  form_data.value[input_name]--;
  validate_input(document.getElementById(input_name));
}

/**
 * Submit the form data via POST request after validating it.
 */
function post_create() {
  if (!validate_form()) {
    return;
  }

  fetch(
      URL.value + '/grade',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form_data.value),
      },
  ).then(
      () => {
        modal_visible.value = false;
        emits('created', form_data.value);
        form_data.value = init_form();
      }
  );
}

/**
 * Expose methods to parent components.
 */
defineExpose({
  showModal
});
</script>

<template>
  <!-- Backdrop overlay shown when modal is visible -->
  <div
      class="z-9999 fixed inset-0 bg-gray-600/50 h-full w-full"
      :class="modal_visible?'':'hidden'"
      @mousedown="(event) => {mouse_down_target = event.target;}"
      @mouseup="click_hidden"
  >
    <!-- Modal container centered vertically and horizontally -->
    <div class="mt-30 mx-auto w-[50%] md:w-[40%] lg:w-[30%] p-5 bg-white rounded-md">
      <h3 class="mb-5">Add a new record</h3>

      <!-- Form for creating a new student grade entry -->
      <form @submit.prevent="post_create()" method="POST" class="grid grid-cols-1 gap-2" novalidate>
        <!-- Student Name Field -->
        <div>
          <label>Student Name</label>
          <br>
          <input
              id="name" name="name" class="w-full" type="text"
              v-model.number="form_data['name']" @blur="(event) => {validate_input(event.target)}"
          >
          <br>
          <span class="text-red-500" v-html="field_errors.name" />
        </div>

        <!-- English Grade Input Group -->
        <div>
          <label>English Grade</label>
          <div class="input-groups">
            <button type="button" @click="click_minus('englishGrade')">-</button>
            <input
                id="englishGrade" name="englishGrade" type="text"
                v-model.number="form_data['englishGrade']" @blur="(event) => {validate_input(event.target)}"
            >
            <button type="button" @click="click_add('englishGrade')">+</button>
          </div>
          <span class="text-red-500" v-html="field_errors.englishGrade" />
        </div>

        <!-- Math Grade Input Group -->
        <div>
          <label>Math Grade</label>
          <div class="input-groups">
            <button @click.prevent="click_minus('mathGrade')">-</button>
            <input
                id="mathGrade" name="mathGrade" type="text"
                v-model.number="form_data['mathGrade']" @blur="(event) => {validate_input(event.target)}"
            >
            <button @click.prevent="click_add('mathGrade')">+</button>
          </div>
          <span class="text-red-500" v-html="field_errors.mathGrade" />
        </div>

        <!-- PE Grade Input Group -->
        <div>
          <label>PE Grade</label>
          <div class="input-groups">
            <button @click.prevent="click_minus('peGrade')">-</button>
            <input
                id="peGrade" name="peGrade" type="text"
                v-model.number="form_data['peGrade']" @blur="(event) => {validate_input(event.target)}"
            >
            <button @click.prevent="click_add('peGrade')">+</button>
          </div>
          <span class="text-red-500" v-html="field_errors.peGrade" />
        </div>

        <!-- Action Buttons -->
        <div class="mt-5 w-full flex justify-end gap-2">
          <button
              type="button"
              class="p-1 text-white bg-red-300 hover:bg-red-400 active:bg-red-500 rounded-[7px]"
              @click="modal_visible = false"
          >
            Cancel
          </button>
          <button class="p-1 text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-[7px]">
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Import Tailwind CSS utilities */
@import "tailwindcss";

/* Style for general input elements */
input{
  @apply min-w-0
    outline -outline-offset-1 outline-gray-400
    rounded-[5px]
    focus:outline-2 focus:-outline-offset-2 focus:outline-black py-1 pl-2
    invalid:outline-red-500;
}

/* Style for grouped inputs like number spinners */
.input-groups {
  @apply flex w-full outline -outline-offset-1 outline-gray-400 rounded-[5px] has-[input:invalid]:outline-red-500;
}

/* Style for buttons inside input groups */
.input-groups button{
  @apply bg-gray-100 hover:bg-gray-200 active:bg-gray-300 px-2;
}

/* Style for input fields within input groups */
.input-groups input{
  @apply rounded-none grow;
}
</style>
