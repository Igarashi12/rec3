<script setup>
import { ref, computed } from 'vue'
import { useWeatherInfo } from '../stores/weather'

// stateとgetterを参照
const store = useWeatherInfo()
const weatherInfo = computed(() => store.weatherInfo)
const serchResult = computed(() => store.serchResult)
const serchResultWeek = computed(() => store.serchResultWeek)
const todayDate = computed(() => store.todayDate)
const weekDate = computed(() => store.weekDate)

const searchArea = () => {
  store.searchArea()
}

const clearSerchInfo = () => {
  store.clearSerchInfo()
}

</script>

<template>
  <div id="app">
    <v-app>
      <v-main>
        <v-container>
          <v-row class="text-h3 mb-3 mt-3" justify="center">
            気象情報
          </v-row>
          <v-row class="mb-3 mt-3" align="center" justify="center">
            <v-col cols="6">
              <v-text-field clearable class="ml-6 mr-6" v-model="weatherInfo.searchName" label="都道府県名を入力"
                placeholder="都道府県名を入力…" variant="underlined"></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mb-3 mt-3" justify="center">
            <v-btn rounded variant="tonal" @click="searchArea">
              検索
            </v-btn>
            <v-btn rounded variant="tonal" @click="clearSerchInfo">
              クリア
            </v-btn>
          </v-row>



          <v-row class="mb-3 mt-3" justify="center">
            <h1>{{ weatherInfo.searchInfo.targetArea }}</h1>
          </v-row>

          <v-row class="mb-3 mt-3" justify="left" v-for="(weatherDetailsArea, i) in serchResult">
            <ul>
              <li>
                <h2>{{ weatherDetailsArea.area.name }}<br></h2>
                <v-row class="mb-3 mt-3" justify="left" v-for="(todayDate, j) in todayDate">
                  {{ todayDate }}
                  <p>{{ weatherDetailsArea.weathers[j] }}</p>

                  <br>
                </v-row>
              </li>
            </ul>
          </v-row>

        </v-container>
      </v-main>
    </v-app>
  </div>
</template>