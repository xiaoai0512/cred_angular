<template>
  <DynamicCrudPage v-if="pageType === 'crudPage'" :config="config"/>
</template>
<script>
import DynamicCrudPage from '@/components/DynamicCrudPage'
import ApiService from '@/api/api-service'
export default {
  name: 'Crud',
  components: { DynamicCrudPage },
  data () {
    return {
      config: undefined,
      pageType: undefined
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler (newValue) {
        if (newValue.meta.isDynamicPage === 'T') {
          this.queryPageConfig(newValue.meta.pagePk)
        }
      }
    }
  },
  created () {
    const pagePk = this.$route.meta.pagePk
    this.queryPageConfig(pagePk)
  },
  methods: {
    queryPageConfig (pagePk) {
      ApiService.post('/api/dyPageService/queryPageConfig', { pagePk: pagePk }, (res) => {
        console.log(res)
        let pageConfig = res.data.pageConfig || '[]'
        pageConfig = JSON.parse(pageConfig)
        this.config = pageConfig.map(item => JSON.parse(item))
        console.log(this.config)
        this.pageType = res.data.pageType
      })
    }
  }
}
</script>
