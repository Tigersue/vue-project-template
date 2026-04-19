/**
 * Generic paginated table composable
 *
 * const { list, loading, pagination, load } = useTable(userApi.list)
 */
import { ref, reactive } from 'vue'
import type { PageQuery, PageResult } from '@/types/api'

export function useTable<T>(
  fetchFn: (params: PageQuery) => Promise<PageResult<T>>,
  initialQuery: PageQuery = {},
) {
  const list    = ref<T[]>([])
  const loading = ref(false)
  const total   = ref(0)

  const pagination = reactive({
    page:     1,
    pageSize: 20,
  })

  const query = reactive<PageQuery>({ ...initialQuery })

  async function load() {
    loading.value = true
    try {
      const res = await fetchFn({ ...query, ...pagination })
      list.value  = res.list as T[]
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  function handlePageChange(page: number) {
    pagination.page = page
    load()
  }

  function handleSizeChange(size: number) {
    pagination.pageSize = size
    pagination.page     = 1
    load()
  }

  function reset() {
    Object.assign(query, initialQuery)
    pagination.page = 1
    load()
  }

  return { list, loading, total, pagination, query, load, handlePageChange, handleSizeChange, reset }
}
