<template>
  <div id="sokoban" :class="{'invert':!this.$vuetify.theme.dark}">
    <h1>Sokoban Level {{ (this.curLevel + 1) + ((this.curSubLevel === 0) ? 'a' : 'b')}}</h1>
    <div>
      <span>{{(message === ' ') ? '&nbsp;' : message}}</span>
      <span class="ml-4">Turns: {{ curTurns }}</span>
      <span class="ml-4">Time: {{ timeElapsed }}s</span>
    </div>
    <NHPlaybackControls
        v-if="replaying"
        :dark-mode="this.$vuetify.theme.dark"
        :speedMultiplier="replayControls.speedMultiplier"
        :maxMultiplier="replayControls.speedMultipliers[replayControls.speedMultipliers.length - 1]"
        :minMultiplier="replayControls.speedMultipliers[0]"
        @play="replayControls.speedMultiplier = 1"
        @stop="replayControls.speedMultiplier = 0"
        @faster="replayFaster"
        @slower="replaySlower"
        @exitReplay="loadMap"
        :status="replayStatus"
    />
    <Map
        :sokoMap="sokoMap"
        :dark-mode="this.$vuetify.theme.dark"
        :boulder-char="'0'"
    />
    <div class="mb-4">Push R to restart.</div>
    <div>
      <div class="inline">
        <h3>Options</h3>
        <div>
          <NHCheckbox
              @clicked="flipHorizontally = !flipHorizontally"
              :checked="flipHorizontally"
              label="Flip horizontally"
          />
        </div>
        <div>
          <NHCheckbox
              @clicked="flipVertically = !flipVertically"
              :checked="flipVertically"
              label="Flip vertically"
          />
        </div>
        <div>
          <NHCheckbox
              @clicked="flipRandomly = !flipRandomly"
              :checked="flipRandomly"
              label="Flip randomly"
          />
        </div>
        <div>
          <NHCheckbox
              @clicked="enableHoles = !enableHoles"
              :checked="enableHoles"
              label="Allow travel through holes"
          />
        </div>
      </div>
      <div class="inline">
        <h3>Levels</h3>
        <ul>
          <li v-for="level in levelListing" v-bind:key="level.name"><span class="nh-clickable" @click="changeLevel(level)">{{level.name}}</span></li>
        </ul>
      </div>
      <div class="inline">
        <h3>High Scores</h3>
        <NHHighScores
            :games="filteredMyGames"
            :best-times="bestTime"
            :best-turns="bestTurns"
            :logged-in="loggedIn"
            @replayGame="replayGame"
            @logIn="$emit('logIn')"
            :dark-mode="this.$vuetify.theme.dark"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Map from './components/Map.vue'
import maps from './maps/maps'
import NHCheckbox from '../NHCheckbox'
import NHHighScores from "../NHHighScores";
import NHPlaybackControls from "../NHPlaybackControls";
import { updateSokoban, getBestTime, getBestTurns } from "../../services/annotate.online.service"

