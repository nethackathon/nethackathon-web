<template>
  <div id="sokoban" :class="{'invert':!this.$vuetify.theme.dark}">
    <h1 v-if="!won">Sokoban Level {{ (this.curLevel + 1) + ((this.curSubLevel === 0) ? 'a' : 'b')}}</h1>
    <div>
      <span v-if="travelError !== ''">{{travelError}}</span>
      <span v-else-if="travelMode">Where do you want to travel to?</span>
      <span v-else>&nbsp;</span>
    </div>
    <Map
        v-if="!won"
        :map="map"
        :dark-mode="this.$vuetify.theme.dark"
        :boulder-char="'0'"
    />
    <h3>Push R to restart.</h3>
    <h1 v-if="won">YOU WIN!</h1>
    <div>
      <div v-if="trackTurnsLocally" class="inline">
        <h3>Scores</h3>
        <div>
          <ul>
            <li>Turns: {{ curTurns }}</li>
            <li>Best turns: {{ (bestTurns[curLevel][curSubLevel] === Number.MAX_SAFE_INTEGER) ? 'None' : bestTurns[curLevel][curSubLevel] }}</li>
            <li>Time: {{ timeElapsed }}s</li>
            <li>Best time: {{ (bestTime[curLevel][curSubLevel] === Number.MAX_SAFE_INTEGER) ? 'None' : bestTime[curLevel][curSubLevel] + 's' }}</li>
          </ul>
        </div>
      </div>
      <div class="inline">
        <h3>Options</h3>
        <div>
          <NHCheckbox
              @clicked="doBothSubLevels = !doBothSubLevels"
              :checked="doBothSubLevels"
              label="Do both sub-levels"
          />
        </div>
        <div>
          <NHCheckbox
              @clicked="flipHorizontally = !flipHorizontally"
              :checked="flipHorizontally"
              label="Flip levels horizontally"
          />
        </div>
        <div>
          <NHCheckbox
              @clicked="flipVertically = !flipVertically"
              :checked="flipVertically"
              label="Flip levels vertically"
          />
        </div>
        <div>
          <NHCheckbox
              @clicked="flipRandomly = !flipRandomly"
              :checked="flipRandomly"
              label="Flip levels randomly"
          />
        </div>
        <div>
          <NHCheckbox
              @clicked="trackTurnsLocally = !trackTurnsLocally"
              :checked="trackTurnsLocally"
              label="Track score locally"
          />
        </div>
      </div>
      <div class="inline">
        <h3>Levels</h3>
        <ul>
          <li v-for="level in levelListing" v-bind:key="level.name"><a href="#" @click="changeLevel(level)">{{level.name}}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Map from './components/Map.vue'
import maps from './maps/maps'
import NHCheckbox from '../NHCheckbox'

