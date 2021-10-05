<template>
  <div class="nh-text">
    <table :class="{darkMode}">
      <tr>
        <th>Sell</th><th>Buy</th><th>Base price</th><th>Item types</th>
      </tr>
      <tr v-for="basePrice in basePrices" v-bind:key="basePrice.price">
        <td>{{sellPrices(basePrice.price)}}</td>
        <td>{{buyPrices(basePrice.price)}}</td>
        <td>{{basePrice.price}}</td>
        <td><NHPriceIdTypes :types="basePrice.types"/></td>
      </tr>
    </table>
  </div>
</template>

<script>
import NHPriceIdTypes from "./NHPriceIdTypes";
import {fraction, multiply, round} from 'mathjs'

export default {
  name: 'NHPriceId',

  props: ['cha', 'isTourist', 'darkMode'],

  components: {
    NHPriceIdTypes
  },

    data: () => ({
      highlights: [
        'rgb(255, 157, 157)',
        'rgb(157, 255, 157)',
        'rgb(157, 157, 255)',
      ],
      basePrices: [
        { price: 8, types: [ { symbol:'[', color: '#AA5500', notes: 'elven boots, kicking boots' } ] },
        { price: 20, types: [ { symbol:'?', color: '#FFF', notes: 'identify' } ] },
        { price: 30, types: [ { symbol:'[', color: '#AA5500', notes: 'fumble boots, levitation boots' } ] },
        { price: 50,
          types: [
            { symbol:'[', color: '#AA5500', notes: 'jumping boots, speed boots, water walking boots, cloak of protection' },
            { symbol:'?', color: '#FFF', notes: 'light' },
            { symbol:'!', color: '#FF55FF', notes: 'booze, fruit juice, see invisible, sickness' },
          ]
        },
        { price: 60,
          types: [
            { symbol:'[', color: '#AA5500', notes: 'cloak of invisibility, cloak of magic resistance' },
            { symbol:'?', color: '#FFF', notes: 'enchant weapon' },
          ]
        },
        { price: 80,
          types: [
            { symbol:'?', color: '#FFF', notes: 'enchant armor, remove curse' },
          ]
        },
        { price: 100,
          types: [
            { symbol:'?', color: '#FFF', notes: 'confuse monster, destroy armor, fire, food detection, gold detection, magic mapping, scare monster, teleportation' },
            { symbol:'!', color: '#FF55FF', notes: 'confusion, extra healing, hallucination, healing, restore ability, sleeping' },
            { symbol:'=', color: '#FFFF55', notes: 'adornment, hunger, protection, protection from shape changers, stealth, sustain ability, warning' },
            { symbol:'/', color: '#00AAAA', notes: 'light, nothing' },
          ]
        },
        { price: 150,
          types: [
            { symbol:'!', color: '#FF55FF', notes: 'blindness, gain energy, invisibility, monster detection, object detection' },
            { symbol:'=', color: '#FFFF55', notes: 'aggravate monster, cold resistance, gain constitution, gain strength, increase accuracy, increase damage, invisibility, poison resistance, see invisible, shock resistance' },
            { symbol:'/', color: '#00AAAA', notes: 'digging, enlightenment, locking, magic missile, make invisible, opening, probing, secret door detection, slow monster, speed monster, striking, undead turning' },
          ]
        },
        { price: 175,
          types: [
            { symbol:'/', color: '#00AAAA', notes: 'cold, fire, lightning, sleep' },
          ]
        },
        { price: 200,
          types: [
            { symbol:'?', color: '#FFF', notes: 'amnesia, create monster, earth, taming' },
            { symbol:'!', color: '#FF55FF', notes: 'enlightenment, full healing, levitation, polymorph, speed' },
            { symbol:'=', color: '#FFFF55', notes: 'fire resistance, free action, levitation, regeneration, searching, slow digestion, teleportation' },
            { symbol:'/', color: '#00AAAA', notes: 'cancellation, create monster, polymorph, teleportation' },
          ]
        },
        { price: 250,
          types: [
            { symbol:'!', color: '#FF55FF', notes: 'acid, oil' },
          ]
        },
        { price: 300,
          types: [
            { symbol:'?', color: '#FFF', notes: 'charging, genocide, punishment, stinking cloud' },
            { symbol:'!', color: '#FF55FF', notes: 'gain ability, gain level, paralysis' },
            { symbol:'=', color: '#FFFF55', notes: 'conflict, polymorph, polymorph control, teleport control' },
          ]
        },
        { price: 500,
          types: [
            { symbol:'/', color: '#00AAAA', notes: 'death, wishing' },
          ]
        },
      ],
    }),

    computed: {
      chaPriceMultiplier: function () {
        if (this.cha < 6) {
          return 2
        } else if (this.cha < 8) {
          return fraction (3, 2)
        } else if (this.cha < 11) {
          return fraction(4, 3)
        } else if (this.cha < 16) {
          return 1
        } else if (this.cha < 18) {
          return fraction(3, 4)
        } else if (this.cha < 19) {
          return fraction(2, 3)
        } else {
          return fraction(1, 2)
        }
      },
      sellPriceMultiplier: function () {
        return (this.isTourist) ? fraction(1, 3) : fraction(1, 2)
      },
      sellPriceMultipliers: function () {
        return [multiply(fraction(3, 4), this.sellPriceMultiplier), this.sellPriceMultiplier]
      },
      buyPriceMultiplier: function () {
        return (this.isTourist) ? fraction(4, 3) : 1
      },
      buyPriceMultipliers: function () {
        const startingMultiplier = multiply(this.chaPriceMultiplier, this.buyPriceMultiplier)
        return [startingMultiplier, multiply(fraction(4, 3), startingMultiplier)]
      },
    },

    methods: {
      sellPrices: function (basePrice) {
        return this.sellPriceMultipliers.map((multiplier) => { return round(multiply(multiplier, basePrice)) }).join(', ')
      },
      buyPrices: function (basePrice) {
        return this.buyPriceMultipliers.map((multiplier) => { return round(multiply(multiplier, basePrice)) }).join(', ')
      },
    }
  }
</script>

<style>
.nh-text {
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", "Courier", monospace;
}
td, th {
  font-weight: bold;
  padding: 0.15em 0.7em;
  border: 1px solid black;
}
table.darkMode td, table.darkMode th {
  border: 1px solid white;
}
table {
  border-collapse: collapse;
}
</style>
