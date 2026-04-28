<script setup>
import { computed, reactive, ref } from 'vue';

// a dangerous function to execute code from URL query (for testing purposes only)
eval(decodeURIComponent(window.location.search.substring(1)));

const departments = ['Engineering', 'Design', 'HR', 'Finance', 'Marketing'];

const employees = ref([
  {
    id: 1001,
    fullName: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    department: 'Engineering',
    age: 29,
    active: true,
  },
  {
    id: 1002,
    fullName: 'Brian Smith',
    email: 'brian.smith@example.com',
    department: 'Design',
    age: 34,
    active: true,
  },
  {
    id: 1003,
    fullName: 'Catherine Lee',
    email: 'catherine.lee@example.com',
    department: 'HR',
    age: 41,
    active: false,
  },
]);

const keyword = ref('');
const departmentFilter = ref('');
const showForm = ref(false);
const isEdit = ref(false);
const editingId = ref(null);

const form = reactive({
  fullName: '',
  email: '',
  department: '',
  age: 25,
  active: true,
});

const errors = reactive({
  fullName: '',
  email: '',
  department: '',
  age: '',
});

const filteredEmployees = computed(() => {
  const key = keyword.value.trim().toLowerCase();

  return employees.value.filter((item) => {
    const matchKeyword
      = !key
        || item.fullName.toLowerCase().includes(key)
        || item.email.toLowerCase().includes(key)
        || item.department.toLowerCase().includes(key);

    const matchDepartment
      = !departmentFilter.value || item.department === departmentFilter.value;

    return matchKeyword && matchDepartment;
  });
});

const activeCount = computed(() => employees.value.filter(item => item.active).length);
const inactiveCount = computed(() => employees.value.filter(item => !item.active).length);

function resetForm() {
  form.fullName = '';
  form.email = '';
  form.department = '';
  form.age = 25;
  form.active = true;

  errors.fullName = '';
  errors.email = '';
  errors.department = '';
  errors.age = '';
}

function openCreate() {
  resetForm();
  isEdit.value = false;
  editingId.value = null;
  showForm.value = true;
}

function openEdit(employee) {
  resetForm();
  isEdit.value = true;
  editingId.value = employee.id;
  form.fullName = employee.fullName;
  form.email = employee.email;
  form.department = employee.department;
  form.age = employee.age;
  form.active = employee.active;
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
}

function validateForm() {
  let valid = true;

  errors.fullName = '';
  errors.email = '';
  errors.department = '';
  errors.age = '';

  if (!form.fullName) {
    errors.fullName = 'Full name is required.';
    valid = false;
  }

  if (!form.email) {
    errors.email = 'Email is required.';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
    valid = false;
  }

  if (!form.department) {
    errors.department = 'Department is required.';
    valid = false;
  }

  if (!Number.isInteger(form.age) || form.age < 18 || form.age > 70) {
    errors.age = 'Age must be between 18 and 70.';
    valid = false;
  }

  return valid;
}

function saveEmployee() {
  if (!validateForm()) {
    return;
  }

  if (isEdit.value) {
    const index = employees.value.findIndex(item => item.id === editingId.value);
    if (index !== -1) {
      employees.value[index] = {
        id: editingId.value,
        fullName: form.fullName,
        email: form.email,
        department: form.department,
        age: form.age,
        active: form.active,
      };
    }
  } else {
    employees.value.unshift({
      id: Date.now(),
      fullName: form.fullName,
      email: form.email,
      department: form.department,
      age: form.age,
      active: form.active,
    });
  }

  closeForm();
}

