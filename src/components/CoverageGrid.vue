<template>
  <div>
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
            Coverage
          </th>
        </tr>
        </thead>
        <tbody v-for="day in daysInLocal" :key="day.start.toMillis()">
        <tr>
          <td colspan="4" class="dateHeader">{{formattedDay(day.start)}}</td>
        </tr>
        <tr
            :class="{covered: coverageForSlot(s).length > 0}"
            v-for="s in slotsOnDay(day)"
            :key="s.start.toMillis()">
          <td></td>
          <td>{{ formattedStart(s.start) }} - {{ formattedStart(s.end) }}</td>
          <td :class="{uncovered: coverageForSlot(s).length === 0}">
            {{ coverageForSlot(s).join(", ") }}
            <v-icon v-if="coverageForSlot(s).length > 0" color="green">mdi-check-circle</v-icon>
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

    props: ['startDate', 'endDate', 'coverage'],

    data: () => ({
    }),

    created: function() {
      let startDate = DateTime.fromISO(this.startDate).toLocal()
      let endDate = DateTime.fromISO(this.endDate).toLocal()
      this.slots = Interval.fromDateTimes(
          DateTime.fromObject({year: startDate.year, month: startDate.month, day: startDate.day, hour: startDate.hour}),
          DateTime.fromObject({year: endDate.year, month: endDate.month, day: endDate.day, hour: endDate.hour}))
          .splitBy({minutes: 30})
    },

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
      },
    },

    methods: {
      formattedDay(day) {
        return day.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      },
      formattedStart(start) {
        return DateTime.fromISO(start).toLocaleString(DateTime.TIME_SIMPLE)
      },
      slotsOnDay(d) {
        if (this.slots === undefined) return []
        return this.slots.filter(s => d.contains(DateTime.fromISO(s.start).toLocal()))
      },
      coverageForSlot(s) {
        if (!Object.prototype.hasOwnProperty.call(this.coverage, s.start.ts)) return []
        
        return this.coverage[s.start.ts]
      }
    },
  }
</script>

<style>
  .covered {
    background-color: rgba(234, 63, 247, 0.5) !important;
    cursor: pointer;
  }

  .dateHeader {
    background-color: rgba(148, 152, 248, 0.5);
    font-weight: bolder;
  }

  .uncovered {
    color: #656565;
  }
</style>
