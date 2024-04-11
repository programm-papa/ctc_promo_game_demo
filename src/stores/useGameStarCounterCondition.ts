import { defineStore } from "pinia";
import { ref } from "vue";

import { useLevelCondition } from "./useLevelCondition";
import { useTimerCondition } from "./useTimerCondition";
import { useGameCondition } from "./useGameCondition";
import { useUserCondition } from "./useUserCondition";
import { usePreloaderCondition } from "./usePreloaderCondition";

export const useGameStarCounterCondition = defineStore('useGameStarCounterCondition', () => {
    const levelCondition = useLevelCondition();
    const timerCondition = useTimerCondition();
    const gameCondition = useGameCondition();
    const userCondition = useUserCondition();
    const preloaderCondition = usePreloaderCondition();

    // Стартовый отсчет
    const startCounterValue = ref(3);

    // Запуск отсчета
    function startGameCounter() {
        if (gameCondition.isShowGameResult) {
            gameCondition.closeResult();
        }
        if (!preloaderCondition.isTutorialCompleted) { //!preloaderCondition.isTutorialCompleted
            gameCondition.isShowLevelTutorial = true;
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    gameCondition.isShowLevelTutorial = false;
                    resolve('');
                }, 2800);
            }).then(() => {
                preloaderCondition.isTutorialCompleted = true;
                nextGameCounterStep();
            })
        } else {
            nextGameCounterStep();
        }

    }
    // Шаг отсчета перед началом игры
    function nextGameCounterStep() {
        // console.log('nextGameCounterStep');
        if (levelCondition.isReadyToStartLevel && startCounterValue.value > 0) {
            setTimeout(() => {
                startCounterValue.value--;
                nextGameCounterStep();
            }, 1000);
        } else if (startCounterValue.value <= 0) {
            levelCondition.startGameRunnin();
            timerCondition.startTimer();
            userCondition.isUserRegistrationRedy && gameCondition.setStartLvl();
        }
    }

    function cleaGameCounter() {
        startCounterValue.value = 3
    }

    return {
        startCounterValue,
        startGameCounter,
        cleaGameCounter,
    }
})
