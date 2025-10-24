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

                    <v-row class="mb-3 mt-3" justify="left">
                        <h1>--------------週間予報--------------</h1>
                    </v-row>

                    <v-row class="mb-3 mt-3" justify="left" v-for="(weatherDetailsArea, i, j) in serchResultWeek">
                        <ul>
                            <li>
                                <h2>{{ weatherDetailsArea.area.name }}<br></h2>
                                <v-row class="mb-3 mt-3" justify="left">
                                    <p v-for="(weekDate) in weekDate">{{ weekDate }}<br>
                                    <p>{{ weatherDetailsArea.weatherCodes[0] }}<br></p></br></p>
                                    <!-- <p>{{ weatherDetailsArea.weathers[j] }}</p> -->

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