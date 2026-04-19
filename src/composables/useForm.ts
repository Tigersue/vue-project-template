/**
 * Generic form dialog composable
 *
 * const { formRef, formData, dialogVisible, openCreate, openEdit, submitForm } = useForm(...)
 */
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'

export function useForm<T extends object>(
  initial: () => T,
  onSubmit: (data: T, isEdit: boolean) => Promise<void>,
) {
  const formRef        = ref<FormInstance>()
  const formData       = reactive<T>(initial()) as T
  const dialogVisible  = ref(false)
  const isEdit         = ref(false)
  const submitting     = ref(false)

  function openCreate() {
    Object.assign(formData, initial())
    isEdit.value         = false
    dialogVisible.value  = true
  }

  function openEdit(row: T) {
    Object.assign(formData, row)
    isEdit.value         = true
    dialogVisible.value  = true
  }

  async function submitForm() {
    await formRef.value?.validate()
    submitting.value = true
    try {
      await onSubmit({ ...formData }, isEdit.value)
      dialogVisible.value = false
    } finally {
      submitting.value = false
    }
  }

  function closeDialog() {
    dialogVisible.value = false
    formRef.value?.resetFields()
  }

  return { formRef, formData, dialogVisible, isEdit, submitting, openCreate, openEdit, submitForm, closeDialog }
}
