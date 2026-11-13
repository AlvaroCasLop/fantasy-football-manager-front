import { shallowRef, ref, onMounted } from 'vue'

/** Estado mínimo para una petición: datos, carga, error y reintento. */
export function useAsyncData<T>(fetcher: () => Promise<T>, { immediate = true } = {}) {
  const data = shallowRef<T>()
  const loading = ref(false)
  const error = ref<unknown>(null)

  async function execute() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  if (immediate) onMounted(execute)

  return { data, loading, error, execute }
}