export default {
  name: 'Sokoban',
  components: {
    Map,
    NHCheckbox,
  },
  created () {
    window.addEventListener('keydown', this.keyboardEvent);
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyboardEvent);
  },
  mounted () {
    this.loadOptions();
    this.curSubLevel = (this.doBothSubLevels) ? 0 : Math.floor(Math.random() * maps[this.curLevel].length)
    this.loadMap();
  },
  data () {
    return {
      curTurns: 0,
      bestTurns: [[Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]],
      bestTime: [[Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]],
      travelling: false,
      travelMode: false,
      travelPosition: {x: -1, y: -1},
      travelError: '',
      travelPath: [],
      calcDistanceArray: [],
      timerInterval: null,
      timeStarted: 0,
      timeElapsed: 0,
      moveTo: false,
      pushBoulder: false,
      mapString: '',
      curLevel: 0,
      curSubLevel: 0,
      doBothSubLevels: false,
      flipHorizontally: false,
      fh: false, // Tracking flipping horizontally as done by random separately
      flipVertically: false,
      fv: false, // Tracking flipping vertically as done by random separately
      flipRandomly: false,
      map: [],
      playerPosition: {x: -1, y: -1},
      won: false,
      trackTurnsLocally: false
    }
  },
  computed: {
    levelListing () {
      const listing = [];
      for (let i = 0; i < maps.length; i++) {
        for (let j = 0; j < maps[i].length; j++) {
          listing.push({
            name: 'Sokoban Level ' + (i + 1) + ((j === 0) ? 'a' : 'b'),
            level: i,
            subLevel: j
          })
        }
      }
      return listing;
    }
  },
  methods: {
    loadOptions () {
      if (localStorage.getItem('doBothSubLevels') !== null) {
        this.doBothSubLevels = (localStorage.getItem('doBothSubLevels') === 'true');
      }
      if (localStorage.getItem('flipHorizontally') !== null) {
        this.flipHorizontally = (localStorage.getItem('flipHorizontally') === 'true');
      }
      if (localStorage.getItem('flipVertically') !== null) {
        this.flipVertically = (localStorage.getItem('flipVertically') === 'true');
      }
      if (localStorage.getItem('flipRandomly') !== null) {
        this.flipRandomly = (localStorage.getItem('flipRandomly') === 'true');
      }
      if (localStorage.getItem('trackTurnsLocally') !== null) {
        this.trackTurnsLocally = (localStorage.getItem('trackTurnsLocally') === 'true');
      }
      if (localStorage.getItem('bestTurns') !== null) {
        this.bestTurns = JSON.parse(localStorage.getItem('bestTurns'));
      }
      if (localStorage.getItem('bestTime') !== null) {
        this.bestTime = JSON.parse(localStorage.getItem('bestTime'));
      }
    },
    changeLevel (levelObject) {
      this.curLevel = levelObject.level;
      this.curSubLevel = levelObject.subLevel;
      this.loadMap();
    },
    loadMap () {
      // reset timer
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => this.timeElapsed = Math.round((Date.now() - this.timeStarted) / 1000), 1000);
      this.curTurns = 0;
      this.timeStarted = Date.now();
      // reset win state
      this.won = false;
      let m = maps[this.curLevel][this.curSubLevel].slice();
      if (this.flipRandomly) {
        this.fh = Math.random() < 0.5;
        this.fv = Math.random() < 0.5;
      }
      if (this.fh) {
        m = m.map((row) => row.split('').reverse().join(''));
      }
      if (this.fv) {
        m = m.reverse()
      }
      this.map = []
      for (let y = 0; y < m.length; y++) {
        let row = []
        for (let x = 0; x < m[y].length; x++) {
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
        this.map.push(row)
      }
      this.playerPosition = this.getPlayerPosition(m)
      this.map[this.playerPosition.y][this.playerPosition.x].player = true
      this.map[this.playerPosition.y][this.playerPosition.x].highlight = true
    },
    getPlayerPosition (map) {
      for (let y = 0; y < map.length; y++) {
        if (map[y].indexOf('>') > 0) {
          return {x: (map[y].indexOf('>')), y};
        }
      }
      return {x: -1, y: -1};
    },
    charAt (map, x, y) {
      return map[y][x].character
    },
    getMoveTo(evt) {
      return (evt.getModifierState('Control') || evt.getModifierState('Shift') || this.moveTo);
    },
    getPushTo(evt) {
      return evt.getModifierState('Shift');
    },
    limit(pos, limit) {
      let ret = Math.max(pos, 0)
      return Math.min(ret, limit)
    },
    keyboardEvent (evt) {
      // console.log('evt', evt);
      if (this.travelling) return
      this.travelError = ''
      // Prevent window from scrolling when using the arrow keys
      if (evt.key === 'ArrowDown' || evt.key === 'ArrowUp' || evt.key === 'ArrowLeft' ||evt.key === 'ArrowRight') evt.preventDefault();
      if (evt.key === 'm' || evt.key === 'g') this.moveTo = true;
      if (evt.key === 'j' || evt.key === 'J' || evt.key === '2' || evt.key === 'ArrowDown') this.move(0, 1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'k' || evt.key === 'K' || evt.key === '8' || evt.key === 'ArrowUp') this.move(0, -1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'h' || evt.key === 'H' || evt.key === '4' || evt.key === 'ArrowLeft') this.move(-1, 0, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'l' || evt.key === 'L' || evt.key === '6' || evt.key === 'ArrowRight') this.move(1, 0, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'y' || evt.key === 'Y' || evt.key === '7') this.move(-1, -1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'u' || evt.key === 'U' || evt.key === '9') this.move(1, -1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'b' || evt.key === 'B' || evt.key === '1') this.move(-1, 1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'n' || evt.key === 'N' || evt.key === '3') this.move(1, 1, this.getMoveTo(evt), this.getPushTo(evt));
      if (evt.key === 'r') this.loadMap();
      if (evt.key === '_') {
        this.setTravelMode(true)
      }
      if (evt.key === 'Escape') {
        this.setTravelMode(false)
      }
      if (evt.key === '.' && this.travelMode) {
        if (this.travelTo()) {
          this.travelling = true
          this.travel().then(() => this.travelling = false)
        } else {
          this.travelError = 'No travel path'
        }
        this.setTravelMode(false)
      }
    },
    async travel() {
      return new Promise(resolve => {
        let travelTimer = window.setInterval(() => {
          if (this.travelPath.length > 0) {
            let pos = this.travelPath.pop()
            this.movePlayerTo(pos)
          } else {
            window.clearInterval(travelTimer)
            resolve()
          }
        }, 10)
      })
    },
    movePlayerTo(pos) {
      let mapPos = this.map[this.playerPosition.y][this.playerPosition.x]
      mapPos.highlight = false
      mapPos.player = false
      this.playerPosition.x = pos.x
      this.playerPosition.y = pos.y
      mapPos = this.map[pos.y][pos.x]
      mapPos.highlight = true
      mapPos.player = true
    },
    calcDistance(pos, dist) {
      this.map[pos.y][pos.x].visited = true
      for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
          if (!this.map[pos.y + dy][pos.x + dx].visited && this.canTravelTo(pos.x + dx, pos.y + dy, dx, dy)) {
            let travellingTo = this.map[pos.y + dy][pos.x + dx]
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
          if (this.map[pos.y + dy][pos.x + dx].distance === (this.map[pos.y][pos.x].distance - 1)) {
            return {x: (pos.x + dx), y: (pos.y + dy)}
          }
        }
      }
    },
    travelTo() {
      for (let y = 0; y < this.map.length; y++) {
        for (let x = 0; x < this.map[y].length; x++) {
          this.map[y][x].distance = undefined
          this.map[y][x].visited = false
        }
      }
      this.map[this.playerPosition.y][this.playerPosition.x].distance = 0
      this.calcDistanceArray.push({
        pos: this.playerPosition,
        distance: 0
      })
      while(this.calcDistanceArray.length > 0) {
        let nextPos = this.calcDistanceArray.pop()
        this.calcDistance(nextPos.pos, nextPos.distance)
      }
      if (this.map[this.travelPosition.y][this.travelPosition.x].distance !== undefined) {
        let curPos = {x: this.travelPosition.x, y: this.travelPosition.y }
        this.travelPath.push(curPos)
        while (this.map[curPos.y][curPos.x].distance > 0) {
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
        this.travelPosition.y = this.playerPosition.y;
        this.travelPosition.x = this.playerPosition.x;
      }
      this.map[this.playerPosition.y][this.playerPosition.x].highlight = !this.travelMode
      this.map[this.travelPosition.y][this.travelPosition.x].highlight = this.travelMode
    },
    move (x, y, moveTo, pushBoulder) {
      if (this.travelMode) {
        let dx = (pushBoulder) ? x * 8 : x
        let dy = (pushBoulder) ? y * 8 : y
        this.map[this.travelPosition.y][this.travelPosition.x].highlight = false
        this.travelPosition.x += dx;
        this.travelPosition.y += dy;
        this.travelPosition.x = this.limit(this.travelPosition.x, this.map[0].length - 1)
        this.travelPosition.y = this.limit(this.travelPosition.y, this.map.length - 1)
        this.map[this.travelPosition.y][this.travelPosition.x].highlight = true
        return;
      }
      this.pushBoulder = pushBoulder;
      this.moveTo = moveTo;
      if (this.canMoveTo(this.playerPosition.x + x, this.playerPosition.y + y, x, y)) {
        this.curTurns++;
        this.map[this.playerPosition.y][this.playerPosition.x].player = false
        this.map[this.playerPosition.y][this.playerPosition.x].highlight = false
        this.playerPosition.x += x;
        this.playerPosition.y += y;
        this.map[this.playerPosition.y][this.playerPosition.x].player = true
        this.map[this.playerPosition.y][this.playerPosition.x].highlight = true
        // this.updateMapString();
        if (moveTo) {
          // repeat same move while possible
          this.move(x,y, this.moveTo, this.pushBoulder);
        }
      } else {
        this.moveTo = false;
      }
    },
    isPassable(x, y) {
      const movingTo = this.map[y][x];
      return (!movingTo.boulder && movingTo.character === '.' || movingTo.character === '<' || movingTo.character === '>' || movingTo.character === '+');
    },
    canMoveTo (x, y, dx, dy) {
      const movingTo = this.map[y][x]
      // Prevent squeezing through
      if (dx !== 0 && dy !== 0) {
        // if moving diagonal
        if (!this.isPassable((x - dx), y) && !this.isPassable(x, (y - dy))) {
          return false
        }
      }
      if (this.isPassable(x, y)) {
        if (movingTo.character === '<') {
          this.bestTurns[this.curLevel][this.curSubLevel] = Math.min(this.bestTurns[this.curLevel][this.curSubLevel], this.curTurns);
          localStorage.setItem('bestTurns', JSON.stringify(this.bestTurns));

          this.bestTime[this.curLevel][this.curSubLevel] = Math.min(this.bestTime[this.curLevel][this.curSubLevel], this.timeElapsed);
          localStorage.setItem('bestTime', JSON.stringify(this.bestTime));

          if (this.curLevel === maps.length - 1 && (!this.doBothSubLevels || this.curSubLevel === maps[this.curLevel].length - 1)) {
            this.won = true;
            // Stop timer when you win the game
            clearInterval(this.timerInterval);
            this.curLevel = 1;
          } else {
            if (this.doBothSubLevels) {
              if (this.curSubLevel === maps[this.curLevel].length - 1) {
                this.curLevel++;
                this.curSubLevel = 0;
              } else {
                this.curSubLevel++;
              }
            } else {
              this.curLevel++;
              this.curSubLevel = Math.floor(Math.random() * maps[this.curLevel].length)
            }
            this.loadMap();
          }
          return false
        } else {
          return true
        }
      } else if (movingTo.boulder && (this.pushBoulder || !this.moveTo)) {
        return this.tryPushBoulder(x, y, dx, dy)
      }
      return false
    },
    tryPushBoulder (x, y, dx, dy) {
      // Only push boulders once with shift movement
      this.pushBoulder = false;
      // can't push boulders diagonal
      if (dx !== 0 && dy !== 0) return false;
      const pushingTo = this.map[y + dy][x + dx]
      if (!pushingTo.boulder && pushingTo.character === '.' || pushingTo.character === '<' || pushingTo.character === '>') {
        // Move boulder
        this.map[y][x].boulder = false
        this.map[y + dy][x + dx].boulder = true
      } else if (pushingTo.character === '^') {
        this.map[y][x].boulder = false
        // Replace pit with floor
        this.map[y + dy][x + dx].character = '.'
      } else {
        return false;
      }
      return true;
    }
  },
  watch: {
    flipVertically: function (val) {
      localStorage.setItem('flipVertically', val);
      if (val) {
        this.flipRandomly = false;
      }
      this.fv = val;
      this.loadMap();
    },
    flipHorizontally: function (val) {
      localStorage.setItem('flipHorizontally', val);
      if (val) {
        this.flipRandomly = false;
      }
      this.fh = val;
      this.loadMap();
    },
    flipRandomly: function (val) {
      localStorage.setItem('flipRandomly', val);
      if (val) {
        this.flipVertically = false;
        this.flipHorizontally = false;
      }
      this.loadMap();
    },
    doBothSubLevels: function (val) {
      localStorage.setItem('doBothSubLevels', val);
      if (val && this.curSubLevel > 0) {
        this.curSubLevel = 0;
        this.loadMap();
      }
    },
    trackTurnsLocally: function (val) {
      localStorage.setItem('trackTurnsLocally', val);
    }
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
