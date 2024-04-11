<template>
  <div class="game-bg">
    <GyroscopeGame
      :width="width"
      :height="height"
      :levelData="levelData"
      :preloadTexture="[
        '/monkey/monkey0.webp',
        '/monkey/monkey1.webp',
        '/monkey/monkey2.webp',
        '/monkey/monkey3.webp',
        '/monkey/monkey4.webp',
        '/monkey/monkey5.webp',
        '/monkey/fail.webp',
        '/monkey/win.webp',
        '/food/food1.webp',
        '/food/food2.webp',
        '/food/food3.webp',
        '/food/food4.webp',
        '/food/food5.webp',
        '/food/food6.webp',
        '/food/food7.webp',
        '/obstacles/arm.webp',
        '/obstacles/arm-left.webp',
        '/obstacles/leg.webp',
        '/obstacles/leg-left.webp'
      ]"
      @playerDie="playerDie"
      @playerWin="playerWin"
      @animalEatFood="animalEatFood"
      @foodLost="foodLost"
    />
  </div>
  <SatietyCondition :eated="eated" :foodNumberToWin="levelData.foodNumberToWin" />
</template>

<script setup>
import SatietyCondition from '@/components/interface/SatietyCondition.vue'
</script>

<script>
import { Body, Common } from 'matter-js'
import GyroscopeGame from '../GyroscopeGame.vue'

/**
 * Device coord (width,height)
 *
 * (0,0)                   (1,0)
 * +---------------------------+
 * |                           |
 * |                           |
 * |                           |
 * |                           |
 * |                           |
 * +---------------------------+
 * (0,1)                   (1,1)
 *
 * pos - position in pixels
 * n_pos - normalized position between 0 and 1
 * width - render width
 * height - render height
 *
 * pos (width) = width * n_pos
 * pos (height) = height * n_pos
 */

