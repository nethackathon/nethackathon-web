<template>
  <div>
    <h1>Schedule</h1>
    <v-simple-table>
      <template v-slot:default>
        <thead>
        <tr>
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
          <td colspan="3" class="dateHeader">{{formattedDay(d.start)}}</td>
        </tr>
        <tr
            v-for="s in streamersOnDay(d)"
            :class="{'streaming': isStreaming(s)}"
            :key="s.starting">
          <td>{{ formattedStart(s.starting) }}</td>
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

    props: ['schedule', 'startDate', 'endDate'],

    computed: {
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
      formattedDay(day) {
        return day.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      },
      formattedStart(start) {
        return DateTime.fromISO(start).toLocaleString(DateTime.TIME_SIMPLE)
      },
      streamersOnDay(day) {
        return this.schedule.filter(s => day.contains(DateTime.fromISO(s.starting).toLocal()))
      },
      isStreaming(streamer) {
        let streamerStarting = DateTime.fromISO(streamer.starting)
        let streamerSlot = Interval.fromDateTimes(streamerStarting, streamerStarting.plus({ hours: streamer.duration }))
        // For testing: return streamerSlot.contains(DateTime.fromISO("2021-09-10T17:01:00Z"))
        return streamerSlot.contains(DateTime.now())
      }
    },
  }
</script>

<style>
  .streaming {
    background-color: rgba(234, 63, 247, 0.5);
  }

  .dateHeader {
    background-color: rgba(148, 152, 248, 0.5);
    font-weight: bolder;
  }
</style>
