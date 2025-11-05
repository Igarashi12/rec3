import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useWeatherCodeMap } from './weatherCodeMap'

export const useWeatherInfo = defineStore('weather', {
  state: () => ({
    weatherInfo: {
      searchName: '', //検索条件の都道府県名を保持する
      searchInfo: '', //概要情報(配列)
      weatherDetails: '', //詳細情報(配列)
      searchId: '', //都道府県のID
      weatherCode: '',
    },
    areaInfo: [],
    serchResult: [],
    serchResultWeek: [],
    todayDate: [],
    weekDate: [],
    todayWeatherIcon: '',
    weekWeatherIcon: '',
    tempsMax: [],
    tempsMin: [],
    areaCode: [],
    todayAreaCode: [],
    weekAreaCode: [],
  }),

  getters: {
    getIcon: (state) => {
      if (state.todayWeatherIcon.length > 0) {
        return state.todayWeatherIcon[0][0]
      }
      return `https://www.jma.go.jp/bosai/forecast/img/100.svg`
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
        //検索条件を文字数によって分岐、0:ランダム,1:部分一致,2以上:前方一致
        switch (this.weatherInfo.searchName.length) {
          case 0:
            this.weatherInfo.searchId =
              Object.values(areaInfo)[Math.floor(Math.random() * areaInfo.length)][0]
            break

          case 1:
            for (let i = 0; i < areaInfo.length; i++) {
              if (Object.values(areaInfo)[i][1].name.includes(this.weatherInfo.searchName)) {
                this.weatherInfo.searchId = Object.values(areaInfo)[i][0]
                break
              }
            }
            break

          default:
            for (let i = 0; i < areaInfo.length; i++) {
              if (Object.values(areaInfo)[i][1].name.startsWith(this.weatherInfo.searchName)) {
                this.weatherInfo.searchId = Object.values(areaInfo)[i][0]
                break
              }
            }
        }

        //概要取得
        const url2 = ref(
          `https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${this.weatherInfo.searchId}.json`,
        )
        const res2 = await axios.get(url2.value)
        this.weatherInfo.searchInfo = res2.data

        //詳細情報取得
        const url3 = ref(
          `https://www.jma.go.jp/bosai/forecast/data/forecast/${this.weatherInfo.searchId}.json`,
        )
        const res3 = await axios.get(url3.value)
        this.weatherInfo.weatherDetails = res3.data
        this.serchResult = this.weatherInfo.weatherDetails[0].timeSeries[0].areas
        this.serchResultWeek = this.weatherInfo.weatherDetails[1].timeSeries[0].areas

        //日付取得
        for (let a = 0; a < this.weatherInfo.weatherDetails.length; a++) {
          let date = this.weatherInfo.weatherDetails[a].timeSeries[0].timeDefines
          for (let i = 0; i < date.length; i++) {
            date[i] = date[i].substr(5, 5)
            date[i] = date[i].replace('-', '/')
          }
          if (a === 0) {
            this.todayDate = date
          } else {
            this.weekDate = date
          }
        }

        //天気コード設定
        const store = useWeatherCodeMap()
        const weatherCodeMap = store.weatherCodeMap
        for (let a = 0; a < this.weatherInfo.weatherDetails.length; a++) {
          let weatherCodes = new Array(
            this.weatherInfo.weatherDetails[a].timeSeries[0].areas.length,
          )

          for (let b = 0; b < this.weatherInfo.weatherDetails[a].timeSeries[0].areas.length; b++) {
            weatherCodes[b] = []

            for (
              let c = 0;
              c < this.weatherInfo.weatherDetails[a].timeSeries[0].areas[b].weatherCodes.length;
              c++
            ) {
              let code = this.weatherInfo.weatherDetails[a].timeSeries[0].areas[b].weatherCodes[c]
              const date = new Date()
              let H = date.getHours()
              let dayflag = 0

              if (a === 0 && c === 0 && (H < 6 || H > 16)) {
                dayflag = 1
              } else {
                dayflag = 0
              }
              let svgNumber = weatherCodeMap[code][dayflag]
              weatherCodes[b][c] = `https://www.jma.go.jp/bosai/forecast/img/${svgNumber}`
            }
          }
          if (a === 0) {
            this.todayWeatherIcon = weatherCodes
          } else {
            this.weekWeatherIcon = weatherCodes
          }

          //気温取得
          //エリア数分ループする
          let count = 0

          for (let i = 0; i < this.weatherInfo.weatherDetails[0].timeSeries[2].areas.length; i++) {
            this.areaCode[i] =
              `areacode${this.weatherInfo.weatherDetails[0].timeSeries[2].areas[i].area.code}`
            this.tempsMax[this.areaCode[i]] = {}
            this.tempsMin[this.areaCode[i]] = {}

            let tempsMaxWork = {}
            let tempsMinWork = {}
            //weekにエリアが存在しているか判定する。
            if (
              count < this.weatherInfo.weatherDetails[1].timeSeries[1].areas.length &&
              this.weatherInfo.weatherDetails[0].timeSeries[2].areas[i].area.code ===
                this.weatherInfo.weatherDetails[1].timeSeries[1].areas[count].area.code
            ) {
              //存在する場合週間予報を設定する
              let tempsMaxPass =
                this.weatherInfo.weatherDetails[1].timeSeries[1].areas[count].tempsMax
              let tempsMinPass =
                this.weatherInfo.weatherDetails[1].timeSeries[1].areas[count].tempsMin
              for (let j = 0; j < tempsMaxPass.length; j++) {
                this.weekAreaCode[count] =
                  `areacode${this.weatherInfo.weatherDetails[1].timeSeries[1].areas[count].area.code}`
                tempsMaxWork[this.weekDate[j]] = tempsMaxPass[j]
                tempsMinWork[this.weekDate[j]] = tempsMinPass[j]

                this.tempsMax[this.weekAreaCode[count]] = tempsMaxWork
                this.tempsMin[this.weekAreaCode[count]] = tempsMinWork
              }
              count++
            }

            //今日明日
            let tempsPass = this.weatherInfo.weatherDetails[0].timeSeries[2].areas[i].temps
            for (let j = 0, k = 0; j < tempsPass.length / 2; j += 1, k += 2) {
              if (tempsPass.length === 2) {
                tempsMaxWork[this.todayDate[j]] = '-'
                tempsMinWork[this.todayDate[j]] = '-'
                this.tempsMax[this.areaCode[i]] = tempsMaxWork
                this.tempsMin[this.areaCode[i]] = tempsMinWork
                tempsMaxWork[this.todayDate[j + 1]] = tempsPass[k + 1]
                tempsMinWork[this.todayDate[j + 1]] = tempsPass[k]
                this.tempsMax[this.areaCode[i]] = tempsMaxWork
                this.tempsMin[this.areaCode[i]] = tempsMinWork
              } else {
                if (k === 0 && tempsPass[k] === tempsPass[k + 1]) {
                  tempsMaxWork[this.todayDate[j]] = tempsPass[k + 1]
                  tempsMinWork[this.todayDate[j]] = '-'
                } else {
                  tempsMaxWork[this.todayDate[j]] = tempsPass[k + 1]
                  tempsMinWork[this.todayDate[j]] = tempsPass[k]
                }
                this.tempsMax[this.areaCode[i]] = tempsMaxWork
                this.tempsMin[this.areaCode[i]] = tempsMinWork
              }
            }
          }
        }
      } catch (err) {
        console.error('天気取得失敗:', err)
      }
    },

    //クリアメソッド
    clearSerchInfo() {
      this.weatherInfo.searchName = ''
      this.weatherInfo.searchInfo = ''
      this.weatherInfo.weatherDetails = ''
      this.weatherInfo.searchId = ''
      this.serchResult = ''
      this.serchResultWeek = ''
      this.todayWeatherIcon = ''
    },
  },
})
