import { ref } from 'vue'
import { defineStore } from 'pinia'
import fetchData from '@/utils/fetch';

import { useLevelCondition } from './useLevelCondition';
import { useUserCondition } from './useUserCondition';
import { useTimerCondition } from './useTimerCondition';
import { useGameStarCounterCondition } from './useGameStarCounterCondition';

export const useGameCondition = defineStore('useGameCondition', () => {

    const levelCondition = useLevelCondition();
    const userCondition = useUserCondition();
    const timerCondition = useTimerCondition();
    const gameStarCounterCondition = useGameStarCounterCondition();

    /*
        * Основные состояния игры
    */
    const currentLevel = ref<number>(1);
    const isShowGameResult = ref<boolean>(false);
    const isShowRegistration = ref(false);
    const isShowLevelTutorial = ref(false);

    // function setShowLevelTutorial(status:boolean) {
    //     isShowGameResult.value = status;
    // }

    function gameIsOver(status: boolean) {
        levelCondition.setLevelStatus(status);
        if (!userCondition.isUserRegistrationRedy) {
            showRegistration();
            levelCondition.finishLevel();
            levelCondition.stopGame();
        } else {
            setEndtLvl().then(() => {
                isShowGameResult.value = true;
                levelCondition.finishLevel();
                levelCondition.stopGame();
            });
        }
        // TODO: сделать отдельный метод зануления уровня
    }
    function restartLevel() {
        levelCondition.resetLevelStatus();
        timerCondition.clearTimer();
        gameStarCounterCondition.cleaGameCounter();
        //isShowGameResult.value = false;
    }
    function nextLevel() {
        timerCondition.clearTimer();
        gameStarCounterCondition.cleaGameCounter();
        levelCondition.resetLevelStatus();
        currentLevel.value = currentLevel.value + 1 > 4 ? 1 : currentLevel.value + 1
        // isShowGameResult.value = false;
    }
    function setStartLvl() {
        return fetchData(
            '/api/start-level',
            'POST',
            userCondition.fingerprint,
            {
                "fingerprint": userCondition.fingerprint,
                "level_number": currentLevel.value
            }
        );
    }
    function setEndtLvl() {
        // console.log('levelCondition.levelStatus', levelCondition.levelStatus)
        return fetchData(
            '/api/end-level',
            'POST',
            userCondition.fingerprint,
            {
                "fingerprint": userCondition.fingerprint,
                "level_number": currentLevel.value,
                "play_time": timerCondition.getSeconds,
                "is_success": levelCondition.levelStatus
            }
        );
    }

    function showRegistration() {
        isShowRegistration.value = true;
    }

    function closeRegistration() {
        isShowGameResult.value = true;
        setTimeout(() => {
            isShowRegistration.value = false;
        }, 1)
    }

    function closeResult() {
        isShowGameResult.value = false;
    }

    return {
        // Игра
        currentLevel,
        isShowGameResult,
        isShowRegistration,
        isShowLevelTutorial,
        setStartLvl,
        setEndtLvl,
        gameIsOver,
        restartLevel,
        nextLevel,
        showRegistration,
        closeRegistration,
        closeResult,
        // setShowLevelTutorial,
    }
})
