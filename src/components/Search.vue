<script setup>
import { computed } from 'vue'
import { useWeatherInfo } from '../stores/weather'

// stateとgetterを参照
const store = useWeatherInfo()
const weatherInfo = computed(() => store.weatherInfo)
const getIcon = computed(() => store.getIcon)

const searchArea = () => {
  store.searchArea()
}

const clearSerchInfo = () => {
  store.clearSerchInfo()
}


const rules = {
  required: value => !!value || 'Required.',
  counter: value => value.length <= 20 || 'Max 20 characters',
}
</script>

<template>
  <div id="app">
    <v-container>
      <v-row class="text-h3 mb-3 mt-3" justify="center">
        <img :src=getIcon style="  font-family: 'Sawarabi Gothic';">
        気象情報
        <img :src=getIcon>
      </v-row>
      <v-row class="mb-3 mt-3" align="center" justify="center">
        <v-col cols="6">
          <v-text-field clearable v-model="weatherInfo.searchName" :rules="[rules.required, rules.counter]"
            label="都道府県名を入力" placeholder="都道府県名を入力…" variant="underlined"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-btn rounded variant="tonal" class="btn" @click="searchArea">
          検索
        </v-btn>
        <v-btn rounded variant="outlined" class="btn" @click="clearSerchInfo">
          クリア
        </v-btn>

      </v-row>
      <v-row class="mb-3 mt-3" justify="center">
        <h1>{{ weatherInfo.searchInfo.targetArea }}</h1>
      </v-row>
    </v-container>
  </div>
</template>