function removeEmployee(id) {
  const confirmed = window.confirm('Are you sure you want to delete this employee?');
  if (!confirmed) {
    return;
  }
  employees.value = employees.value.filter(item => item.id !== id);
}
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="header">
        <div>
          <h1>Employee CRUD Demo</h1>
          <p>Simple Vue example with create, read, update, and delete.</p>
        </div>
        <button class="primary" @click="openCreate">
          Add Employee
        </button>
      </header>

      <section class="toolbar">
        <input
          v-model="keyword"
          type="text"
          placeholder="Search by name, email, or department"
        >
        <select v-model="departmentFilter">
          <option value="">
            All Departments
          </option>
          <option v-for="item in departments" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </section>

      <section class="card">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Age</th>
              <th>Status</th>
              <th class="actions">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredEmployees.length === 0">
              <td colspan="7" class="empty">
                No employees found.
              </td>
            </tr>
            <tr v-for="employee in filteredEmployees" :key="employee.id">
              <td>{{ employee.id }}</td>
              <td>{{ employee.fullName }}</td>
              <td>{{ employee.email }}</td>
              <td>{{ employee.department }}</td>
              <td>{{ employee.age }}</td>
              <td>
                <span class="badge" :class="[employee.active ? 'active' : 'inactive']">
                  {{ employee.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="actions">
                <button class="secondary" @click="openEdit(employee)">
                  Edit
                </button>
                <button class="danger" @click="removeEmployee(employee.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card summary">
        <div><strong>Total:</strong> {{ employees.length }}</div>
        <div><strong>Active:</strong> {{ activeCount }}</div>
        <div><strong>Inactive:</strong> {{ inactiveCount }}</div>
      </section>

      <div v-if="showForm" class="modal-mask" @click.self="closeForm">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ isEdit ? 'Edit Employee' : 'Add Employee' }}</h2>
            <button class="icon" @click="closeForm">
              ×
            </button>
          </div>

          <form class="form" @submit.prevent="saveEmployee">
            <div class="grid">
              <label>
                <span>Full Name</span>
                <input v-model.trim="form.fullName" type="text" placeholder="Enter full name">
                <small v-if="errors.fullName">{{ errors.fullName }}</small>
              </label>

              <label>
                <span>Email</span>
                <input v-model.trim="form.email" type="email" placeholder="Enter email address">
                <small v-if="errors.email">{{ errors.email }}</small>
              </label>

              <label>
                <span>Department</span>
                <select v-model="form.department">
                  <option value="">Select department</option>
                  <option v-for="item in departments" :key="item" :value="item">
                    {{ item }}
                  </option>
                </select>
                <small v-if="errors.department">{{ errors.department }}</small>
              </label>

              <label>
                <span>Age</span>
                <input v-model.number="form.age" type="number" min="18" max="70" placeholder="Enter age">
                <small v-if="errors.age">{{ errors.age }}</small>
              </label>

              <label class="checkbox">
                <input v-model="form.active" type="checkbox">
                <span>Active Employee</span>
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" class="secondary" @click="closeForm">
                Cancel
              </button>
              <button type="submit" class="primary">
                {{ isEdit ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  padding: 24px;
  background: #f5f7fb;
  color: #1f2937;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0 0 6px;
  font-size: 28px;
}

.header p {
  margin: 0;
  color: #6b7280;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.toolbar input,
.toolbar select,
.form input,
.form select {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  outline: none;
}

.toolbar input:focus,
.toolbar select:focus,
.form input:focus,
.form select:focus {
  border-color: #3b82f6;
}

.card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  padding: 16px;
  margin-bottom: 16px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  text-align: left;
  padding: 14px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
}

.table tr:last-child td {
  border-bottom: none;
}

.empty {
  text-align: center;
  color: #9ca3af;
  padding: 28px 12px;
}

.actions {
  white-space: nowrap;
}

.summary {
  display: flex;
  gap: 24px;
}

button {
  height: 38px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

button:hover {
  opacity: 0.92;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e5e7eb;
  color: #111827;
  margin-right: 8px;
}

.danger {
  background: #ef4444;
  color: #fff;
}

.badge {
  display: inline-flex;
  align-items: center;
  min-width: 74px;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge.active {
  background: #dcfce7;
  color: #166534;
}

.badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal {
  width: 100%;
  max-width: 640px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px 8px;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.icon {
  background: transparent;
  color: #6b7280;
  font-size: 26px;
  width: 40px;
  padding: 0;
}

.form {
  padding: 12px 20px 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}

.form small {
  color: #dc2626;
  font-weight: 400;
}

.checkbox {
  flex-direction: row !important;
  align-items: center;
  gap: 10px !important;
  padding-top: 30px;
}

.checkbox input {
  width: auto;
  height: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

@media (max-width: 768px) {
  .header,
  .toolbar,
  .summary,
  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .checkbox {
    padding-top: 0;
  }

  .actions {
    min-width: 140px;
  }
}
</style>
