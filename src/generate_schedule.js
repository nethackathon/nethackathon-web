import {DateTime} from "luxon";
import schedule from "./data/schedule"

let output = ''
schedule.forEach((streamer) =>
    output += `
<tr>\n
  <td>${DateTime.fromISO(streamer.starting).setZone('utc').toLocaleString(DateTime.DATE_SHORT)}</td>\n
  <td>${DateTime.fromISO(streamer.starting).setZone('utc').toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET)}</td>\n
  <td><a href="https://twitch.tv/${streamer.channel}">${streamer.channel}</a></td>\n
</tr>\n`
)
console.log(output)
