import fetchData from "@/utils/fetch";
import { defineStore } from "pinia";
import { ref } from "vue";

// Другие хранилища
import { useGameCondition } from "./useGameCondition";


export const useUserCondition = defineStore('useUserCondition', () => {
    //объявление хранилища
    const gameCondition = useGameCondition();

    const fingerprint = ref('');
    const isUserRegistrationRedy = ref(false);
   

    function loadUserData() {
        fetchData(
            '/api/get-completed-levels',
            'GET',
            fingerprint.value,
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error()
                }
                return response.json()

            }).then((responseObject) => {
                if (!responseObject.success) {
                    throw new Error()
                }
                gameCondition.currentLevel = getCurentLvl(responseObject.data)
                isUserRegistrationRedy.value = true;
            })
            .catch((err) => {
                isUserRegistrationRedy.value = false;
                gameCondition.currentLevel = 1;
            })
    }

    function getCurentLvl(respDataObj: Record<number, boolean>) {
        let lastLvl = 1;
        if(!Object.keys(respDataObj).length) return lastLvl;
        for (const key in respDataObj) {
            if (respDataObj[key] === false) {
                return parseInt(key);
            } else {
                lastLvl = parseInt(key);
            }
        }
        return lastLvl === 4 ? 4 : lastLvl + 1; // Если нет значений, тогда дефолтный уровень 1
        //TODO закольцевать уровни по кругу с корректной логикой

    }

    return {
        fingerprint,
        isUserRegistrationRedy,
        loadUserData,
    }
})