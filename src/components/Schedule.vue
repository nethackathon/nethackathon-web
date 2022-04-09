<template>
  <div>
    <h1>Schedule <span style="font-size: small;">All times {{localTimeZone}}</span></h1>
    <v-simple-table>
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-left">
          </th>
          <th class="text-left">
            Date
          </th>
          <th class="text-left">
            Channel
          </th>
          <th class="text-left">
            Notes
          </th>
        </tr>
        </thead>
        <tbody v-for="d in daysInLocal" :key="d.start.toMillis()">
        <tr>
          <td colspan="4" class="dateHeader">{{formattedDay(d.start)}}</td>
        </tr>
        <tr
            @click="openTwitch"
            v-for="s in streamersOnDay(d)"
            :class="{'streaming': (currentlyStreaming && currentlyStreaming.starting === s.starting)}"
            :key="s.starting">
          <td><v-icon v-if="currentlyStreaming && currentlyStreaming.starting === s.starting">mdi-twitch</v-icon></td>
          <td>{{ formattedStart(s.start_time) }}</td>
          <td><Streamer :streamer="s"/></td>
          <td><span v-if="s.title">{{ s.title }}</span></td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
  import {DateTime, Interval} from "luxon";
  import Streamer from "./Streamer";

  export default {
    name: 'Schedule',

    components: {
      Streamer
    },

    props: ['schedule', 'startDate', 'endDate', 'currentlyStreaming'],

    computed: {
      localTimeZone: function () {
        return DateTime.local().offsetNameShort
      },
      daysInLocal: function () {
        let startDate = DateTime.fromISO(this.startDate).toLocal()
        let endDate = DateTime.fromISO(this.endDate).toLocal()
        let dayIntervals = Interval.fromDateTimes(
            DateTime.fromObject({year: startDate.year, month: startDate.month, day: startDate.day}),
            DateTime.fromObject({year: endDate.year, month: endDate.month, day: endDate.day + 1}))
            .splitBy({days: 1})
        return dayIntervals
      }
    },

    methods: {
      openTwitch() {
        if (!this.currentlyStreaming || !this.currentlyStreaming.channel) return
        let url = "https://twitch.tv/" + this.currentlyStreaming.channel
        window.open(url, '_blank').focus()
      },
      formattedDay(day) {
        return day.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      },
      formattedStart(start) {
        return DateTime.fromMillis(parseInt(start)).toLocaleString(DateTime.TIME_SIMPLE)
      },
      streamersOnDay(day) {
        return this.schedule.streamers.filter(s => day.contains(DateTime.fromMillis(parseInt(s.start_time)).toLocal()))
      },
    },
  }
</script>

<style>
  .streaming {
    background-color: rgba(234, 63, 247, 0.5) !important;
    cursor: pointer;
  }

  .dateHeader {
    background-color: rgba(148, 152, 248, 0.5);
    font-weight: bolder;
  }
</style>
