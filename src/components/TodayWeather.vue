<script setup>
import { computed } from 'vue'
import { useWeatherInfo } from '../stores/weather'

// stateとgetterを参照
const store = useWeatherInfo()
const weatherInfo = computed(() => store.weatherInfo)
const serchResult = computed(() => store.serchResult)
const todayDate = computed(() => store.todayDate)
const todayWeatherIcon = computed(() => store.todayWeatherIcon)
const tempsMax = computed(() => store.tempsMax)
const tempsMin = computed(() => store.tempsMin)
const areaCode = computed(() => store.areaCode)
</script>

<template>
  <div id="app" class="today">
    <v-app>
      <v-main>
        <v-container>
          <div class="mb-3 mt-3" v-for="(weatherDetailsArea, i) in serchResult">
            <ul>
              <li>
                <v-row class="mb-3 mt-3 ">
                  <v-col cols="1" class="areaName d-flex align-center ">
                    <h2>{{ weatherDetailsArea.area.name }}</h2>
                  </v-col>
                  <v-col>
                    <v-row>
                      <v-col class="ma-1 weatherInfo card" v-for="(todayDate, j) in todayDate">
                        <v-row class="date justify-center">
                          {{ todayDate }}
                        </v-row>
                        <v-row>
                          <v-col class="bg-light-blue-lighten-4">
                            <img class="weatherIcon " :src=todayWeatherIcon[i][j]>
                          </v-col>
                          <v-col class="bg-green-lighten-4 temps">
                            <span style=" color: blue;">{{
                              tempsMin[areaCode[i]][todayDate]
                            }}</span>/<span style="color: red;">{{
                                tempsMax[areaCode[i]][todayDate] }}</span>
                          </v-col>
                        </v-row>
                        <v-row class="weathers">
                          <p>{{ weatherDetailsArea.weathers[j] }}</p>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </li>
            </ul>
          </div>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