export default {
  name: 'GameLevelOne',
  components: {
    GyroscopeGame
  },
  created() {
    this.width = Math.min(window.innerWidth, window.innerHeight);
    this.height =  Math.max(window.innerWidth, window.innerHeight);

    this.levelData.animal.width = window.innerWidth
    this.levelData.animal.height = window.innerHeight

    this.levelData.obstacles.forEach((obstacle, index) => {
      if (obstacle.hasOwnProperty('width')) {
        this.levelData.obstacles[index].width = window.innerWidth
      }
    })
  },
  data() {
    return {
      eated: 0,
      width: null,
      heigth: null,
      levelData: {
        defaultImgSize: 400,
        defaultDeadZoneImgSize: 768,
        defaultFoodImgSize: 300,
        defaultAnimalImgSize: 1247,
        wireframe: false,
        addBorders: true,
        foodSpawnLoop: 7000,
        foodSpawnGroup: [5, 7, 8],
        foodNumberToWin: 10,
        foodSpawnZone: {
          x: [0.1, 0.9],
          y: [0.05, 0.1]
        },
        win: {
          position: [0.5, 1],
          size: [0.17, 0.17], // width, height
          sprites: ['/monkey/win.webp'],
          spriteScale: [1, 1],
          finalPosition: [0.5, 0.89]
        },
        fail: {
          position: [0.5, 1],
          size: [0.17, 0.17], // width, height
          sprites: ['/monkey/fail.webp'],
          spriteScale: [1, 1],
          finalPosition: [0.5, 0.89]
        },
        animal: {
          position: [0.5, 0.84],
          size: [0.25, 0.25], // width, height
          sprites: [
            '/monkey/monkey0.webp',
            '/monkey/monkey1.webp',
            '/monkey/monkey2.webp',
            '/monkey/monkey3.webp',
            '/monkey/monkey4.webp',
            '/monkey/monkey5.webp'
          ],
          currentSprite: 0,
          endSprite: 3,
          spriteScale: [1, 1],

          animalTrigger: {
            position: [-0.15, 0.4],
            size: [0.1, 0.03],
            scale: [1, 1]
          },
          mouthWals: [
            // {
            //   position: [0, 0],
            //   size: [0.12, 0.05],
            //   angle: 0
            // }
            // {
            //   position: [0.45, 0.81],
            //   size: [0.11, 0.01],
            //   angle: -0.4
            // },
            // {
            //   position: [0.4, 0.95],
            //   size: [0.01, 0.1],
            //   angle: 0
            // }
          ],

          mainLoopQuantity: 15, // ms
          mainLoopCallback: function (event, animal, animalTrigger, mouthWals) {
            const startingSprite = this.currentSprite
            if (Common.now() - this.lastChange > 34) {
              if (this.directionAnimation) {
                this.currentSprite++
              } else {
                this.currentSprite--
              }
              if (this.currentSprite >= 5 || this.currentSprite <= 0) {
                this.directionAnimation = !this.directionAnimation
              }
              this.lastChange = Common.now()
            }

            const currentXPos = animal.position.x / this.width

            if (currentXPos <= 0 + this.size[0] / 2) this.invertMove = false
            if (currentXPos >= 1 - this.size[0] / 2) this.invertMove = true

            const addVal = (this.invertMove ? -1 : 1) * (0.005 * this.width)

            this.position = [
              (animal.position.x + addVal) / this.width,
              animal.position.y / this.height
            ]
            Body.setPosition(animal, {
              x: animal.position.x + addVal,
              y: animal.position.y
            })
            return startingSprite !== this.currentSprite
          },
          lastChange: null,
          directionAnimation: true
        },
        food: [
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food4.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food1.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food1.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food1.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food4.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food7.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food7.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food2.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food3.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food5.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food6.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food2.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food2.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food7.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food2.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food7.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07], // width, height
            sprites: ['/food/food2.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000, // ms
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food2.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food3.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          },
          {
            position: [0.5, 0.1],
            size: [0.07, 0.07],
            sprites: ['/food/food6.webp'],
            currentSprite: 0,
            spriteScale: [1.5, 1.5],
            mainLoopQuantity: 1000,
            mainLoopCallback: null
          }
        ],
        obstacles: [
          {
            isCircle: false,
            isTrapezoid: true,
            isCombined: false,
            position: [1.35, 0.15],
            size: [0.7, 0.05], // width, height
            slope: 0.5, // clope for trapezoid
            sprites: ['/obstacles/arm.webp'],
            currentSprite: 0,
            spriteScale: [0.208, 0.208],
            isStatic: true,
            restitution: 1, // bouncing effect 0..1
            mainLoopQuantity: 13, // ms
            mainLoopCallback: function (event, body) {
              if (this.spriteScale[0] > 1) {
                const val = this.spriteScale[0] - 0.01
                this.spriteScale = [val, val]
                return true
              }
              const currentXPos = body.position.x / this.width

              if (currentXPos <= 0.75) this.invertMove = false
              if (currentXPos >= 1.35) this.invertMove = true

              const addVal = (this.invertMove ? -1 : 1) * (0.009 * this.width)
              Body.setPosition(body, {
                x: body.position.x + addVal,
                y: body.position.y
              })

              return false
            },
            collisionCallback: function (event) {
              for (const i in event.pairs) {
                if (event.pairs[i].bodyB.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyB, event.pairs[i].bodyB.speed + 5)
                  //this.spriteScale = [1.05, 1.05]
                }

                if (event.pairs[i].bodyA.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyA, event.pairs[i].bodyA.speed + 5)
                  //this.spriteScale = [1.05, 1.05]
                }
              }
              // debugger;

              return true
            },
            invertMove: false,
            width: null
          },
          {
            isCircle: false,
            isTrapezoid: true,
            isCombined: false,
            position: [-0.35, 0.5367],
            size: [0.7, 0.05], // width, height
            slope: 0.5, // clope for trapezoid
            sprites: ['/obstacles/arm-left.webp'],
            currentSprite: 0,
            spriteScale: [0.208, 0.208],
            isStatic: true,
            restitution: 1, // bouncing effect 0..1
            mainLoopQuantity: 11, // ms
            mainLoopCallback: function (event, body) {
              // if (this.spriteScale[0] > 1) {
              //   const val = this.spriteScale[0] - 0.01
              //   this.spriteScale = [val, val]
              //   return true
              // }
              const currentXPos = body.position.x / this.width

              if (currentXPos <= -0.35) this.invertMove = false
              if (currentXPos >= 0.35) this.invertMove = true

              const addVal = (this.invertMove ? -1 : 1) * (0.009 * this.width)
              Body.setPosition(body, {
                x: body.position.x + addVal,
                y: body.position.y
              })

              return false
            },
            collisionCallback: function (event) {
              for (const i in event.pairs) {
                if (event.pairs[i].bodyB.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyB, event.pairs[i].bodyB.speed + 5)
                  //this.spriteScale = [1.05, 1.05]
                }

                if (event.pairs[i].bodyA.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyA, event.pairs[i].bodyA.speed + 5)
                  //this.spriteScale = [1.05, 1.05]
                }
              }
              // debugger;

              return true
            },
            invertMove: false,
            width: null
          },
          {
            isCircle: false,
            isTrapezoid: true,
            isCombined: false,
            position: [1.35, 0.45],
            size: [0.7, 0.05], // width, height
            slope: 0.5, // clope for trapezoid
            sprites: ['/obstacles/leg.webp'],
            currentSprite: 0,
            spriteScale: [0.217, 0.217],
            isStatic: true,
            restitution: 1, // bouncing effect 0..1
            mainLoopQuantity: 15, // ms
            mainLoopCallback: function (event, body) {
              if (this.spriteScale[0] > 1) {
                const val = this.spriteScale[0] - 0.01
                this.spriteScale = [val, val]
                return true
              }
              const currentXPos = body.position.x / this.width

              if (currentXPos <= 0.75) this.invertMove = false
              if (currentXPos >= 1.35) this.invertMove = true

              const addVal = (this.invertMove ? -1 : 1) * (0.009 * this.width)
              Body.setPosition(body, {
                x: body.position.x + addVal,
                y: body.position.y
              })

              return false
            },
            collisionCallback: function (event) {
              for (const i in event.pairs) {
                if (event.pairs[i].bodyB.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyB, event.pairs[i].bodyB.speed + 5)
                  //this.spriteScale = [1.05, 1.05]
                }

                if (event.pairs[i].bodyA.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyA, event.pairs[i].bodyA.speed + 5)
                  //this.spriteScale = [1.05, 1.05]
                }
              }
              // debugger;

              return true
            },
            invertMove: false,
            width: null
          },
          {
            isCircle: false,
            isTrapezoid: true,
            isCombined: false,
            position: [-0.35, 0.3367],
            size: [0.7, 0.05], // width, height
            slope: 0.5, // clope for trapezoid
            sprites: ['/obstacles/leg-left.webp'],
            currentSprite: 0,
            spriteScale: [0.217, 0.217],
            isStatic: true,
            restitution: 1, // bouncing effect 0..1
            mainLoopQuantity: 16, // ms
            mainLoopCallback: function (event, body) {
              if (this.spriteScale[0] > 1) {
                const val = this.spriteScale[0] - 0.01
                this.spriteScale = [val, val]
                return true
              }
              const currentXPos = body.position.x / this.width

              if (currentXPos <= -0.35) this.invertMove = false
              if (currentXPos >= 0.35) this.invertMove = true

              const addVal = (this.invertMove ? -1 : 1) * (0.009 * this.width)
              Body.setPosition(body, {
                x: body.position.x + addVal,
                y: body.position.y
              })

              return false
            },
            collisionCallback: function (event) {
              for (const i in event.pairs) {
                if (event.pairs[i].bodyB.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyB, event.pairs[i].bodyB.speed + 5)
                  //this.spriteScale = [1.05, 1.05]
                }

                if (event.pairs[i].bodyA.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyA, event.pairs[i].bodyA.speed + 5)
                  //this.spriteScale = [1.05, 1.05]
                }
              }
              // debugger;

              return true
            },
            invertMove: false,
            width: null
          },
          {
            isCircle: false,
            isTrapezoid: false,
            isCombined: false,
            position: [0.5, 0.985],
            size: [1, 0.03], // width, height
            slope: 0.5, // clope for trapezoid
            sprites: ['/obstacles/stone.webp'],
            currentSprite: 0,
            spriteScale: [0.37, 0.37],
            isStatic: true,
            restitution: 1, // bouncing effect 0..1
            // mainLoopQuantity: 100, // ms
            // mainLoopCallback: function (event, body) {
            //   return false
            // },
            collisionCallback: function (event) {
              for (const i in event.pairs) {
                if (event.pairs[i].bodyA.render.sprite.texture?.includes('food')) {
                  return {
                    food: event.pairs[i].bodyA,
                    foodStatus: false
                  }
                }

                if (event.pairs[i].bodyB.render.sprite.texture?.includes('food')) {
                  return {
                    food: event.pairs[i].bodyB,
                    foodStatus: false
                  }
                }
              }
              // debugger;

              return true
            }
          }
        ],
        spawnObjects: [
          // {
          //   isCircle: false,
          //   position: [0, 0.3],
          //   size: [0.15, 0.075], // width, height
          //   sprites: ['/obstacles/orange_tent.png'],
          //   currentSprite: 0,
          //   spriteScale: [0.001, 0.001],
          //   isStatic: true,
          //   restitution: 1, // bouncing effect 0..1
          //   mainLoopQuantity: 1000, // ms
          //   mainLoopCallback: null,
          //   collisionCallback: null
          // },
          // {
          //   isCircle: true,
          //   position: [0.5, 0.6],
          //   size: [60, 0], // width, height
          //   sprites: ['/ball_obstacle.png'],
          //   currentSprite: 0,
          //   spriteScale: [0.02, 0],
          //   isStatic: false,
          //   restitution: 1, // bouncing effect 0..1
          //   spawnDelay: 1000,
          //   spawnMax: 1,
          //   spawnSpeed: [-0.1, -0.2],
          //   spawned: [],
          //   collisionCallback: null
          // },
          // {
          //   isCircle: true,
          //   position: [0.5, 0.6],
          //   size: [60, 0], // width, height
          //   sprites: ['/ball_obstacle.png'],
          //   currentSprite: 0,
          //   spriteScale: [0.02, 0],
          //   isStatic: false,
          //   restitution: 1, // bouncing effect 0..1
          //   spawnDelay: 1000,
          //   spawnMax: 1,
          //   spawnSpeed: [0.1, -0.2],
          //   spawned: [],
          //   collisionCallback: null
          // },
          // {
          //   isCircle: true,
          //   position: [0.7, 0.9],
          //   size: [60, 0], // width, height
          //   sprites: ['/ball_obstacle.png'],
          //   currentSprite: 0,
          //   spriteScale: [0.02, 0],
          //   isStatic: false,
          //   restitution: 1, // bouncing effect 0..1
          //   spawnDelay: 1000,
          //   spawnMax: 1,
          //   spawnSpeed: [0.1, -0.2],
          //   spawned: [],
          //   collisionCallback: null
          // }
        ]
      }
    }
  },
  methods: {
    playerDie() {
      alert('Die')
    },
    playerWin() {
      alert('Win')
    },
    animalEatFood() {
      this.eated++
    },
    foodLost() {
      // console.log('foodLost')
    }
  }
}
</script>

<style lang="scss" scoped>
.game-bg {
  background: url('/backgrounds/background_3.webp') center center no-repeat;
  background-size: cover;
}
</style>
