import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useWeatherInfo = defineStore('weather', {
  state: () => ({
    weatherInfo: {
      searchName: ref(''), //検索条件の都道府県名を保持する
      searchInfo: ref(''), //概要情報(配列)
      weatherDetails: ref(''), //詳細情報(配列)
      searchId: ref(''), //都道府県のID
    },
    areaInfo: ref([]),
  }),

  getters: {
    //画面表示用にデータを加工する
    serchResult: (state) => {
      return state.weatherInfo.weatherDetails[0].timeSeries[0].areas
    },

    serchResultWeek: (state) => {
      return state.weatherInfo.weatherDetails[1].timeSeries[0].areas
    },
  },

  actions: {
    // APIから情報を取得する処理
    async searchArea() {
      try {
        //地域一覧の情報を取得する
        const url = ref(`https://www.jma.go.jp/bosai/common/const/area.json`)
        const res = await axios.get(url.value)

        //取得した地域一覧情報をkey,valueに成型する
        const areaInfo = Object.entries(res.data.offices)

        //地域から取得したID,{情報}の情報.nameからfindメソッドを使用しIDを取得
        for (let i = 0; i < areaInfo.length; i++) {
          if (Object.values(areaInfo)[i][1].name.includes(this.weatherInfo.searchName)) {
            this.weatherInfo.searchId = Object.values(areaInfo)[i][0]
            break
          } else {
          }
        }

        const url2 = ref(
          `https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${this.weatherInfo.searchId}.json`,
        )
        const res2 = await axios.get(url2.value)
        this.weatherInfo.searchInfo = res2.data

        const url3 = ref(
          `https://www.jma.go.jp/bosai/forecast/data/forecast/${this.weatherInfo.searchId}.json`,
        )
        const res3 = await axios.get(url3.value)
        this.weatherInfo.weatherDetails = res3.data
      } catch (err) {
        console.error('天気取得失敗:', err)
      }
    },

    clearSerchInfo() {
      this.weatherInfo.searchName = ''
      this.weatherInfo.searchInfo = ''
      this.weatherInfo.weatherDetails = ''
      this.weatherInfo.searchId = ''
    },
  },
})
