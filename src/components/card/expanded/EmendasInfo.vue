<template>
  <div>
    <h5>{{ propName }} - {{ capitalizeFirstLetter(casa) }}</h5>
    <div v-if="verificaSeMostraEmendas">
      <h5>Total: {{ propEmendas.length }} | Analisadas: {{ getAnalisadas }}</h5>
      <el-tabs>
        <el-tab-pane label="Todas as emendas">
          <emendas-tab-content
            :emendas="emendas[id]"
            :categoria="'todas'" />
        </el-tab-pane>
        <el-tab-pane
          v-if="verificaSeMostraEmendasAnalisadas"
          label="Mudanças Mais Aparentes">
          <emendas-tab-content
            :emendas="getDiscrepantes"
            :categoria="'drásticas'"
            :show-texto-explicacao="showTextoExplicacao"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="verificaSeMostraEmendasAnalisadas"
          label="Mudanças Mais Sutis">
          <emendas-tab-content
            :emendas="getSemelhantes"
            :categoria="'pontuais'"
            :show-texto-explicacao="showTextoExplicacao"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else-if="(propEmendas === undefined || propEmendas.length === 0)">
      <div
        class="title sem-emendas"
      >Não foram apresentadas emendas para esta proposição {{ getCasa | toFormattedName }}</div>
    </div>
    <div v-else>
      <div class="title sem-emendas">
        Não foi possível analisar as emendas {{ getCasa | toFormattedName }}.</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import EmendasTabContent from './EmendasTabContent'

export default {
  name: 'EmendasInfo',
  components: {
    EmendasTabContent
  },
  props: {
    id: {
      type: Number,
      default: undefined
    },
    casa: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: function () {
        return moment()
      }
    },
    numEtapas: {
      type: Number,
      default: undefined
    },
    propName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      LIMIAR: 10
    }
  },
  filters: {
    toFormattedName (value) {
      if (value === 'senado') {
        return 'no Senado'
      } else if (value === 'camara') {
        return 'na Câmara'
      } else {
        return value
      }
    }
  },
  mounted () {
    this.getEmendas(this.query)
  },
  methods: {
    capitalizeFirstLetter (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    formatDate (date) {
      return moment(date).format('DD/MM/YYYY')
    },
    ...mapActions(['getEmendas'])
  },
  computed: {
    propEmendas () {
      return this.emendas[this.id]
    },
    ...mapState({
      emendas: state => state.emendas.emendasDict
    }),
    formattedDate () {
      return moment(this.date).format('YYYY-MM-DD')
    },
    query () {
      return {
        params: {
          casa: this.casa,
          id: this.id,
          dataFim: this.formattedDate
        }
      }
    },
    orderedEmendas () {
      return this.emendas[this.id]
        ? this.emendas[this.id]
          .filter(emenda => emenda.distancia !== -1)
          .sort((a, b) => b.distancia - a.distancia)
        : this.emendas[this.id]
    },
    getDiscrepantes () {
      return _.take(
        this.orderedEmendas,
        _.ceil(this.orderedEmendas.length / 2)
      )
    },
    getSemelhantes () {
      const reversedEmendas = _.reverse(this.orderedEmendas)
      if (!this.verificaSeMostraEmendasAparentes) {
        return _.takeRight(
          reversedEmendas,
          Math.min(5, this.orderedEmendas.length)
        )
      } else {
        return _.takeRight(
          reversedEmendas,
          _.floor(this.orderedEmendas.length / 2)
        )
      }
    },
    verificaSeMostraEmendas () {
      return (
        this.propEmendas &&
        this.propEmendas.length
      )
    },
    getAnalisadas () {
      var analisadas = 0
      this.orderedEmendas.forEach(function (emenda) {
        if (emenda.distancia !== -1) {
          analisadas++
        }
      })
      return analisadas
    },
    getCasa () {
      return this.orderedEmendas &&
        this.orderedEmendas[0] &&
        this.orderedEmendas[0].local.startsWith('CMMPV')
        ? 'Congresso Nacional'
        : this.casa
    },
    verificaSeMostraEmendasAnalisadas () {
      return (
        this.verificaSeMostraEmendas &&
        this.getAnalisadas &&
        this.propEmendas.length > this.LIMIAR
      )
    },
    showTextoExplicacao () {
      return this.propEmendas.length !== this.getAnalisadas
    }
  },
  watch: {
    date () {
      this.getEmendas(this.query)
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 0.97rem;
  line-height: 15px;
}
.emendas {
  font-size: 10pt;
  text-align: center;
}
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  padding: 0.5rem;
  text-align: left;
}
.sem-emendas {
  color: #969696;
  font-size: 0.8em;
}
</style>
