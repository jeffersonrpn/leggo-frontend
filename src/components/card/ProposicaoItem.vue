<template>
  <div class="proposicao-card">
    <router-link
      :to="linkProp"
      class="card-header">
      <proposicao-header
        :prop="prop"
        :clicked="dropShow" />
    </router-link>
  </div>
</template>

<script>
import ProposicaoHeader from './ProposicaoHeader'

export default {
  name: 'Proposicaoitem',
  data () {
    return {
      dropShow: false
    }
  },
  components: {
    ProposicaoHeader
  },
  props: {
    prop: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    linkProp () {
      return {
        name: 'proposicao',
        params: {
          id_leggo: this.prop.id_leggo
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.proposicao-card {
  position: relative;
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;
  .card-header {
    cursor: pointer;
  }
}
.card-body {
  border: 1px solid #dadada;
  border-top: none;
}
</style>
