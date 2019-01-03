<template>
  <div class="container">
    <div class="container__left">
      <el-input placeholder="Please input"
                prefix-icon="el-icon-search"
                size="large"
                v-model="input"
                @change="search">
      </el-input>
      <el-card>
        <i class="el-icon-zoom-in"
           @click="zoom++"></i>
        <el-slider v-model="zoom"
                   vertical
                   height="100px"
                   :max="18"
                   :min="3">
        </el-slider>
        <i class="el-icon-zoom-out"
           @click="zoom--"></i>
      </el-card>
      <el-date-picker v-model="dateRange"
                      type="datetimerange"
                      :picker-options="pickerOptions"
                      range-separator="To"
                      start-placeholder="Start date"
                      end-placeholder="End date"
                      align="right"
                      @change="dateChanged">
      </el-date-picker>
      <div class="map"
           :class="{ open: searched }">
        <l-map :zoom="zoom"
               :options="{ zoomControl: false, attributionControl: false }"
               :center="center">
          <l-tile-layer :url="url"></l-tile-layer>
          <l-marker v-for="position in positions"
                    :key="position.DiseaseHistory.id"
                    :title="position.DiseaseHistory.disease"
                    :lat-lng="toGeo(position.DiseaseHistory.geo)">
            <l-tooltip :content="position.DiseaseHistory.disease"></l-tooltip>
          </l-marker>
        </l-map>
      </div>
      <iframe :src="`${page}.html`"
              :class="{ open: searched }"></iframe>
    </div>
    <div class="container__right">
      <div class="logos">
        <img class="logo"
             src="polaris.png">
        <img class="logo"
             src="asterix.png">
      </div>
      <div class="disease"
           v-show="ranking">
        <el-table :data="diseases">
          <el-table-column type="index"
                           label="#">
          </el-table-column>
          <el-table-column prop="disease"
                           label="Disease"
                           width="140">
          </el-table-column>
          <el-table-column prop="cnt"
                           label="Count">
          </el-table-column>
        </el-table>
        <div class="ratebar">
          <el-progress v-for="disease in diseases"
                       :key="disease.disease"
                       :percentage="disease.rate">
          </el-progress>
        </div>
      </div>
      <div class="tweets">
        <transition-group name="list"
                          tag="p">
          <tweet-item v-for="tweet in tweets"
                      :key="tweet.DiseaseTweets.id"
                      v-bind="tweet.DiseaseTweets">
          </tweet-item>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import TweetItem from '@/components/TweetItem.vue'
