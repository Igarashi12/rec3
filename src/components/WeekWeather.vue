<script setup>

import { computed } from 'vue'
import { useWeatherInfo } from '../stores/weather'

// stateとgetterを参照
const store = useWeatherInfo()
const serchResultWeek = computed(() => store.serchResultWeek)
const weekDate = computed(() => store.weekDate)
const weekWeatherIcon = computed(() => store.weekWeatherIcon)
const tempsMax = computed(() => store.tempsMax)
const tempsMin = computed(() => store.tempsMin)
const areaCode = computed(() => store.weekAreaCode)
</script>

<template>

    <div id="app">
        <v-app>
            <v-main>
                <v-container>
                    <div class="mb-3 mt-3 pa-3" justify="center" v-for="(weatherDetailsArea, i) in serchResultWeek">
                        <ul>
                            <li>
                                <v-row class=" weatherInfo">
                                    <v-col class="areaName d-flex align-center " cols="1">{{
                                        weatherDetailsArea.area.name
                                    }}
                                    </v-col>
                                    <v-col>
                                        <v-row>
                                            <v-col class=" ma-1  card" v-for="(weekDate, j) in weekDate">
                                                <v-row class="date d-flex align-center ">
                                                    {{ weekDate }}
                                                </v-row>
                                                <v-row
                                                    class="d-flex align-center justify-center bg-light-blue-lighten-5">
                                                    <img :src=weekWeatherIcon[i][j]>
                                                </v-row>
                                                <v-row class=" temps d-flex align-center justify-center">
                                                    <span style=" color: blue;">{{
                                                        tempsMin[areaCode[i]][weekDate] }}</span>/<span
                                                        style="color: red;">{{
                                                            tempsMax[areaCode[i]][weekDate] }}</span>
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