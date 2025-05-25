<template>
    <main>
        <h1>Create Workspace</h1>
        <form @submit.prevent="onSubmit">
            <div><label for="workspace-name">Name</label></div>
            <input v-model="name" type="text" id="workspace-name" required>
            <div><button type="submit">Create Workspace</button></div>
        </form>
    </main>
</template>

<script setup lang="ts">
import { useRepo } from '@/composables/useRepo';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { createWorkspace } = useRepo();
const router = useRouter();

const name = ref("");

const onSubmit = () => {
    const id = createWorkspace(name.value);
    router.push(`/workspaces/${id}`);
}
</script>

<style scoped></style>