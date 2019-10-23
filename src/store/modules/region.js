import { setRegion, setAz } from '@/utils/auth'
const region = {
    state: {
        region: '',
        az: '',
    },

    mutations: {
        SET_REGION: (state, region) => {
            state.region = region
        },
        SET_AZ: (state, az) => {
            state.az = az
        }
    },

    actions: {
        addRegion({commit}, region) {
            commit('SET_REGION', region)
            setRegion(region)
        },
        addAz({commit}, az) {
            commit('SET_AZ', az)
            setAz(az)
        },

    }
}

export default region
