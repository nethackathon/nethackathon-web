const { DateTime } = require("luxon");
const schedule = {"streamers":[{"username":"hackemslashem","start_time":"1650049200000"},{"username":"AntiGulp","start_time":"1650056400000"},{"username":"Cloudmillion","start_time":"1650063600000"},{"username":"spazm9000","start_time":"1650070800000"},{"username":"luxidream","start_time":"1650078000000"},{"username":"Andrio_Celos","start_time":"1650085200000"},{"username":"PeteGoz","start_time":"1650092400000"},{"username":"ashpooljohn","start_time":"1650099600000"},{"username":"lidlraccoon","start_time":"1650106800000"},{"username":"AmericanElm","start_time":"1650114000000"},{"username":"nethackathon","start_time":"1650121200000", "title":"Race to Sokoban prize and Mine's End luckstone, Open."},{"username":"Theyflower","start_time":"1650128400000"},{"username":"kougyoku_gentou","start_time":"1650135600000"},{"username":"shadowrider38","start_time":"1650139200000"},{"username":"HakureiDeity","start_time":"1650150000000"},{"username":"Priestess_of_Athe","start_time":"1650157200000"},{"username":"JJvanTheMan","start_time":"1650164400000"},{"username":"Krump_O","start_time":"1650171600000"},{"username":"aoeixsz4","start_time":"1650178800000"},{"username":"toddrafter","start_time":"1650186000000"},{"username":"KitsukoKi","start_time":"1650193200000"},{"username":"finitelycraig","start_time":"1650200400000"},{"username":"l__e__w","start_time":"1650207600000"},{"username":"nethackathon","start_time":"1650214800000", "title":"Race to Sokoban prize and Mine's End luckstone, Finals!"},{"username":"d_i_s_p_e_r_s_e","start_time":"1650222000000"}]}

let output = ''
schedule.streamers.forEach((streamer) =>
    output += `
<tr>\n
  <td>${DateTime.fromMillis(parseInt(streamer.start_time)).setZone('utc').toLocaleString(DateTime.DATE_SHORT)}</td>\n
  <td>${DateTime.fromMillis(parseInt(streamer.start_time)).setZone('utc').toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET)}</td>\n
  <td><a href="https://twitch.tv/${streamer.username}">${streamer.username}</a></td>\n
</tr>\n`
)
console.log(output)
