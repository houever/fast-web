import { getLoginBg } from '@/api/index'
const loginBg = {
  state :{
    bgVideo:'',
    bgWebm:'',
    bgImg:'',
  },
  mutations: {
    SET_BG_VIDEO: (state, bgVideo) => {
      state.bgVideo = bgVideo
    },
    SET_BG_WEBM: (state, bgWebm) => {
      state.bgWebm = bgWebm
    },
    SET_BG_IMG: (state, bgImg) => {
      state.bgImg = bgImg
    },
  },
  actions:{
    SETLOGINBG({commit}){
      getLoginBg().then(res => {
        commit('SET_BG_VIDEO',res.data.bgVideo)
        commit('SET_BG_WEBM',res.data.bgWebm)
        commit('SET_BG_IMG',res.data.bgImg)
      })
    }
  }
}
export default loginBg