export default {
  name: 'Sokoban',
  props: {
    loggedIn: Boolean,
    loggingIn: Boolean,
  },
  components: {
    NHPlaybackControls,
    NHHighScores,
    Map,
    NHCheckbox,
  },
  created () {
    window.addEventListener('keydown', this.keyboardEvent)
    const mg = localStorage.getItem('myGames')
    this.myGames = (mg === null) ? [] : JSON.parse(mg)
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyboardEvent)
  },
  mounted () {
    this.loadOptions()
    this.curLevel = Math.floor(Math.random() * maps.length)
    this.curSubLevel = Math.floor(Math.random() * maps[this.curLevel].length)
    this.loadMap()
  },
  data () {
    return {
      won: false,
      curTurns: 0,
      travelling: false,
      replaying: false,
      travelMode: false,
      travelPosition: {x: -1, y: -1},
      message: ' ',
      travelPath: [],
      calcDistanceArray: [],
      timerInterval: null,
      timerStarted: false,
      timeStarted: 0,
      timeElapsed: 0,
      moveTo: false,
      pushBoulder: false,
      mapString: '',
      curLevel: 0,
      curSubLevel: 0,
      flipHorizontally: false,
      fh: false, // Tracking flipping horizontally as done by random separately
      flipVertically: false,
      fv: false, // Tracking flipping vertically as done by random separately
      flipRandomly: false,
      enableHoles: false,
      sokoMap: [],
      playerPosition: {x: -1, y: -1},
      downStairPosition: {x: -1, y: -1},
      turnRecord: [],
      myGames: [],
      bestTurns: [],
      bestTime: [],
      replayControls: {
        timeoutId: undefined,
        path: [],
        pathIndex: 0,
        speed: 200,
        speedMultiplier: 0,
        speedMultipliers: [-10, -5, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 5, 10],
        mapStates: [],
      }
    }
  },
  computed: {
    replayStatus () {
      if (this.replayControls.speedMultiplier === 0) return 'Stopped'
      return `Playing ${this.replayControls.speedMultiplier}X`
    },
    replaySpeed () {
      if (this.replayControls.speedMultiplier === 0) return 0
      return Math.abs(this.replayControls.speed / this.replayControls.speedMultiplier)
    },
    filteredMyGames () {
      return this.myGames
        .filter((g) => (g.soko_level === this.curLevel && g.soko_sublevel === this.curSubLevel))
        .map((g, i) => {
          return {
            id: 'local_' + i,
            player: 'You',
            time_seconds: g.time_seconds,
            turn_count: g.soko_path.length,
            soko_path: g.soko_path,
          }
        })
    },
    levelListing () {
      const listing = []
      for (let i = 0; i < maps.length; i++) {
        for (let j = 0; j < maps[i].length; j++) {
          listing.push({
            name: 'Level ' + (i + 1) + ((j === 0) ? 'a' : 'b'),
            level: i,
            subLevel: j
          })
        }
      }
      return listing
    }
  },
  methods: {
    replaySlower () {
      let curIndex = this.replayControls.speedMultipliers.indexOf(this.replayControls.speedMultiplier)
      curIndex--
      curIndex = Math.max(0, curIndex)
      this.replayControls.speedMultiplier = this.replayControls.speedMultipliers[curIndex]
    },
    replayFaster () {
      let curIndex = this.replayControls.speedMultipliers.indexOf(this.replayControls.speedMultiplier)
      curIndex++
      curIndex = Math.min((this.replayControls.speedMultipliers.length - 1), curIndex)
      this.replayControls.speedMultiplier = this.replayControls.speedMultipliers[curIndex]
    },
    loadOptions () {
      if (localStorage.getItem('flipHorizontally') !== null) {
        this.flipHorizontally = (localStorage.getItem('flipHorizontally') === 'true')
      }
      if (localStorage.getItem('flipVertically') !== null) {
        this.flipVertically = (localStorage.getItem('flipVertically') === 'true')
      }
      if (localStorage.getItem('flipRandomly') !== null) {
        this.flipRandomly = (localStorage.getItem('flipRandomly') === 'true')
      }
      if (localStorage.getItem('enableHoles') !== null) {
        this.enableHoles = (localStorage.getItem('enableHoles') === 'true')
      }
    },
    changeLevel (levelObject) {
      this.curLevel = levelObject.level
      this.curSubLevel = levelObject.subLevel
      this.loadMap()
    },
    updateScores () {
      // update scores
      getBestTime(this.curLevel, this.curSubLevel).then((res) => {
        this.bestTime = res.data
        this.bestTime.map((record) => {
          record.soko_path = JSON.parse(record.soko_path)
        })
      })
      getBestTurns(this.curLevel, this.curSubLevel).then((res) => {
        this.bestTurns = res.data
        this.bestTurns.map((record) => {
          record.soko_path = JSON.parse(record.soko_path)
        })
      })
    },
    loadMap () {
      this.won = false
      this.updateScores()
      // reset playback
      this.replayControls.path = []
      this.replayControls.pathIndex = 0
      this.replayControls.mapStates = []
      this.replayControls.speedMultiplier = 0

      // reset timer
      this.timeElapsed = 0
      this.curTurns = 0
      this.replaying = false
      this.timerStarted = false
      this.travelPath = []
      this.message = 'Press any key to start timer.'
      this.turnRecord = []
      clearInterval(this.timerInterval)
      this.curTurns = 0
      // reset win state
      let m = maps[this.curLevel][this.curSubLevel].slice()
      if (this.flipRandomly) {
        this.fh = Math.random() < 0.5
        this.fv = Math.random() < 0.5
      }
      if (this.fh) {
        m = m.map((row) => row.split('').reverse().join(''))
      }
      if (this.fv) {
        m = m.reverse()
      }
      this.sokoMap = []
      for (let y = 0; y < m.length; y++) {
        let row = []
        for (let x = 0; x < m[y].length; x++) {
          if (m[y][x] === '>') this.downStairPosition = {x, y}
          row.push({
            id: `${y}-${x}`,
            character: (m[y][x] !== '0') ? m[y][x] : '.',
            highlight: false,
            player: false,
            boulder: (m[y][x] === '0'),
            distance: undefined,
            visited: false
          })
        }
        this.sokoMap.push(row)
      }
      this.playerPosition = this.getPlayerPosition(m)
      // this.travelPath.push(this.playerPosition)
      this.sokoMap[this.playerPosition.y][this.playerPosition.x].player = true
      this.sokoMap[this.playerPosition.y][this.playerPosition.x].highlight = true
    },
    getPlayerPosition (sokoMap) {
      for (let y = 0; y < sokoMap.length; y++) {
        if (sokoMap[y].indexOf('>') > 0) {
          return {x: (sokoMap[y].indexOf('>')), y};
        }
      }
      return {x: -1, y: -1}
    },
    charAt (sokoMap, x, y) {
      return sokoMap[y][x].character
    },
    getMoveTo(evt) {
      return (evt.getModifierState('Control') || evt.getModifierState('Shift') || this.moveTo)
    },
    getPushTo(evt) {
      return evt.getModifierState('Shift')
    },
    limit(pos, limit) {
      let ret = Math.max(pos, 0)
      return Math.min(ret, limit)
    },
    keyboardEvent (evt) {
      // console.log('evt', evt);
      if (this.loggingIn) return
      if (! this.timerStarted) {
        this.timerStarted = true
        this.timeStarted = new Date()
        this.timerInterval = setInterval(() => this.timeElapsed = Math.round((new Date().getTime() - this.timeStarted.getTime()) / 1000), 1000)
      }
      this.message = ' '
      if (evt.key === 'r') this.loadMap();
      if (this.travelling || this.replaying || this.won) return
      // Prevent window from scrolling when using the arrow keys
      // if (evt.key === 'ArrowDown' || evt.key === 'ArrowUp' || evt.key === 'ArrowLeft' ||evt.key === 'ArrowRight') evt.preventDefault();
      if (evt.key === 'm' || evt.key === 'g') this.moveTo = true;
      if (evt.key === 'j' || evt.key === 'J' || evt.key === '2' || evt.key === 'ArrowDown') this.move(0, 1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'k' || evt.key === 'K' || evt.key === '8' || evt.key === 'ArrowUp') this.move(0, -1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'h' || evt.key === 'H' || evt.key === '4' || evt.key === 'ArrowLeft') this.move(-1, 0, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'l' || evt.key === 'L' || evt.key === '6' || evt.key === 'ArrowRight') this.move(1, 0, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'y' || evt.key === 'Y' || evt.key === '7') this.move(-1, -1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'u' || evt.key === 'U' || evt.key === '9') this.move(1, -1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'b' || evt.key === 'B' || evt.key === '1') this.move(-1, 1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'n' || evt.key === 'N' || evt.key === '3') this.move(1, 1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === '_') {
        this.setTravelMode(true)
      }
      if (evt.key === 'Escape') {
        this.setTravelMode(false)
      }
      if (evt.key === '.' && this.travelMode) {
        if (this.travelTo()) {
          this.travel(this.travelPath, 10).then(() => {
            this.travelPath = []
          })
        } else {
          this.message = 'No travel path'
        }
        this.setTravelMode(false)
      }
      evt.preventDefault()
      evt.stopPropagation()
    },
    async travel(path, ms) {
      this.travelling = true
      return new Promise(resolve => {
        let p = path.slice()
        let travelTimer = window.setInterval(() => {
          if (p.length > 0) {
            let pos = p.pop()
            this.movePlayerTo(pos)
          } else {
            window.clearInterval(travelTimer)
            this.travelling = false
            resolve()
          }
        }, ms)
      })
    },
    replay() {
      if (this.replayControls.timeoutId) {
        window.clearTimeout(this.replayControls.timeoutId)
      }
      if (this.replayControls.speedMultiplier !== 0) {
        const turn = this.replayControls.path[this.replayControls.pathIndex]
        this.timeElapsed = Math.round(turn.time / 1000)
        this.curTurns = this.replayControls.pathIndex
        if (this.replayControls.speedMultiplier > 0) {
          if (this.replayControls.pathIndex === 0) {
            // Push initial state
            this.replayControls.mapStates.push(JSON.parse(JSON.stringify(this.sokoMap)))
          }
          let dx = turn.pos.x - this.playerPosition.x
          let dy = turn.pos.y - this.playerPosition.y
          this.move(dx, dy, false, false)
          // Push state after move
          this.replayControls.mapStates.push(JSON.parse(JSON.stringify(this.sokoMap)))
          if (this.replayControls.pathIndex === this.replayControls.path.length - 1) {
            this.replayControls.speedMultiplier = 0
          } else {
            this.replayControls.pathIndex++
          }
        } else {
          if (this.replayControls.mapStates.length > 0) {
            const curState = this.replayControls.mapStates.pop()
            if (this.replayControls.pathIndex > 0) {
              this.replayControls.pathIndex--
            }
            for (let y = 0; y < curState.length; y++) {
              for (let x = 0; x < curState[y].length; x++) {
                this.sokoMap[y][x].character = curState[y][x].character
                if (curState[y][x].player) {
                  this.sokoMap[y][x].player = true
                  this.sokoMap[y][x].highlight = true
                  this.playerPosition.x = x
                  this.playerPosition.y = y
                } else {
                  this.sokoMap[y][x].player = false
                  this.sokoMap[y][x].highlight = false
                }
                this.sokoMap[y][x].boulder = curState[y][x].boulder
              }
            }
          } else {
            this.replayControls.speedMultiplier = 0
          }
        }
      }
      this.replayControls.timeoutId = window.setTimeout(() => {
        this.replay()
      }, ((this.replaySpeed === 0) ? 500 : this.replaySpeed))
    },
    normalizePos(pos) {
      let p = {
        x: pos.x,
        y: pos.y
      }
      if (this.fh) {
        p.x = ((this.sokoMap[0].length - 1) - p.x)
      }
      if (this.fv) {
        p.y = ((this.sokoMap.length - 1) - p.y)
      }
      return p
    },
    movePlayerTo(pos) {
      // record player moves in turnRecord
      if (!this.replaying) {
        this.turnRecord.push({
          time: new Date().getTime() - this.timeStarted.getTime(),
          pos: this.normalizePos(pos)
        })
      }
      this.curTurns++
      let mapPos = this.sokoMap[this.playerPosition.y][this.playerPosition.x]
      mapPos.highlight = false
      mapPos.player = false
      this.playerPosition.x = pos.x
      this.playerPosition.y = pos.y
      mapPos = this.sokoMap[pos.y][pos.x]
      mapPos.highlight = true
      mapPos.player = true
    },
    calcDistance(pos, dist) {
      this.sokoMap[pos.y][pos.x].visited = true
      for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
          if (!this.sokoMap[pos.y + dy][pos.x + dx].visited && this.canTravelTo(pos.x + dx, pos.y + dy, dx, dy)) {
            let travellingTo = this.sokoMap[pos.y + dy][pos.x + dx]
            if (travellingTo.distance === undefined || travellingTo.distance > dist) {
              travellingTo.distance = dist + 1
            }
            this.calcDistanceArray.push({
              pos: {x: (pos.x + dx), y: (pos.y + dy)},
              distance: travellingTo.distance
            })
          }
        }
      }
    },
    getNextTravelSpace(pos) {
      for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
          if (this.sokoMap[pos.y + dy][pos.x + dx].distance === (this.sokoMap[pos.y][pos.x].distance - 1)) {
            return {x: (pos.x + dx), y: (pos.y + dy)}
          }
        }
      }
    },
    travelTo() {
      for (let y = 0; y < this.sokoMap.length; y++) {
        for (let x = 0; x < this.sokoMap[y].length; x++) {
          this.sokoMap[y][x].distance = undefined
          this.sokoMap[y][x].visited = false
        }
      }
      this.sokoMap[this.playerPosition.y][this.playerPosition.x].distance = 0
      this.calcDistanceArray.push({
        pos: this.playerPosition,
        distance: 0
      })
      while(this.calcDistanceArray.length > 0) {
        let nextPos = this.calcDistanceArray.pop()
        this.calcDistance(nextPos.pos, nextPos.distance)
      }
      if (this.sokoMap[this.travelPosition.y][this.travelPosition.x].distance !== undefined) {
        let curPos = {x: this.travelPosition.x, y: this.travelPosition.y }
        this.travelPath.push(curPos)
        while (this.sokoMap[curPos.y][curPos.x].distance > 0) {
          curPos = this.getNextTravelSpace(curPos)
          this.travelPath.push(curPos)
        }
        return true
      }
      return false
    },
    canTravelTo(x, y, dx, dy) {
      // Prevent squeezing through
      if (dx !== 0 && dy !== 0) {
        // if moving diagonal
        if (!this.isPassable((x - dx), y) && !this.isPassable(x, (y - dy))) {
          return false
        }
      } else {
        return this.isPassable(x,y)
      }
    },
    setTravelMode(mode) {
      this.travelMode = mode
      if (this.travelMode) {
        this.message = 'Where do you want to travel to?'
        this.travelPosition.y = this.playerPosition.y
        this.travelPosition.x = this.playerPosition.x
      } else {
        this.message = ' '
      }
      this.sokoMap[this.playerPosition.y][this.playerPosition.x].highlight = !this.travelMode
      this.sokoMap[this.travelPosition.y][this.travelPosition.x].highlight = this.travelMode
    },
    move (x, y, moveTo, pushBoulder) {
      if (this.travelMode) {
        let dx = (pushBoulder) ? x * 8 : x
        let dy = (pushBoulder) ? y * 8 : y
        this.sokoMap[this.travelPosition.y][this.travelPosition.x].highlight = false
        this.travelPosition.x += dx
        this.travelPosition.y += dy
        this.travelPosition.x = this.limit(this.travelPosition.x, this.sokoMap[0].length - 1)
        this.travelPosition.y = this.limit(this.travelPosition.y, this.sokoMap.length - 1)
        this.sokoMap[this.travelPosition.y][this.travelPosition.x].highlight = true
        return
      }
      this.pushBoulder = pushBoulder
      this.moveTo = moveTo
      if (this.canMoveTo(this.playerPosition.x + x, this.playerPosition.y + y, x, y)) {
        this.movePlayerTo({x: this.playerPosition.x + x, y: this.playerPosition.y + y})
        // this.updateMapString()
        // They got to the up stair and completed the level
        if (this.sokoMap[this.playerPosition.y][this.playerPosition.x].character === '<' && !this.replaying) {
          this.wonLevel()
        } else if (this.curLevel > 0 && this.sokoMap[this.playerPosition.y][this.playerPosition.x].character === '^') {
          // player moved onto hole, move them to down stairs
          this.movePlayerTo(this.downStairPosition)
        } else if (moveTo) {
          // repeat same move while possible
          this.move(x,y, this.moveTo, this.pushBoulder)
        }
      } else {
        this.moveTo = false
      }
    },
    isPassable(x, y) {
      const movingTo = this.sokoMap[y][x]
      return (
          !movingTo.boulder &&
          (
              movingTo.character === '.' || movingTo.character === '<' ||
              movingTo.character === '>' || movingTo.character === '+' ||
              (movingTo.character === '^' && this.enableHoles && this.curLevel > 0)
          )
      )
    },
    replayGame (game) {
      this.loadMap()
      // Start in playing state
      this.replayControls.speedMultiplier = 1
      this.replaying = true
      this.message = 'Replaying: '
      let sokoPath = game.soko_path
      this.replayControls.path = sokoPath.map((p) =>
      {
        return { pos: this.normalizePos(p.pos), time: p.time }
      })
      this.replay()
    },
    recordWin () {
      let record = {
        soko_level: this.curLevel,
        soko_sublevel: this.curSubLevel,
        time_seconds: this.timeElapsed,
        turn_count: this.curTurns,
        soko_path: this.turnRecord
      }
      if (this.loggedIn) {
        updateSokoban(record)
        this.updateScores()
      } else {
        this.myGames.push(record)
        localStorage.setItem('myGames', JSON.stringify(this.myGames))
      }
    },
    wonLevel () {
      this.won = true
      this.message = "You completed this level in: "
      clearInterval(this.timerInterval)
      this.timerStarted = false
      this.recordWin()
    },
    canMoveTo (x, y, dx, dy) {
      const movingTo = this.sokoMap[y][x]
      // Prevent squeezing through
      if (dx !== 0 && dy !== 0) {
        // if moving diagonal
        if (!this.isPassable((x - dx), y) && !this.isPassable(x, (y - dy))) {
          return false
        }
      }
      if (this.isPassable(x, y)) {
        return true
      } else if (movingTo.boulder && (this.pushBoulder || !this.moveTo)) {
        return this.tryPushBoulder(x, y, dx, dy)
      }
      return false
    },
    tryPushBoulder (x, y, dx, dy) {
      // Only push boulders once with shift movement
      this.pushBoulder = false
      // can't push boulders diagonal
      if (dx !== 0 && dy !== 0) return false
      const pushingFrom = this.sokoMap[y][x]
      const pushingTo = this.sokoMap[y + dy][x + dx]
      if (!pushingTo.boulder && (pushingTo.character === '.' || pushingTo.character === '<' || pushingTo.character === '>')) {
        // Move boulder
        pushingFrom.boulder = false
        pushingTo.boulder = true
      } else if (pushingTo.character === '^') {
        pushingFrom.boulder = false
        // Replace pit with floor
        pushingTo.character = '.'
      } else {
        return false
      }
      return true
    }
  },
  watch: {
    flipVertically: function (val) {
      localStorage.setItem('flipVertically', val)
      if (val) {
        this.flipRandomly = false
      }
      this.fv = val
      this.loadMap()
    },
    flipHorizontally: function (val) {
      localStorage.setItem('flipHorizontally', val)
      if (val) {
        this.flipRandomly = false
      }
      this.fh = val
      this.loadMap()
    },
    flipRandomly: function (val) {
      localStorage.setItem('flipRandomly', val)
      if (val) {
        this.flipVertically = false
        this.flipHorizontally = false
      }
      this.loadMap()
    },
    enableHoles: function (val) {
      localStorage.setItem('enableHoles', val)
    },
  }
}
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}

#sokoban {
  margin: 0;
  padding: 2em;
  font-family: 'Menlo', monospace;
  color: white;
  background-color: #121212;
  box-sizing: border-box;
}

#sokoban.invert {
  color: black;
  background-color: white
}

a {
  color: white;
}

.inline {
  display: inline-block;
  height: 100%;
  vertical-align: top;
  margin-right: 1.5em;
}

#sokoban.invert a {
  color: #121212;
}
</style>