import DiseaseCount from '@/components/DiseaseCount.vue'
import api from '../common/api'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    TweetItem,
    DiseaseCount
  },
  data() {
    return {
      page: '',
      searched: false,
      ranking: false,
      input: '',
      zoom: 5,
      center: L.latLng(40.27415608072979, -97.31515602499938),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      marker: L.latLng(40.27415608072979, -97.31515602499938),
      dateRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: 'Last week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last year',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      diseases: [],
      tweets: [],
      diseaseHistory: [],
      positions: []
    }
  },
  async mounted() {
    api.init()
    // let statement = `select disease, count(*) as cnt
    //     from DiseaseHistory
    //     where to_bigint(timestamp) >= ${Date.parse(this.dateRange[0])}
    //     and
    //     to_bigint(timestamp) < ${Date.parse(this.dateRange[1])}
    //     group by disease
    //     order by cnt desc;`
    // let data = await api.query(statement)
    // this.diseases = data.data.results
    let statement = `select *
        from DiseaseTweets
        where
        id > 1029200000000000000
        order by id desc
        limit 100`
    let data = await api.query(statement)
    this.tweets = data.data.results
    const ins = this
    !(function loop() {
      const rand = Math.round(Math.random() * (1500 - 200)) + 200
      setTimeout(async () => {
        let statement = `select *
        from DiseaseTweets
        where
        id > 1029200000000000000
        order by id desc
        limit 1;`
        const { data } = await api.query(statement)
        if (
          !!!ins.tweets.find(
            tweet => tweet.DiseaseTweets.id === data.results[0].DiseaseTweets.id
          )
        )
          ins.tweets.unshift(data.results[0])
        loop()
      }, rand)
    })()
  },
  methods: {
    async search(e) {
      if (!this.input) return
      // let statement = `select * from DiseaseTweets,
      //   (select dh.id
      //   from DiseaseHistory dh
      //   where dh.disease="${this.input}"
      //   ) as t
      //   where DiseaseTweets.id=t.id limit 100;`
      // let data = await api.query(statement)
      // this.tweets = data.data.results
      let statement = `select *
        from DiseaseHistory
        where geo is not null
        and disease="${this.input}";`
      let data = await api.query(statement)
      this.positions = data.data.results
      this.searched = true
      this.page = this.input
    },
    toGeo(geoString) {
      return JSON.parse(geoString.replace(/'/gi, `"`)).coordinates
    },
    async dateChanged(e) {
      this.ranking = true
      console.log(Date.parse(this.dateRange[0]))
      console.log(Date.parse(this.dateRange[1]))
      // let statement = `select *
      //   from DiseaseTweets
      //   where to_bigint(timestamp_ms) >= ${Date.parse(
      //     this.dateRange[0]
      //   )} and lang="en"
      //   and
      //   to_bigint(timestamp_ms) < ${Date.parse(this.dateRange[1])}
      //   limit 100;`
      // let data = await api.query(statement)
      // this.tweets = data.data.results
      let statement = `select * from DiseaseHistory where geo is not null
        and to_bigint(timestamp) >= ${Date.parse(this.dateRange[0])}
        and to_bigint(timestamp) < ${Date.parse(this.dateRange[1])};`
      let data = await api.query(statement)
      this.positions = data.data.results
      statement = `select disease, count(*) as cnt
        from DiseaseHistory
        where to_bigint(timestamp) >= ${Date.parse(this.dateRange[0])}
        and
        to_bigint(timestamp) < ${Date.parse(this.dateRange[1])}
        group by disease
        order by cnt desc;`
      data = await api.query(statement)
      this.diseases = data.data.results
      const max = this.diseases
        .map(disease => disease.cnt)
        .reduce((a, b) => a + b, 0)
      this.diseases = this.diseases.map(disease => ({
        ...disease,
        rate: Math.round(disease.cnt / max * 10000) / 100
      }))
    }
  }
}
</script>

<style lang="scss">
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  min-height: 100vh;
  min-width: 100vw;
  overflow: hidden;
  &__left {
    position: relative;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    .el-input {
      z-index: 1;
      position: absolute;
      top: 16px;
      left: 16px;
      width: 400px;
      box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.24),
        0px 0px 2px rgba(0, 0, 0, 0.12);
      &__icon::before {
        color: black;
      }
    }
    .el-date-editor {
      position: absolute;
      z-index: 1;
      top: 16px;
      right: 72px;
      box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.24),
        0px 0px 2px rgba(0, 0, 0, 0.12);
    }
    .el-card {
      position: absolute;
      z-index: 1;
      top: 16px;
      right: 16px;
      &__body {
        padding-left: 1px;
        padding-right: 1px;
        padding-top: 0px;
        padding-bottom: 0px;
        display: flex;
        flex-direction: column;
        i {
          display: flex;
          width: 40px;
          height: 40px;
          justify-content: center;
          cursor: pointer;
          &::before {
            align-self: center;
          }
          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
    .map {
      position: absolute;
      width: 100%;
      background-color: red;
      min-height: 50vh;
      max-height: 100vh;
      height: 100vh;
      transition: height 1s;
      &.open {
        height: 50vh;
      }
      .vue2leaflet-map {
        position: absolute;
        z-index: 0;
      }
    }
    iframe {
      position: absolute;
      top: 100vh;
      width: 100%;
      background-color: green;
      height: 50vh;
      transition: top 1s;
      border: 0px solid;
      &.open {
        top: 50vh;
      }
    }
  }
  &__right {
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    .logos {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      .logo {
        padding: 25px;
        max-width: 50%;
      }
    }
    .disease {
      padding: 6px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      td[class*='el-table'] {
        padding: 0px 0px;
      }
      .el-table {
        display: inline-block;
        width: 50%;
      }
      .ratebar {
        display: inline-block;
        width: 45%;
        height: 100%;
        padding-bottom: 4px;
        .el-progress-bar__outer {
          margin: 9.4px 0px;
          background-color: white;
        }
      }
    }
    .tweets {
      flex: 1;
      overflow-y: scroll;
    }
  }
}
</style>
