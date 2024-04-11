<template>
  <div class="game-bg">
    <GyroscopeGame
      :width="width"
      :height="height"
      :levelData="levelData"
      :preloadTexture="[
        '/elephant/elephant0.webp',
        '/elephant/elephant1.webp',
        '/elephant/elephant2.webp',
        '/elephant/elephant3.webp',
        '/elephant/elephant4.webp',
        '/elephant/elephant5.webp',
        '/elephant/win.webp',
        '/elephant/fail.webp',
        '/food/food1.webp',
        '/food/food2.webp',
        '/food/food3.webp',
        '/food/food4.webp',
        '/food/food5.webp',
        '/food/food6.webp',
        '/food/food7.webp',
        '/obstacles/glass.webp',
        '/obstacles/blue_ball.webp',
        '/obstacles/pink_ball.webp'
      ]"
      @animalEatFood="animalEatFood"
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
        defaultAnimalImgSize: 1920,
        wireframe: false,
        addBorders: true,
        foodSpawnLoop: 7000,
        foodSpawnGroup: [5, 7, 8],
        foodNumberToWin: 10,
        foodSpawnZone: {
          x: [0.3, 0.9],
          y: [0.05, 0.17]
        },
        win: {
          position: [0.5, 1],
          size: [0.17, 0.17], // width, height
          sprites: ['/elephant/win.webp'],
          spriteScale: [1, 1],
          finalPosition: [0.5, 0.89]
        },
        fail: {
          position: [0.5, 1],
          size: [0.17, 0.17], // width, height
          sprites: ['/elephant/fail.webp'],
          spriteScale: [1, 1],
          finalPosition: [0.5, 0.89]
        },
        animal: {
          position: [0.5, 0.82],
          size: [0.3, 0.3], // width, height
          sprites: [
            '/elephant/elephant0.webp',
            '/elephant/elephant1.webp',
            '/elephant/elephant2.webp',
            '/elephant/elephant3.webp',
            '/elephant/elephant4.webp',
            '/elephant/elephant5.webp'
          ],
          currentSprite: 5,
          endSprite: 3,
          spriteScale: [1.5, 1.5],

          animalTrigger: {
            // Положение относительно центра животного и связанно с ним
            position: [1.15, -0.1],
            // Размеры относительно экрана
            size: [0.04, 0.01],
            scale: [1, 1]
          },
          mouthWals: [
            {
              // Положение относительно центра животного и связанно с ним
              position: [0.8, 0.05],
              size: [0.01, 0.1],
              angle: 1.4
            },
            {
              position: [0.8, -0.1],
              size: [0.01, 0.1],
              angle: 1.4
            }
          ],

          mainLoopQuantity: 15, // ms
          mainLoopCallback: function (event, animal, animalTrigger, mouthWals) {
            const startingSprite = this.currentSprite
            if (Common.now() - this.lastChange > 90) {
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

            if (this.currentSprite === 0) {
              this.animalTrigger.position = [-1.1, -0.05]
              this.mouthWals[0].position = [-0.8, -0.1]
              this.mouthWals[0].angle = -1.2
              this.mouthWals[1].position = [-0.8, 0.2]
              this.mouthWals[1].angle = -1.2
            } else if (this.currentSprite === 1) {
              this.animalTrigger.position = [-0.75, -0.4]
              this.mouthWals[0].position = [-0.38, -0.15]
              this.mouthWals[0].angle = -0.8
              this.mouthWals[1].position = [-0.6, -0.1]
              this.mouthWals[1].angle = -0.8
            } else if (this.currentSprite === 2) {
              this.animalTrigger.position = [-0.3, -0.6]
              this.mouthWals[0].position = [-0.1, -0.2]
              this.mouthWals[0].angle = -0.3
              this.mouthWals[1].position = [-0.3, -0.2]
              this.mouthWals[1].angle = -0.3
            } else if (this.currentSprite === 3) {
              this.animalTrigger.position = [0.2, -0.6]
              this.mouthWals[0].position = [0.2, -0.2]
              this.mouthWals[0].angle = 0.3
              ;(this.mouthWals[1].position = [0, -0.27]), (this.mouthWals[1].angle = 0.3)
            } else if (this.currentSprite === 4) {
              this.animalTrigger.position = [0.75, -0.45]
              this.mouthWals[0].position = [0.5, -0.2]
              this.mouthWals[0].angle = 1
              this.mouthWals[1].position = [0.35, -0.3]
              this.mouthWals[1].angle = 1
            } else if (this.currentSprite === 5) {
              ;(this.animalTrigger.position = [1.15, -0.1]),
                (this.mouthWals[0].position = [0.8, 0.05])
              this.mouthWals[0].angle = 1.4
              this.mouthWals[1].position = [0.8, -0.1]
              this.mouthWals[1].angle = 1.4
            }
            return startingSprite !== this.currentSprite
          },

          // custom
          directionAnimation: false,
          width: null,
          height: null,
          invertMove: false,
          lastChange: null,
          lastIdleChange: null
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
          {
            isCircle: false,
            isTrapezoid: true,
            isCombined: false,
            position: [0.04, 0.45],
            size: [0.6, 0.02], // width, height
            slope: 0, // clope for trapezoid
            sprites: ['/obstacles/glass.webp'],
            currentSprite: 0,
            spriteScale: [1, 1],
            isStatic: true,
            restitution: 0, // bouncing effect 0..1
            mainLoopQuantity: 1000, // ms
            mainLoopCallback: null,
            collisionCallback: function (event) {
              for (const i in event.pairs) {
                if (event.pairs[i].bodyA.render.sprite.texture?.includes('food')) {
                  return {
                    isObstacleDelay: true,
                    delayTime: 3000
                  }
                }

                if (event.pairs[i].bodyB.render.sprite.texture?.includes('food')) {
                  return {
                    isObstacleDelay: true,
                    delayTime: 3000
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
            position: [0.96, 0.45],
            size: [0.6, 0.02], // width, height
            slope: 0, // clope for trapezoid
            sprites: ['/obstacles/glass.webp'],
            currentSprite: 0,
            spriteScale: [1, 1],
            isStatic: true,
            restitution: 0, // bouncing effect 0..1
            mainLoopQuantity: 1000, // ms
            mainLoopCallback: null,
            collisionCallback: function (event) {
              for (const i in event.pairs) {
                if (event.pairs[i].bodyA.render.sprite.texture?.includes('food')) {
                  return {
                    isObstacleDelay: true,
                    delayTime: 3000
                  }
                }

                if (event.pairs[i].bodyB.render.sprite.texture?.includes('food')) {
                  return {
                    isObstacleDelay: true,
                    delayTime: 3000
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
            position: [0.5, 0.99],
            size: [1, 0.03], // width, height
            slope: 0.5, // clope for trapezoid
            sprites: ['/obstacles/grass.webp'],
            currentSprite: 0,
            spriteScale: [0.38, 0.38],
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
          {
            isCircle: true,
            position: [0.9, 0.7],
            size: [0.08, 0], // width, height
            sprites: ['/obstacles/pink_ball.webp'],
            currentSprite: 0,
            spriteScale: [1, 1],
            isStatic: false,
            restitution: 1, // bouncing effect 0..1
            spawnDelay: 1172,
            spawnMax: 0,
            spawnSpeed: [-0.1, -0.15],
            spawned: [],
            collisionCallback: function (event) {
              for (const i in event.pairs) {
                if (event.pairs[i].bodyA.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyA, event.pairs[i].bodyA.speed + 4)
                  return false
                }

                if (event.pairs[i].bodyB.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyB, event.pairs[i].bodyB.speed + 4)
                  return false
                }
              }
              // debugger;

              return true
            }
          },
          {
            isCircle: true,
            position: [0.1, 0.7],
            size: [0.08, 0], // width, height
            sprites: ['/obstacles/blue_ball.webp'],
            currentSprite: 0,
            spriteScale: [1, 1],
            isStatic: false,
            restitution: 1, // bouncing effect 0..1
            spawnDelay: 1053,
            spawnMax: 0,
            spawnSpeed: [0.1, -0.15],
            spawned: [],
            collisionCallback: function (event) {
              for (const i in event.pairs) {
                if (event.pairs[i].bodyA.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyA, event.pairs[i].bodyA.speed + 4)
                  return false
                }

                if (event.pairs[i].bodyB.render.sprite.texture?.includes('food')) {
                  Body.setSpeed(event.pairs[i].bodyB, event.pairs[i].bodyB.speed + 4)
                  return false
                }
              }
              // debugger;

              return true
            }
          }
        ]
      }
    }
  },
  methods: {
    playerDie() {
      // alert('Die')
    },
    playerWin() {
      // alert('Win')
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
  background: url('/backgrounds/background_2.webp') center center no-repeat;
  background-size: cover;
}
</style>
