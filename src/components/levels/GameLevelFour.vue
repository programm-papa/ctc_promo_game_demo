<template>
  <div class="game-bg">
    <GyroscopeGame
      :width="width"
      :height="height"
      :levelData="levelData"
      :preloadTexture="[
        '/dog/dog0.webp',
        '/dog/dog1.webp',
        '/dog/dog2.webp',
        '/dog/dog3.webp',
        '/dog/dog4.webp',
        '/dog/dog5.webp',
        '/dog/dog6.webp',
        '/food/food1.webp',
        '/food/food2.webp',
        '/food/food3.webp',
        '/food/food4.webp',
        '/food/food5.webp',
        '/food/food6.webp',
        '/food/food7.webp',
        '/obstacles/fire_ring.png',
        '/dog/win.webp',
        '/dog/fail.webp'
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
        foodSpawnLoop: 10000,
        foodSpawnGroup: [5, 7, 8],
        foodNumberToWin: 10,
        foodSpawnZone: {
          x: [0.1, 0.9],
          y: [0.05, 0.1]
        },
        win: {
          position: [0.5, 1],
          size: [0.17, 0.17], // width, height
          sprites: ['/dog/win.webp'],
          spriteScale: [0.7, 0.7],
          finalPosition: [0.5, 0.92]
        },
        fail: {
          position: [0.5, 1],
          size: [0.17, 0.17], // width, height
          sprites: ['/dog/fail.webp'],
          spriteScale: [0.7, 0.7],
          finalPosition: [0.5, 0.92]
        },
        animal: {
          position: [0.5, 0.82],
          size: [0.3, 0.3], // width, height
          sprites: [
            '/dog/dog0.webp',
            '/dog/dog1.webp',
            '/dog/dog2.webp',
            '/dog/dog3.webp',
            '/dog/dog4.webp',
            '/dog/dog5.webp',
            '/dog/dog6.webp'
          ],
          currentSprite: 0,
          endSprite: 3,
          spriteScale: [1, 1],

          animalTrigger: {
            position: [-0.25, 0.2],
            size: [0.06, 0.03],
            scale: [1, 1]
          },
          mouthWals: [
            {
              position: [0.2, 0.6],
              size: [0.01, 0.2257],
              angle: 0
            },
            // {
            //   position: [-0.1, -.1],
            //   size: [0.10, 0.01],
            //   angle: -0.4
            // },
            {
              position: [-0.3, 0.7],
              size: [0.01, 0.1],
              angle: 0
            }
          ],

          mainLoopQuantity: 15, // ms
          mainLoopCallback: function (event, animal, animalTrigger, mouthWals) {
            const startingSprite = this.currentSprite
            if (Common.now() - this.lastChange > 40) {
              if (this.directionAnimation) {
                this.currentSprite++
              } else {
                this.currentSprite--
              }
              if (this.currentSprite >= 6 || this.currentSprite <= 0) {
                this.directionAnimation = !this.directionAnimation
              }
              this.lastChange = Common.now()
            }

            return startingSprite !== this.currentSprite
          },
          lastChange: null,
          directionAnimation: true
          // winCondition: function () {
          //   return this.currentSprite === 1
          // },

          // custom
          // width: null,
          // height: null,
          // invertMove: false,
          // lastChange: null,
          // lastIdleChange: null
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
            sprites: ['/food/food5.webp'],
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
          // {
          //   isCircle: false,
          //   isTrapezoid: true,
          //   isCombined: false,
          //   position: [0.242, 0.19],
          //   size: [0.23, 0.035], // width, height
          //   slope: 0, // clope for trapezoid
          //   sprites: ['/obstacles/fire_ring.png'],
          //   currentSprite: 0,
          //   spriteScale: [1, 1],
          //   isStatic: true,
          //   restitution: 1, // bouncing effect 0..1
          //   collisionCallback: function (event) {
          //     for (const i in event.pairs) {
          //       if (event.pairs[i].bodyA.render.sprite.texture?.includes('food')) {
          //         return {
          //           food: event.pairs[i].bodyA,
          //           foodStatus: false
          //         }
          //       }

          //       if (event.pairs[i].bodyB.render.sprite.texture?.includes('food')) {
          //         return {
          //           food: event.pairs[i].bodyB,
          //           foodStatus: false
          //         }
          //       }
          //     }
          //     return true
          //   }
          // },
          {
            isCircle: false,
            isTrapezoid: true,
            isCombined: false,
            position: [0.758, 0.3],
            size: [0.23, 0.035], // width, height
            slope: 0, // clope for trapezoid
            sprites: ['/obstacles/fire_ring.png'],
            currentSprite: 0,
            spriteScale: [1.3, 1.3],
            isStatic: true,
            restitution: 1, // bouncing effect 0..1
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
              return true
            }
          },
          {
            isCircle: false,
            isTrapezoid: true,
            isCombined: false,
            position: [0.242, 0.5],
            size: [0.23, 0.035], // width, height
            slope: 0, // clope for trapezoid
            sprites: ['/obstacles/fire_ring.png'],
            currentSprite: 0,
            spriteScale: [1.3, 1.3],
            isStatic: true,
            restitution: 1, // bouncing effect 0..1
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
              return true
            }
          },
          {
            isCircle: false,
            isTrapezoid: true,
            isCombined: false,
            position: [0.758, 0.7],
            size: [0.23, 0.035], // width, height
            slope: 0, // clope for trapezoid
            sprites: ['/obstacles/fire_ring.png'],
            currentSprite: 0,
            spriteScale: [1.3, 1.3],
            isStatic: true,
            restitution: 1, // bouncing effect 0..1
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
              return true
            }
          },
          {
            isCircle: false,
            isTrapezoid: false,
            isCombined: false,
            position: [0.5, 0.97],
            size: [1, 0.05], // width, height
            slope: 0.5, // clope for trapezoid
            sprites: ['/obstacles/dog_floor.webp'],
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
          // {
          //   isCircle: false,
          //   isTrapezoid: false,
          //   isCombined: true,
          //   position: [0.75, 0.73],
          //   size: [0.4, 0.05], // width, height
          //   slope: 0.7, // clope for trapezoid
          //   sprites: ['/obstacles/green_tent.png'],
          //   currentSprite: 0,
          //   spriteScale: [1, 1],
          //   isStatic: true,
          //   restitution: 0, // bouncing effect 0..1
          //   mainLoopQuantity: 1000, // ms
          //   mainLoopCallback: null,
          //   collisionCallback: null
          // },

          // {
          //   isCircle: false,
          //   isTrapezoid: true,
          //   position: [.5, 0.23],
          //   size: [.5, 0.1], // width, height
          //   slope: 1, // clope for trapezoid
          //   sprites: ['/obstacles/red_tent.png'],
          //   currentSprite: 0,
          //   spriteScale: [0.3, 0.05],
          //   isStatic: true,
          //   restitution: 1, // bouncing effect 0..1
          //   mainLoopQuantity: 1000, // ms
          //   mainLoopCallback: null,
          //   collisionCallback: null
          // },
          // {
          //   isCircle: false,
          //   position: [0.5, 0.5],
          //   size: [0.1, 0.05], // width, height
          //   sprites: ['/obstacle.png'],
          //   currentSprite: 0,
          //   spriteScale: [0.02, 0.02],
          //   isStatic: true,
          //   restitution: 0, // bouncing effect 0..1
          //   mainLoopQuantity: 1000, // ms
          //   mainLoopCallback: null,
          //   collisionCallback: null
          // },
          // {
          //   isCircle: false,
          //   position: [0.7, 0.7],
          //   size: [0.1, 0.05], // width, height
          //   sprites: ['/obstacle.png', '/obstacle_cracked1.png', 'obstacle_cracked2.png'],
          //   currentSprite: 0,
          //   spriteScale: [0.02, 0.02],
          //   isStatic: true,
          //   restitution: 0, // bouncing effect 0..1
          //   mainLoopQuantity: 1000, // ms
          //   mainLoopCallback: null,
          //   collisionCallback: function (event) {
          //     if (++this.collisionsCount >= 3) {
          //       return false
          //     }

          //     this.currentSprite = this.collisionsCount % 3
          //     return true
          //   },

          //   // custom values
          //   collisionsCount: 0
          // },
          // {
          //   isCircle: false,
          //   position: [0.2, 0.7],
          //   size: [0.1, 0.05], // width, height
          //   sprites: ['/obstacle.png'],
          //   currentSprite: 0,
          //   spriteScale: [0.02, 0.02],
          //   isStatic: true,
          //   restitution: 1, // bouncing effect 0..1
          //   mainLoopQuantity: 100, // ms
          //   mainLoopCallback: function (event, body) {
          //     if (this.spriteScale[0] > 0.02) {
          //       const val = this.spriteScale[0] - 0.005
          //       this.spriteScale = [val, val]

          //       return true
          //     }

          //     return false
          //   },
          //   collisionCallback: function (event) {
          //     for (const i in event.pairs) {
          //       if (event.pairs[i].bodyA.render.sprite.texture === '/meat.png') {
          //         Body.setSpeed(event.pairs[i].bodyA, event.pairs[i].bodyA.speed + 30)
          //         this.spriteScale = [0.04, 0.04]
          //       }

          //       if (event.pairs[i].bodyB.render.sprite.texture === '/meat.png') {
          //         Body.setSpeed(event.pairs[i].bodyB, event.pairs[i].bodyB.speed + 30)
          //         this.spriteScale = [0.04, 0.04]
          //       }
          //     }
          //     // debugger;

          //     return true
          //   }
          // },
          // {
          //   isCircle: true,
          //   position: [0.5, 0.5],
          //   size: [60, 0], // width, height
          //   sprites: ['/ball_obstacle.png'],
          //   currentSprite: 0,
          //   spriteScale: [0.02, 0],
          //   isStatic: false,
          //   restitution: 1, // bouncing effect 0..1
          //   mainLoopQuantity: 5000, // ms
          //   mainLoopCallback: function (event, body) {
          //     Body.setSpeed(body, 50)
          //   },
          //   collisionCallback: null
          // }
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
  background: url('/backgrounds/background_4.webp') center center no-repeat;
  background-size: cover;
}
</style>
