<template>
  <div class="container mx-auto mt-6">
    <form class="w-full max-w-sm mx-auto">
      <div class="relative pt-1">
        <div
          class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200"
        >
          <div
            :style="{ width: width + '%'}"
            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 width-transition"
          ></div>
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-first-name"
          >
            First Name
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-first-name"
            type="text"
            placeholder="First Name"
            v-model="firstName"
            @input="update"
            required
          />
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-last-name"
          >
            Last Name
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-last-name"
            type="text"
            v-model="lastName"
            placeholder="Last Name"
            @input="update"
            required
          />
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-email"
          >
            Email
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-email"
            type="text"
            placeholder="Email"
            v-model="email"
            @input="update"
            required
          />
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-contact"
          >
            Contact No
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-contact"
            type="number"
            placeholder="Contact No"
            v-model="contact"
            @input="update"
            required
          />
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-description"
          >
            Description
          </label>
        </div>
        <div class="md:w-2/3">
          <textarea
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-description"
            placeholder="Description"
            v-model="desc"
            @input="update"
            resize
            required
          />
        </div>
      </div>
      <div class="md:flex md:items-center">
        <div class="md:w-1/3"></div>
        <div class="md:w-2/3">
          <button
            class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="button"
            @click.prevent="submit"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import firebase from "firebase/app";
import "firebase/firestore";
import { ref, onUnmounted } from "vue";

export default {
  setup() {
    let initialized = false;
    let currentDocKey = "";
    const firstName = ref("");
    const lastName = ref("");
    const contact = ref(0);
    const email = ref("");
    const desc = ref("");
    let timeoutId = -1;
    const db = firebase.firestore();
    const width = ref(0);
    let unsubscribe: () => void;
    let formRef = db.collection("createdForms").doc();

    function startListener() {
      unsubscribe = db
        .collection("createdForms")
        .doc(currentDocKey)
        .onSnapshot(function (doc) {
          width.value = doc?.data()?.completed;
        });
    }

    function initFirestore() {
      formRef = db.collection("createdForms").doc();
      currentDocKey = formRef.id;
      formRef
        .set({
          completed: 0,
        })
        .then(() => {
          initialized = true;
          startListener();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    initFirestore();
    async function updateDebounce() {
      if (!initialized) {
        initFirestore();
        return;
      }
      const data = {
        firstname: firstName.value,
        lastname: lastName.value,
        contact: contact.value,
        email: email.value,
        desc: desc.value,
      };
      formRef.update(data).catch((err) => {
        console.log(err);
      });
    }
    function update() {
      if (timeoutId >= 0) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        updateDebounce();
      }, 500);
    }
    async function submit() {
      const data = {
        firstname: firstName.value,
        lastname: lastName.value,
        contact: contact.value,
        email: email.value,
        desc: desc.value,
      };
      if (
        !data.firstname ||
        !data.lastname ||
        !data.email ||
        !data.contact ||
        !data.desc
      ) {
        alert("Fill all fields");
        return;
      }
      db.collection("submitForms")
        .add(data)
        .then(() => {
          formRef = db.collection("createdForms").doc();
          firstName.value = "";
          lastName.value = "";
          contact.value = 0;
          email.value = "";
          desc.value = "";
          alert("form submitted");
        })
        .catch((err) => {
          alert(err.message);
        });
    }
    onUnmounted(() => {
      unsubscribe();
    });
    return {
      firstName,
      lastName,
      email,
      contact,
      desc,
      update,
      submit,
      initFirestore,
      currentDocKey,
      initialized,
      updateDebounce,
      width,
      startListener,
    };
  },
};
</script>
<style lang="css" scoped>
  .width-transition{
    transition: all 0.3s;
  }
</style>
