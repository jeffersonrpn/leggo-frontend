<template>
  <div class="fasesBlock">
    <div
      v-for="(fase,i) in fasesResumidas"
      :key="i">
      <el-tooltip :content="getContent(fase)">
        <div
          class="fase"
          :class="geraEstilo(fase)"/>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { resumirFases } from '@/utils'
export default {
  name: 'Fases',
  props: {
    fases: {
      type: Array,
      default () { return [] }
    }
  },
  computed: {
    fasesResumidas () {
      return resumirFases(this.fases)
    }
  },
  methods: {
    geraEstilo (fase) {
      let classe = ''
      if (fase.pulou) {
        classe = 'pulou'
      }
      if (fase.data_inicio !== null) {
        if (!fase.is_mpv && (fase.local_casa === 'camara' || fase.local_casa === 'senado')) {
          classe = fase.local_casa
        } else if (fase.is_mpv) {
          if (fase.fase_global === 'Câmara dos Deputados' || fase.fase_global === 'Câmara dos Deputados - Revisão') {
            classe = 'camara'
          } else if (fase.fase_global === 'Senado Federal') {
            classe = 'senado'
          } else {
            classe = 'congresso'
          }
        } else {
          classe = 'congresso'
        }
      } else {
        classe = 'naoRealizada'
      }
      return classe
    },
    getContent (fase) {
      if (fase.is_mpv) {
        return fase.fase_global
      } else {
        return fase.local + '-' + fase.fase_global
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fasesBlock {
  display: flex;
}
.fase {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #723234;
  margin-right: 3px;
  border: 2px solid #dadada;
  position: relative;
}

.camara {
  background-color: #4eb65f;
  border-color: #4eb65f;
}

.senado {
  background-color: #4e8cb6;
  border-color: #4e8cb6;
}

.congresso {
  background-color: #b6af4e;
  border-color: #b6af4e;
}

.naoRealizada {
  background-color: transparent;
}

.pulou {
  background-color: #dadada;
  border-color: #dadada;
}
</style>
