import axios from './axios'

const temperaturas = {
  axios: axios,
  state: {
    temperaturas: {},
    coeficiente: {}
  },
  mutations: {
    setTemperatura (state, { id, temperatura }) {
      state.temperaturas[id] = temperatura
    },
    setCoeficiente (state, { id, coeficiente }) {
      state.coeficiente[id] = coeficiente
    }
  },
  getters: {
    maxTemperatura (state) {
      const temperaturas = state.temperaturas
      let maxTemperatura = 0
      Object.keys(temperaturas).forEach(function (key) {
        if (temperaturas[key] && temperaturas[key] > maxTemperatura) {
          maxTemperatura = temperaturas[key] + 5
        }
      })
      return maxTemperatura === 0 ? 10 : maxTemperatura
    }
  }
}
export default temperaturas
