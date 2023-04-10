<template>
  <div>
    <h1>Availability <span style="font-size: small;">All times {{localTimeZone}}</span></h1>
    <p>Please mark ALL times that you are available.</p>
    <p><em>You are only committing to one 2-hour time slot during the marathon.</em></p>
    <p>Click or click-and-drag to mark or unmark time slots.</p>
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
            Click if available
          </th>
          <!--th class="text-left">
            Notes
            TODO
          </th-->
        </tr>
        </thead>
        <tbody v-for="day in daysInLocal" :key="day.start.toMillis()">
        <tr>
          <td colspan="4" class="dateHeader">{{formattedDay(day.start)}}</td>
        </tr>
        <tr
            :class="{streaming: (s.available === 1), preferred: (s.available === 2)}"
            @mouseover="makeAvailable(s, $event)"
            @mousedown="makeAvailable(s, $event)"
            v-for="s in slotsOnDay(day)"
            :key="s.start.toMillis()">
          <td></td>
          <td>{{ formattedStart(s.start) }} - {{ formattedStart(s.end) }}</td>
          <td :class="{unavailable: s.available === 0}">
            {{ (s.available === 2) ? 'Preferred' : (s.available === 1) ? 'Available' : 'Unavailable' }}
            <v-icon v-if="s.available === 1" color="green">mdi-check-circle</v-icon>
            <v-icon v-if="s.available === 2" color="yellow">mdi-star</v-icon>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
  import {DateTime, Interval} from "luxon";

  export default {
    name: 'TimeGrid',

    components: {
    },

    props: ['startDate', 'endDate', 'schedule'],

    data: () => ({
    }),

    created: function() {
      let startDate = DateTime.fromISO(this.startDate).toLocal()
      let endDate = DateTime.fromISO(this.endDate).toLocal()
      this.slots = Interval.fromDateTimes(
          DateTime.fromObject({year: startDate.year, month: startDate.month, day: startDate.day, hour: startDate.hour}),
          DateTime.fromObject({year: endDate.year, month: endDate.month, day: endDate.day, hour: endDate.hour}))
          .splitBy({minutes: 30})
          // .map((s) => {s.available = false; return s})
    },

    computed: {
      slotsWithSchedule: function () {
        return this.slots.map((s) => {
          s.available = (Object.prototype.hasOwnProperty.call(this.schedule, s.start.ts)) ? this.schedule[s.start.ts] : 0;
          return s;
        })
      },
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
      },
    },

    methods: {
      makeAvailable(s, evt) {
        if (evt.buttons === 1) {
          // s.available = !s.available
          this.$emit('scheduleSlot', s)
          evt.preventDefault()
        }
      },
      formattedDay(day) {
        return day.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      },
      formattedStart(start) {
        return DateTime.fromISO(start).toLocaleString(DateTime.TIME_SIMPLE)
      },
      slotsOnDay(d) {
        if (this.slots === undefined) return []
        return this.slotsWithSchedule.filter(s => d.contains(DateTime.fromISO(s.start).toLocal()))
      },
    },
  }
</script>

<style>
  .streaming {
    background-color: rgba(234, 63, 247, 0.5) !important;
    cursor: pointer;
  }

  .preferred {
    background-color: rgba(234, 63, 247, 0.6) !important;
    cursor: pointer;
  }

  .dateHeader {
    background-color: rgba(148, 152, 248, 0.5);
    font-weight: bolder;
  }

  .unavailable {
    color: #656565;
  }
</style>
