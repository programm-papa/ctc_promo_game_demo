<template>
  <!-- <img id="game-field-bg" src="/backgrounds/background.webp" alt="gameFieldBg" /> -->
  <div id="game-field"></div>
</template>
<script>
import { mapStores } from 'pinia'
import {
  useGameCondition,
  useGyroCondition,
  useLevelCondition,
  useTimerCondition
} from '@/stores/index'
// import { useLoaderСondition } from '@/stores/useLoaderСondition'
// import { useGyroPermission } from '@/stores/useGyroPermission'

import {
  Engine,
  Render,
  Runner,
  Common,
  MouseConstraint,
  Mouse,
  Composite,
  Events,
  World,
  Bodies,
  Body
} from 'matter-js'
// import decomp from 'poly-decomp';

export default {
  name: 'GyroscopeGame',
  props: {
    // isGameRunnin: {
    //   value: Boolean,
    //   default: false
    // },
    width: {
      value: Number,
      default: 800
    },
    height: {
      value: Number,
      default: 600
    },
    levelData: {
      value: Object,
      default: null
    },
    preloadTexture: {
      value: Array,
      default: []
    }
  },
  data() {
    return {
      world: null,
      engine: null,
      render: null,
      runner: null,
      preloadedTextures: [],
      // isGameRunnin: true,
      eated: 0,
      foodLost: 0,
      endLvl: false,
      win: false,
      fail: false,
      animalHidden: false
    }
  },
  computed: {
    ...mapStores(useGameCondition, useLevelCondition, useTimerCondition, useGyroCondition)
  },
  mounted() {
    // Common.setDecomp(decomp);
    // window.decomp = decomp;

    // preload texture
    if (this.preloadTexture.length > 0) this.preloadTextures(this.preloadTexture)

    // create engine
    let engine = Engine.create({ gravity: { x: 0, y: 0 } }),
      world = engine.world

    this.world = world
    this.engine = engine

    // create renderer
    let render = Render.create({
      element: document.getElementById('game-field'),
      engine: engine,
      options: {
        width: this.width,
        height: this.height,
        background: '#transparent',
        wireframes: this.levelData.wireframe
        // showPositions: true,
        // showAxes: true,
        // showAngleIndicator: true
      }
    })

    this.render = render

    Render.run(render)

    // create runner
    let runner = Runner.create()
    this.runner = runner
    Runner.run(runner, engine)

    /**
     * GENERATE OBSTACLES
     */
    let obstacles = [],
      obstaclesMatch = {}
    for (const obs_i in this.levelData.obstacles) {
      const obs = this.levelData.obstacles[obs_i]
      let createdObs = this.createObstacle(obs)
      if (Array.isArray(createdObs)) {
        createdObs.forEach((element) => {
          element.restitution = obs.restitution
          obstacles.push(element)
          obstaclesMatch[element.id] = obs_i
        })
      } else {
        createdObs.restitution = obs.restitution
        obstacles.push(createdObs)
        obstaclesMatch[createdObs.id] = obs_i
      }
    }

    // field borders
    if (this.levelData.addBorders === true) {
      obstacles = obstacles.concat([
        Bodies.rectangle(this.width / 2, 0, this.width, 10, {
          isStatic: true,
          collisionFilter: {
            mask: 0x0001
          }
        }),
        Bodies.rectangle(this.width / 2, this.height, this.width, 10, {
          isStatic: true,
          collisionFilter: {
            mask: 0x0001
          }
        }),
        Bodies.rectangle(this.width, this.height / 2, 10, this.height, {
          isStatic: true,
          collisionFilter: {
            mask: 0x0001
          }
        }),
        Bodies.rectangle(0, this.height / 2, 10, this.height, {
          isStatic: true,
          collisionFilter: {
            mask: 0x0001
          }
        })
      ])
    }

    /**
     * GENERATE AMINAL BODIES
     */
    let animal = Bodies.rectangle(
      this.width * this.levelData.animal.position[0],
      this.height * this.levelData.animal.position[1],
      this.height * this.levelData.animal.size[0],
      this.height * this.levelData.animal.size[1],
      {
        isStatic: true,
        isSensor: true,
        // angle: 0,
        render: {
          sprite: {
            texture: this.levelData.animal.sprites[this.levelData.animal.currentSprite],
            xScale:
              ((this.levelData.animal.size[0] * this.height) /
                this.levelData.defaultAnimalImgSize) *
              this.levelData.animal.spriteScale[0],
            yScale:
              ((this.levelData.animal.size[1] * this.height) /
                this.levelData.defaultAnimalImgSize) *
              this.levelData.animal.spriteScale[1],
            yOffset: 0
          }
        }
      }
    )

    // Триггер для животного
    let animalTrigger = Bodies.rectangle(
      // x position
      this.width * this.levelData.animal.position[0] +
        ((this.height * this.levelData.animal.size[0]) / 2) *
          this.levelData.animal.animalTrigger.position[0],
      // y position
      this.height * this.levelData.animal.position[1] +
        ((this.height * this.levelData.animal.size[1]) / 2) *
          this.levelData.animal.animalTrigger.position[1],
      // this.height * this.levelData.animal.animalTrigger.position[1],
      this.height * this.levelData.animal.animalTrigger.size[0],
      this.height * this.levelData.animal.animalTrigger.size[1],
      {
        isStatic: true,
        isSensor: true,
        // angle: 0.1,
        render: {
          opacity: 0
        }
      }
    )
    // Защита от читера
    let mouthWals = []

    for (const wall of this.levelData.animal.mouthWals) {
      mouthWals.push(
        Bodies.rectangle(
          // this.width * wall.position[0],
          // this.height * wall.position[1],
          // x position
          this.width * this.levelData.animal.position[0] +
            ((this.height * this.levelData.animal.size[0]) / 2) * wall.position[0],
          // y position
          this.height * this.levelData.animal.position[1] +
            ((this.height * this.levelData.animal.size[1]) / 2) * wall.position[1],
          this.height * wall.size[0],
          this.height * wall.size[1],
          {
            isStatic: true,
            isSensor: false,
            angle: wall.angle,
            render: {
              opacity: 0
            }
          }
        )
      )
    }

    // Результирующая анимация
    let winAnimationSprite = Bodies.rectangle(
      this.width * this.levelData.win.position[0],
      this.height * this.levelData.win.position[1] + this.height * this.levelData.win.size[1],
      this.height * this.levelData.win.size[0],
      this.height * this.levelData.win.size[1],
      {
        isStatic: true,
        isSensor: true,
        // angle: 0,
        render: {
          sprite: {
            texture: this.levelData.win.sprites[0],
            xScale:
              ((this.levelData.win.size[0] * this.height) / 400) *
              this.levelData.win.spriteScale[0],
            yScale:
              ((this.levelData.win.size[1] * this.height) / 400) *
              this.levelData.win.spriteScale[1],
            yOffset: 0
          }
        }
      }
    )

    let failAnimationSprite = Bodies.rectangle(
      this.width * this.levelData.fail.position[0],
      this.height * this.levelData.fail.position[1] + this.height * this.levelData.fail.size[1],
      this.height * this.levelData.fail.size[0],
      this.height * this.levelData.fail.size[1],
      {
        isStatic: true,
        isSensor: true,
        // angle: 0,
        render: {
          sprite: {
            texture: this.levelData.fail.sprites[0],
            xScale:
              ((this.levelData.fail.size[0] * this.height) / 400) *
              this.levelData.fail.spriteScale[0],
            yScale:
              ((this.levelData.fail.size[1] * this.height) / 400) *
              this.levelData.fail.spriteScale[1],
            yOffset: 0
          }
        }
      }
    )
    // ;[
    //   Bodies.rectangle(
    //     this.width * this.levelData.animal.position[0] -
    //       (this.height * this.levelData.animal.size[0]) / 8,
    //     this.height * (this.levelData.animal.position[1] + this.levelData.animal.size[1] / 4),
    //     (this.height * this.levelData.animal.size[0]) / 2,
    //     this.height * 0.01,
    //     {
    //       isStatic: true,
    //       isSensor: false,
    //       angle: 1.2,
    //       render: {}
    //     }
    //   )
    // ]

    /**
     * ADD ALL BODIES TO THE WORLD
     */
    Composite.add(
      world,
      [animal, winAnimationSprite, failAnimationSprite]
        .concat(animalTrigger)
        .concat(mouthWals)
        .concat(obstacles)
    )
    /**
     * DEFINE COLLISION HANDLING
     */
    Events.on(engine, 'collisionStart', (event) => {
      if (!this.useLevelConditionStore.isGameRunnin) return

      for (const check of event.pairs) {
        // check win condition
        // (if animal ate the food considering additional conditions)
        for (let food of foods) {
          if (
            (animalTrigger === check.bodyA || animalTrigger === check.bodyB) &&
            (food === check.bodyA || food === check.bodyB)
          ) {
            // World.remove(world, food);
            const deleteFood = this.levelData.animal.winCondition
              ? this.levelData.animal.winCondition.call(this.levelData.animal, event)
              : true

            if (deleteFood) {
              World.remove(world, food)

              this.$emit('animalEatFood')
              this.eated = this.eated + 1

              if (this.eated === this.levelData.foodNumberToWin) {
                // this.useGameConditionStore.isGameRunnin = false
                this.useTimerConditionStore.stopTimer()
                // this.endLvl = true
                this.useLevelConditionStore.endLvl = true
                // this.win = true
                this.useLevelConditionStore.win = true
                World.remove(world, foods)
                // this.$emit('playerWin')
              } else if (this.levelData.food.length - this.foodLost - this.eated <= 0) {
                this.useTimerConditionStore.stopTimer()
                // this.endLvl = true
                this.useLevelConditionStore.endLvl = true
                this.useLevelConditionStore.fail = true
                World.remove(world, foods)
              } else if (
                this.levelData.food.length - this.foodLost - this.eated <
                this.levelData.foodNumberToWin - this.eated
              ) {
                this.useLevelConditionStore.showReloadBtn = true
              }
            }
          }
        }

        // check handlers for obstacles
        for (let obs of obstacles) {
          if ((obs === check.bodyA || obs === check.bodyB) && obstaclesMatch[obs.id]) {
            const sourceObsIndex = obstaclesMatch[obs.id]
            if (this.levelData.obstacles[sourceObsIndex].collisionCallback) {
              const sourceObs = this.levelData.obstacles[sourceObsIndex]
              const visible = sourceObs.collisionCallback.call(sourceObs, event)
              if (!visible) {
                World.remove(world, obs)
              } else if (visible.isObstacleDelay === true) {
                setTimeout(() => {
                  Composite.remove(world, obs)
                }, visible.delayTime)
              } else if (visible.foodStatus === false) {
                Composite.remove(world, visible.food)
                this.$emit('foodLost')

                this.foodLost++
                this.useTimerConditionStore.addPenaltyTimeObject()
                if (
                  this.levelData.food.length - this.foodLost - this.eated <
                  this.levelData.foodNumberToWin - this.eated
                ) {
                  this.useLevelConditionStore.showReloadBtn = true
                }
                if (
                  this.levelData.food.length - this.foodLost - this.eated <=
                  0
                  // this.levelData.foodNumberToWin - this.eated
                ) {
                  this.useTimerConditionStore.stopTimer()
                  // this.endLvl = true
                  this.useLevelConditionStore.endLvl = true
                  this.useLevelConditionStore.fail = true
                  World.remove(world, foods)
                }
              } else {
                // obs.render.sprite.xScale = sourceObs.size[0] * this.width * sourceObs.spriteScale[0]
                // obs.render.sprite.yScale =
                //   sourceObs.size[1] * this.height * sourceObs.spriteScale[1]
                // obs.render.sprite.texture = sourceObs.sprites[sourceObs.currentSprite]
                obs.render.sprite.xScale =
                  ((sourceObs.size[0] * this.width) / this.levelData.defaultImgSize) *
                  sourceObs.spriteScale[0]
                obs.render.sprite.yScale =
                  ((sourceObs.size[0] * this.width) / this.levelData.defaultImgSize) *
                  sourceObs.spriteScale[1]
                // obs.render.sprite.texture = sourceObs.sprites[sourceObs.currentSprite] * sourceObs.spriteScale[1]
                // xScale: (obs.size[0] * this.width) / this.levelData.defaultImgSize,
                //   yScale: (obs.size[0] * this.width) / this.levelData.defaultImgSize,
              }
            }
          }
        }

        // check spawned obstacles
        for (let obs of this.levelData.spawnObjects) {
          for (let spawnedObj_id of obs.spawned) {
            if (
              (spawnedObj_id === check.bodyA.id || spawnedObj_id === check.bodyB.id) &&
              obs.collisionCallback
            ) {
              const visible = obs.collisionCallback.call(obs, event)
              if (!visible) {
                World.remove(world, spawnedObj_id === check.bodyA.id ? check.bodyA : check.bodyB)
              }
            }
          }
        }
      }

      // debugger;
    })

    /**
     * GENERATE FOOD
     */
    let foods = [],
      foodsMatch = {},
      spawnedFood = 0,
      foodSpawnGroup = [...this.levelData.foodSpawnGroup]
    // if (spawnedFood < this.levelData.food.length) {
    //   for (let foodIndex = foodSpawnGroup.shift(); foodIndex > 0; foodIndex--) {
    //     console.log('spawn food')
    //     const food_p = this.levelData.food[spawnedFood]
    //     let food = this.createFood(food_p)
    //     foods.push(food)
    //     foodsMatch[food.id] = spawnedFood++
    //     Composite.add(world, [food])
    //   }
    // }

    /**
     * MAIN GAME LOOP
     */

    let lastCheck__gameResultAnimal = Common.now()

    let lastCheck__foods = {}
    for (const food of foods) {
      lastCheck__foods[food.id] = Common.now()
    }

    let lastCheck__foodSpawn = null, // foodSpawnLoop
      lastCheck__animal = Common.now(),
      lastCheck__obstacles = {}
    for (const obs of obstacles) {
      lastCheck__obstacles[obs.id] = Common.now()
    }

    let lastCheck__spawn = []
    for (const s_object of this.levelData.spawnObjects) {
      lastCheck__spawn.push(Common.now())
    }

    Events.on(engine, 'afterUpdate', (event) => {
      if (!this.useLevelConditionStore.isGameRunnin) return

      // spawn food
      if (
        !this.useLevelConditionStore.endLvl &&
        (lastCheck__foodSpawn === null ||
          (Common.now() - lastCheck__foodSpawn > this.levelData.foodSpawnLoop &&
            spawnedFood < this.levelData.food.length))
      ) {
        const groupLength = foodSpawnGroup.shift()
        const center = Math.floor(groupLength / 2)
        // console.log("center", center)
        // console.log(groupLength)
        for (let foodIndex = 0; foodIndex < groupLength; foodIndex++) {
          // console.log('spawn food')
          const food_p = this.levelData.food[spawnedFood]
          food_p.position[0] =
            Math.random() *
              (this.levelData.foodSpawnZone.x[1] - this.levelData.foodSpawnZone.x[0]) +
            this.levelData.foodSpawnZone.x[0]
          //  food_p.position[0] - 0.1 * (center - foodIndex)
          food_p.position[1] =
            Math.random() *
              (this.levelData.foodSpawnZone.y[1] - this.levelData.foodSpawnZone.y[0]) +
            this.levelData.foodSpawnZone.y[0]
          let food = this.createFood(food_p)
          foods.push(food)
          foodsMatch[food.id] = spawnedFood++

          lastCheck__foodSpawn = Common.now()
          Composite.add(world, [food])
        }
      }

      // spawning objects
      if (!this.useLevelConditionStore.endLvl) {
        for (const so_index in this.levelData.spawnObjects) {
          if (
            Common.now() - lastCheck__spawn[so_index] >
            this.levelData.spawnObjects[so_index].spawnDelay
          ) {
            // delete old particle
            if (
              this.levelData.spawnObjects[so_index].spawned.length >
              this.levelData.spawnObjects[so_index].spawnMax
            ) {
              const deleteId = this.levelData.spawnObjects[so_index].spawned[0]
              let deleteBody = Composite.allBodies(world).filter((body) => body.id === deleteId)
              this.levelData.spawnObjects[so_index].spawned.splice(0, 1)
              World.remove(world, deleteBody)
            }

            let createdObj = this.createObstacle(this.levelData.spawnObjects[so_index])
            this.levelData.spawnObjects[so_index].spawned.push(createdObj.id)

            Composite.add(world, [createdObj])
            lastCheck__spawn[so_index] = Common.now()

            Body.applyForce(
              createdObj,
              { x: createdObj.position.x, y: createdObj.position.y },
              {
                x: this.levelData.spawnObjects[so_index].spawnSpeed[0],
                y: this.levelData.spawnObjects[so_index].spawnSpeed[1]
              }
            )
          }
        }
      }

      // animal
      if (
        this.levelData.animal.mainLoopCallback !== null &&
        Common.now() - lastCheck__animal > this.levelData.animal.mainLoopQuantity
      ) {
        const changed = this.levelData.animal.mainLoopCallback.call(
          this.levelData.animal,
          event,
          animal,
          animalTrigger,
          mouthWals
        )
        if (changed) {
          ;(animal.render.sprite.xScale =
            ((this.levelData.animal.size[0] * this.height) / this.levelData.defaultAnimalImgSize) *
            this.levelData.animal.spriteScale[0]),
            (animal.render.sprite.yScale =
              ((this.levelData.animal.size[1] * this.height) /
                this.levelData.defaultAnimalImgSize) *
              this.levelData.animal.spriteScale[1]),
            (animal.render.sprite.texture =
              this.levelData.animal.sprites[this.levelData.animal.currentSprite])

          Body.scale(
            animalTrigger,
            this.levelData.animal.animalTrigger.scale[0],
            this.levelData.animal.animalTrigger.scale[1]
          )

          // Установка позиции триггера
          Body.setPosition(
            animalTrigger,
            // x position
            {
              x:
                this.width * this.levelData.animal.position[0] +
                ((this.height * this.levelData.animal.size[0]) / 2) *
                  this.levelData.animal.animalTrigger.position[0],
              // y position
              y:
                this.height * this.levelData.animal.position[1] +
                ((this.height * this.levelData.animal.size[1]) / 2) *
                  this.levelData.animal.animalTrigger.position[1]
            }
          )

          // mouthWals обработка от читерства и закрытие рта
          for (const wallIndex in this.levelData.animal.mouthWals) {
            Body.setAngle(mouthWals[wallIndex], this.levelData.animal.mouthWals[wallIndex].angle)
            // console.log(this.levelData.animal.mouthWals[wallIndex].position[0])
            Body.setPosition(
              mouthWals[wallIndex],
              // x position
              {
                // x position
                x:
                  this.width * this.levelData.animal.position[0] +
                  ((this.height * this.levelData.animal.size[0]) / 2) *
                    this.levelData.animal.mouthWals[wallIndex].position[0],
                // y position
                y:
                  this.height * this.levelData.animal.position[1] +
                  ((this.height * this.levelData.animal.size[1]) / 2) *
                    this.levelData.animal.mouthWals[wallIndex].position[1]
              }
            )
          }

          // animal.render.sprite.xScale =
          //   this.width * this.levelData.animal.size[0] * this.levelData.animal.spriteScale[0]
          // animal.render.sprite.yScale =
          //   this.width * this.levelData.animal.size[1] * this.levelData.animal.spriteScale[1]
          // animal.render.sprite.texture =
          //   this.levelData.animal.sprites[this.levelData.animal.currentSprite]
        }

        lastCheck__animal = Common.now()
      }

      // food
      for (let food of foods) {
        const sourceFoodId = foodsMatch[food.id]
        let sourceFood = this.levelData.food[sourceFoodId]
        if (
          sourceFood.mainLoopCallback !== null &&
          Common.now() - lastCheck__foods[food.id] > sourceFood.mainLoopQuantity
        ) {
          const changed = sourceFood.mainLoopCallback.call(sourceFood, event, food)
          if (changed) {
            food.render.sprite.xScale = this.width * sourceFood.size[0] * sourceFood.spriteScale[0]
            food.render.sprite.yScale = this.width * sourceFood.size[1] * sourceFood.spriteScale[1]
            food.render.sprite.texture = sourceFood.sprites[food.currentSprite]
          }

          lastCheck__foods[food.id] = Common.now()
        }

        // check if food is lost
        if (
          food.render.visible === true &&
          (food.position.x < 0 ||
            food.position.x > this.width ||
            food.position.y < 0 ||
            food.position.y > this.height)
        ) {
          this.$emit('foodLost')
          Composite.remove(world, food)
          food.render.visible = false

          this.foodLost++
          this.useTimerConditionStore.addPenaltyTimeObject()
          if (
            this.levelData.food.length - this.foodLost - this.eated <
            this.levelData.foodNumberToWin - this.eated
          ) {
            this.useLevelConditionStore.showReloadBtn = true
          }
          if (
            this.levelData.food.length - this.foodLost - this.eated <=
            0
            // this.levelData.foodNumberToWin - this.eated
          ) {
            this.useTimerConditionStore.stopTimer()
            // this.endLvl = true
            this.useLevelConditionStore.endLvl = true
            this.useLevelConditionStore.fail = true
            World.remove(world, foods)
          }
        }
      }

      // obstacles
      for (let obs of obstacles) {
        if (obstaclesMatch[obs.id]) {
          const sourceObsIndex = obstaclesMatch[obs.id]
          let sourceObs = this.levelData.obstacles[sourceObsIndex]
          if (
            sourceObs.mainLoopCallback &&
            Common.now() - lastCheck__obstacles[obs.id] > sourceObs.mainLoopQuantity
          ) {
            const changed = sourceObs.mainLoopCallback.call(sourceObs, event, obs)
            if (changed) {
              // obs.render.sprite.xScale = sourceObs.size[0] * this.width * sourceObs.spriteScale[0]
              // obs.render.sprite.yScale = sourceObs.size[1] * this.height * sourceObs.spriteScale[1]
              obs.render.sprite.xScale =
                ((sourceObs.size[0] * this.width) / this.levelData.defaultImgSize) *
                sourceObs.spriteScale[0]
              obs.render.sprite.yScale =
                ((sourceObs.size[0] * this.width) / this.levelData.defaultImgSize) *
                sourceObs.spriteScale[1]
              // obs.render.sprite.texture = sourceObs.sprites[sourceObs.currentSprite]
            }

            lastCheck__obstacles[obs.id] = Common.now()
          }
        }
      }

      // game status
      if (
        this.useLevelConditionStore.endLvl &&
        Common.now() - lastCheck__gameResultAnimal > 100 &&
        animal.position.y < this.height * 1.5
      ) {
        Body.setPosition(animal, { x: animal.position.x, y: animal.position.y + 2.5 })
      }

      if (animal.position.y >= this.height * 1.2) {
        this.animalHidden = true
        World.remove(world, animal)
        World.remove(world, mouthWals)
        World.remove(world, animalTrigger)
      }

      // game end animation
      if (
        this.useLevelConditionStore.endLvl &&
        this.useLevelConditionStore.win &&
        this.animalHidden &&
        Common.now() - lastCheck__gameResultAnimal > 10 &&
        winAnimationSprite.position.y >= this.height * this.levelData.win.finalPosition[1]
      ) {
        Body.setPosition(winAnimationSprite, {
          x: winAnimationSprite.position.x,
          y: winAnimationSprite.position.y - 2.5
        })
        lastCheck__gameResultAnimal = Common.now()
      }
      if (
        this.useLevelConditionStore.endLvl &&
        this.useLevelConditionStore.fail &&
        this.animalHidden &&
        Common.now() - lastCheck__gameResultAnimal > 10 &&
        failAnimationSprite.position.y >= this.height * this.levelData.fail.finalPosition[1]
      ) {
        Body.setPosition(failAnimationSprite, {
          x: failAnimationSprite.position.x,
          y: failAnimationSprite.position.y - 2.5
        })
        lastCheck__gameResultAnimal = Common.now()
      }

      // console.log(
      //   lastCheck__gameResultAnimal &&
      //     this.useLevelConditionStore.endLvl &&
      //     Common.now() - lastCheck__gameResultAnimal > 1300 &&
      //     (winAnimationSprite.position.y <= this.height * this.levelData.win.finalPosition[1] || // Координатная проверка анимации
      //       failAnimationSprite.position.y <= this.height * this.levelData.fail.finalPosition[1])
      // )
      if (
        lastCheck__gameResultAnimal &&
        this.useLevelConditionStore.endLvl &&
        Common.now() - lastCheck__gameResultAnimal > 1300 &&
        (winAnimationSprite.position.y <= this.height * this.levelData.win.finalPosition[1] || // Координатная проверка анимации
          failAnimationSprite.position.y <= this.height * this.levelData.fail.finalPosition[1]) // Координатная проверка анимации
      ) {
        // console.log('gameIsOver')
        this.useGameConditionStore.gameIsOver(this.useLevelConditionStore.win || false)
        lastCheck__gameResultAnimal = null
      }
    })

    // add gyro control
    if (typeof window !== 'undefined') {
      let updateGravity = (event) => {
        const gravity = engine.gravity
        const inversion = this.useGyroConditionStore.isNeedReqGyroPermission ? 1 : -1
        // console.log("ori");
        gravity.x = (inversion * event.accelerationIncludingGravity.x) / 7
        gravity.y = (-inversion * event.accelerationIncludingGravity.y) / 7

        // switch (orientation) {
        //   case 0:
        //     gravity.x = Common.clamp(event.rotationRate.gamma, -90, 90) / 90
        //     gravity.y = Common.clamp(event.rotationRate.beta, -90, 90) / 90
        //     break
        //   case 180:
        //     gravity.x = Common.clamp(event.rotationRate.gamma, -90, 90) / 90
        //     gravity.y = Common.clamp(-event.rotationRate.beta, -90, 90) / 90
        //     break
        //   case 90:
        //     gravity.x = Common.clamp(event.rotationRate.beta, -90, 90) / 90
        //     gravity.y = Common.clamp(-event.rotationRate.gamma, -90, 90) / 90
        //     break
        //   case -90:
        //     gravity.x = Common.clamp(-event.rotationRate.beta, -90, 90) / 90
        //     gravity.y = Common.clamp(event.rotationRate.gamma, -90, 90) / 90
        //     break
        // }
      }

      // console.log("DeviceOrientationEvent 22", DeviceOrientationEvent);
      // if (typeof DeviceMotionEvent.requestPermission === 'function') {
      //     console.log("YES");
      //     DeviceOrientationEvent.requestPermission()
      //     .then(state => {
      //         if (state === 'granted') {
      //             window.addEventListener('deviceorientation', updateGravity);
      //         }
      //     })
      //     .catch(err => console.error(err))
      // }

      // window.addEventListener('deviceorientation', updateGravity)
      window.addEventListener('devicemotion', updateGravity)
    }

    // add mouse control
    let mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      })

    Composite.add(world, mouseConstraint)

    // keep the mouse in sync with rendering
    // render.mouse = mouse

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: this.width, y: this.height }
    })

    // console.log('isGameReady')
    this.$nextTick(function () {
      setTimeout(() => {
        this.useLevelConditionStore.isGameMapReady = true
      }, 100)
    })
  },
  methods: {
    preloadTextures(textures) {
      for (var i = 0; i < textures.length; i++) {
        this.preloadedTextures[i] = new Image()
        this.preloadedTextures[i].src = textures[i]
      }
    },
    createFood(food_p) {
      return Bodies.rectangle(
        this.width * food_p.position[0],
        this.height * food_p.position[1],
        this.width * food_p.size[0],
        this.width * food_p.size[1],
        {
          isStatic: false,
          // angle: 0,
          render: {
            sprite: {
              texture: food_p.sprites[food_p.currentSprite],
              // xScale: this.width * food_p.size[0] * food_p.spriteScale[0],
              // yScale: this.width * food_p.size[1] * food_p.spriteScale[1]

              xScale:
                ((food_p.size[0] * this.width) / this.levelData.defaultFoodImgSize) *
                food_p.spriteScale[0],
              yScale:
                ((food_p.size[0] * this.width) / this.levelData.defaultFoodImgSize) *
                food_p.spriteScale[1]
            }
          }
        }
      )
    },
    createObstacle(obs) {
      let createdObs = null
      if (obs.isCircle) {
        // console.log("(this.width / this.height) * obs.size[0]", (this.width / this.height) * obs.size[0]);
        createdObs = Bodies.circle(
          obs.position[0] * this.width,
          obs.position[1] * this.height,
          this.width * obs.size[0],
          {
            isStatic: obs.isStatic,
            collisionFilter: {
              category: 0x0002
            },
            render: {
              sprite: {
                texture: obs.sprites[obs.currentSprite],
                xScale:
                  ((obs.size[0] * this.width) / this.levelData.defaultImgSize) * obs.spriteScale[0],
                yScale:
                  ((obs.size[0] * this.width) / this.levelData.defaultImgSize) * obs.spriteScale[1]
                // yScale: (this.width / this.height) * obs.size[0] * obs.spriteScale[0]
              }
            }
          }
        )
      } else if (obs.isTrapezoid) {
        createdObs = Bodies.trapezoid(
          obs.position[0] * this.width,
          obs.position[1] * this.height,
          obs.size[0] * this.width,
          obs.size[1] * this.height,
          obs.slope,
          {
            isStatic: obs.isStatic,
            collisionFilter: {
              mask: 0x0001
            },
            render: {
              sprite: {
                texture: obs.sprites[obs.currentSprite],
                xScale:
                  ((obs.size[0] * this.width) / this.levelData.defaultImgSize) * obs.spriteScale[0],
                yScale:
                  ((obs.size[0] * this.width) / this.levelData.defaultImgSize) * obs.spriteScale[1],
                yOffset: (-obs.size[1] * this.height) / (this.levelData.defaultImgSize * 2)
                // yScale: (this.width / this.height) * obs.size[0] * obs.spriteScale[0]
              }
            }
          }
        )
        // console.log( "xScale: ", (this.width / this.height) * obs.size[0] * obs.spriteScale[0],
        //         "yScale: ", (this.width / this.height) * obs.size[0] * obs.spriteScale[0],
        //         "yOffset: ", -1.5*(this.width / this.height) * obs.size[0] * obs.spriteScale[0])
      } else if (obs.isCombined) {
        createdObs = []
        createdObs.push(
          Bodies.trapezoid(
            obs.position[0] * this.width,
            obs.position[1] * this.height,
            obs.size[0] * this.width,
            obs.size[1] * this.height,
            obs.slope,
            {
              isStatic: obs.isStatic,
              render: {
                sprite: {
                  texture: obs.sprites[obs.currentSprite],
                  xScale: (obs.size[0] * this.width) / this.levelData.defaultImgSize,
                  yScale: (obs.size[0] * this.width) / this.levelData.defaultImgSize
                  // yOffset: (obs.size[1] * this.width) / (this.levelData.defaultImgSize * 2)
                  // yScale: (this.width / this.height) * obs.size[0] * obs.spriteScale[0]
                }
              }
            }
          )
        )
        createdObs.push(
          Bodies.trapezoid(
            obs.position[0] * this.width - (obs.size[0] * this.width * obs.slope) / 2,
            obs.position[1] * this.height - (obs.size[1] * this.height) / 2,
            (obs.size[0] * this.width) / 10,
            obs.size[1] * this.height,
            0.8,
            {
              isStatic: obs.isStatic,
              render: {
                opacity: 0
              }
            }
          )
        )
        createdObs.push(
          Bodies.trapezoid(
            obs.position[0] * this.width + ((obs.size[0] * this.width) / 2) * obs.slope,
            obs.position[1] * this.height - (obs.size[1] * this.height) / 2,
            (obs.size[0] * this.width) / 10,
            obs.size[1] * this.height,
            0.8,
            {
              isStatic: obs.isStatic,
              render: {
                opacity: 0
              }
            }
          )
        )
        createdObs.push(
          Bodies.trapezoid(
            obs.position[0] * this.width,
            obs.position[1] * this.height - (obs.size[1] * this.height) / 2,
            (obs.size[0] * this.width) / 10,
            obs.size[1] * this.height,
            0.8,
            {
              isStatic: obs.isStatic,
              render: {
                opacity: 0
              }
            }
          )
        )
        //Composite.add(world, [Bodies.trapezoid(200, 220, 260, 30, .5, {isStatic:true}),])
        // Composite.add(world, [Bodies.trapezoid(135, 200, 30, 30, .8, {isStatic:true}),])
        // Composite.add(world, [Bodies.trapezoid(200, 200, 30, 30, .8, {isStatic:true}),])
        // Composite.add(world, [Bodies.trapezoid(265, 200, 30, 30, .8, {isStatic:true}),])
      } else {
        createdObs = Bodies.rectangle(
          obs.position[0] * this.width,
          obs.position[1] * this.height,
          obs.size[0] * this.width,
          obs.size[1] * this.height,
          {
            isStatic: obs.isStatic,
            render: {
              opacity: 1,
              sprite: {
                texture: obs.sprites[obs.currentSprite],
                // xScale: (obs.size[0] * this.width) / this.levelData.defaultImgSize,
                // yScale: (obs.size[0] * this.width) / this.levelData.defaultImgSize
                xScale:
                  ((obs.size[0] * this.width) / this.levelData.defaultImgSize) * obs.spriteScale[0],
                yScale:
                  ((obs.size[0] * this.width) / this.levelData.defaultImgSize) * obs.spriteScale[1]
                //yOffset: (-obs.size[1] * this.height) / (this.levelData.defaultImgSize * 2)
              }
            }
          }
        )
      }

      return createdObs
    }
  },
  beforeUnmount() {
    World.clear(this.world)
    Engine.clear(this.engine)
    Render.stop(this.render)
    Runner.stop(this.runner)
    this.render.canvas.remove()
    this.render.canvas = null
    this.render.context = null
    this.render.textures = {}
  }
}
</script>
<style>
#game-field-bg {
  position: fixed;

  left: 0;
  top: 0;
  z-index: -1;

  width: 100vw;
  height: 100vh;
}
#game-field {
  display: flex;
  background: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}
#game-field canvas {
  max-width: 100%;
  max-height: 100%;
}
</style>
