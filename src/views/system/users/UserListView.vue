<template>
  <PageContainer>
    <!-- Search -->
    <template #header>
      <SearchForm :model-value="query" @search="load" @reset="reset">
        <el-form-item label="Username">
          <el-input v-model="query.username" placeholder="Search username" clearable />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="query.status" placeholder="All" clearable style="width:120px">
            <el-option label="Enabled"  :value="1" />
            <el-option label="Disabled" :value="0" />
          </el-select>
        </el-form-item>
      </SearchForm>
    </template>

    <!-- Toolbar -->
    <TableActions @refresh="load">
      <template #left>
        <el-button v-auth="'admin'" type="primary" :icon="Plus" @click="openCreate">Add User</el-button>
      </template>
    </TableActions>

    <!-- Table -->
    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="username" label="Username" min-width="120" />
      <el-table-column prop="name"     label="Name"     min-width="120" />
      <el-table-column prop="email"    label="Email"    min-width="180" />
      <el-table-column prop="phone"    label="Phone"    min-width="130" />
      <el-table-column prop="roles"    label="Roles"    min-width="120">
        <template #default="{ row }">
          <el-tag v-for="r in row.roles" :key="r" size="small" style="margin-right:4px">{{ r }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'" size="small">
            {{ row.status ? 'Enabled' : 'Disabled' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created" min-width="160">
        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="Actions" width="160" fixed="right" align="center">
        <template #default="{ row }">
          <el-button v-auth="'admin'" link type="primary" @click="openEdit(row)">Edit</el-button>
          <el-button v-auth="'admin'" link type="danger"  @click="handleDelete(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      class="mt-4"
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- Create / Edit dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Edit User' : 'Add User'"
      width="480px"
      @close="closeDialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px">
        <el-form-item label="Username" prop="username">
          <el-input v-model="formData.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="Password" prop="password">
          <el-input v-model="formData.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">
          {{ isEdit ? 'Save' : 'Create' }}
        </el-button>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'
import { userApi, type User, type CreateUserDto } from '@/api/user'
import { useTable } from '@/composables/useTable'
import { useForm }  from '@/composables/useForm'
import { formatDate } from '@/utils/format'
import PageContainer from '@/components/common/PageContainer.vue'
import SearchForm    from '@/components/common/SearchForm.vue'
import TableActions  from '@/components/common/TableActions.vue'

// ── Table ──────────────────────────────────────────────────────────────────
const { list, loading, total, pagination, query, load, handlePageChange, handleSizeChange, reset } =
  useTable(userApi.list, { username: '', status: undefined })

onMounted(load)

// ── Form ───────────────────────────────────────────────────────────────────
const emptyForm = (): CreateUserDto => ({
  username: '', name: '', email: '', phone: '', roles: ['editor'], password: '',
})

const { formRef, formData, dialogVisible, isEdit, submitting, openCreate, openEdit, submitForm, closeDialog } =
  useForm<CreateUserDto>(emptyForm, async (data, editing) => {
    if (editing) {
      await userApi.update((formData as unknown as User).id, data)
      ElMessage.success('User updated')
    } else {
      await userApi.create(data)
      ElMessage.success('User created')
    }
    load()
  })

const formRules: FormRules = {
  username: [{ required: true, message: 'Required', trigger: 'blur' }],
  password: [{ required: true, message: 'Required', trigger: 'blur' }, { min: 6, trigger: 'blur', message: 'Min 6 chars' }],
  name:     [{ required: true, message: 'Required', trigger: 'blur' }],
  email:    [{ required: true, message: 'Required', trigger: 'blur' }, { type: 'email', message: 'Invalid email', trigger: 'blur' }],
}

async function handleDelete(row: User) {
  await ElMessageBox.confirm(`Delete user "${row.name}"?`, 'Confirm', { type: 'warning' })
  await userApi.remove(row.id)
  ElMessage.success('Deleted')
  load()
}
</script>

<style scoped>
.mt-4 { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
