<template>
  <PageContainer>
    <template #header>
      <SearchForm :model-value="query" @search="load" @reset="reset">
        <el-form-item label="Role name">
          <el-input v-model="query.name" placeholder="Search role" clearable />
        </el-form-item>
      </SearchForm>
    </template>

    <TableActions @refresh="load">
      <template #left>
        <el-button v-auth="'admin'" type="primary" :icon="Plus" @click="openCreate">Add Role</el-button>
      </template>
    </TableActions>

    <el-table :data="list" v-loading="loading" border stripe>
      <el-table-column prop="name"        label="Role Name"   min-width="130" />
      <el-table-column prop="code"        label="Code"        min-width="130" />
      <el-table-column prop="description" label="Description" min-width="200" />
      <el-table-column prop="createdAt"   label="Created"     min-width="160">
        <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="Actions" width="140" fixed="right" align="center">
        <template #default="{ row }">
          <el-button v-auth="'admin'" link type="primary" @click="openEdit(row)">Edit</el-button>
          <el-button v-auth="'admin'" link type="danger"  @click="handleDelete(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="mt-4"
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Role' : 'Add Role'" width="440px" @close="closeDialog">
      <el-form ref="formRef" :model="formData" label-width="90px">
        <el-form-item label="Name" prop="name"   :rules="[{ required: true, message: 'Required' }]">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="Code" prop="code"   :rules="[{ required: true, message: 'Required' }]">
          <el-input v-model="formData.code" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="formData.description" type="textarea" :rows="3" />
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
import { roleApi, type Role } from '@/api/role'
import { useTable } from '@/composables/useTable'
import { useForm }  from '@/composables/useForm'
import { formatDate } from '@/utils/format'
import PageContainer from '@/components/common/PageContainer.vue'
import SearchForm    from '@/components/common/SearchForm.vue'
import TableActions  from '@/components/common/TableActions.vue'

const { list, loading, total, pagination, query, load, handlePageChange, handleSizeChange, reset } =
  useTable(roleApi.list, { name: '' })

onMounted(load)

const emptyRole = (): Partial<Role> => ({ name: '', code: '', description: '' })

const { formRef, formData, dialogVisible, isEdit, submitting, openCreate, openEdit, submitForm, closeDialog } =
  useForm<Partial<Role>>(emptyRole, async (data, editing) => {
    if (editing) {
      await roleApi.update((formData as Role).id, data)
      ElMessage.success('Role updated')
    } else {
      await roleApi.create(data)
      ElMessage.success('Role created')
    }
    load()
  })

async function handleDelete(row: Role) {
  await ElMessageBox.confirm(`Delete role "${row.name}"?`, 'Confirm', { type: 'warning' })
  await roleApi.remove(row.id)
  ElMessage.success('Deleted')
  load()
}
</script>

<style scoped>
.mt-4 { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
