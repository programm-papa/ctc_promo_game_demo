// Логика хранилища таймера для доступа к данным таймера из всего приложения
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

interface IPenaltyTimeObj {
    id: number,
}

export const useTimerCondition = defineStore('useTimerCondition', () => {
    // Запущен ли таймер
    const isTimerStart = ref(false);
    // Интервал отсчета таймера
    const timerInterval = ref<any>();
    // Секунды
    const timerSeconds = ref(0);
    // Массив объектов для вывода штрафных секунд
    const listPenaltyTime = ref<IPenaltyTimeObj[]>([]);
    // Штрафные секунды
    const timerSecondsPenalty = ref(0);
    // Окраска таймера
    const isTimerRed = ref(false);
    const isTimerRedTimeout = ref(0);
    // Строка в таймер
    const timerSecondsValueStr = computed(() => {
        const seconds = timerSeconds.value + timerSecondsPenalty.value
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;


        const hDisplay = hours > 0 ? hours + ':' : ''
        const mDisplay = minutes < 10 ? '0' + minutes : minutes
        const sDisplay = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds

        return hDisplay + mDisplay + ':' + sDisplay
    });

    const getSeconds = computed(() => {
        return timerSeconds.value + timerSecondsPenalty.value;
    })

    function timerStep() {
        if (isTimerStart.value) {
            timerSeconds.value++;
        }
    }
    function startTimer() {
        isTimerStart.value = true;
        timerInterval.value = setInterval(timerStep, 1000)
    }
    function stopTimer() {
        isTimerStart.value = false;
        clearInterval(timerInterval.value)
    }
    function clearTimer() {
        isTimerStart.value = false;
        stopTimer();
        timerInterval.value = null;
        listPenaltyTime.value = [];
        timerSecondsPenalty.value = 0;
        timerSeconds.value = 0;
    }

    // function getSeconds() {
    //     return timerSeconds.value + timerSecondsPenalty.value;
    // }

    // Добавить объект штрафного времени
    function addPenaltyTimeObject() {
        listPenaltyTime.value.push({
            id: Date.now(),
        })
    }
    // Удалить объект штрафного времени + добавить 1с к времени
    function removePenaltyTimeObject(idToRemove: number) {
        const indexToRemove = listPenaltyTime.value.findIndex(item => item.id === idToRemove);
        if (indexToRemove !== -1) {
            listPenaltyTime.value.splice(indexToRemove, 1);
            timerSecondsPenalty.value++;
            isTimerRed.value = true;
            clearTimeout(isTimerRedTimeout.value);
            isTimerRedTimeout.value = setInterval(() => {
                isTimerRed.value = false;
            }, 1000)

        }
    }

    return {
        timerSecondsValueStr,
        isTimerStart,
        isTimerRed,
        listPenaltyTime,
        getSeconds,
        startTimer,
        stopTimer,
        addPenaltyTimeObject,
        removePenaltyTimeObject,
        clearTimer,
    }
})