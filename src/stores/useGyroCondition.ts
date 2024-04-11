

import { defineStore } from "pinia";
import { ref } from "vue";

export const useGyroCondition = defineStore('useGyroCondition', () => {
    /*
       * СОСТОЯНИЕ ГИРОСКОПА
    */
    const isDeviseHasGyro = ref<boolean>(true);
    const isNeedReqGyroPermission = ref<boolean>(typeof DeviceMotionEvent !== 'undefined' &&
        typeof (DeviceMotionEvent as any).requestPermission === 'function');
    const resGyroPermission = ref<boolean | null>(!(sessionStorage.getItem('resGyroPermission') === 'false') && null);

    // Кострыль определения гироскопа на устройстве
    window.addEventListener("devicemotion", checkDevicemotionEvent);
    function checkDevicemotionEvent(event: any) {
        if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma || event.accelerationIncludingGravity.x || event.accelerationIncludingGravity.y) {
            isDeviseHasGyro.value = true;
            window.removeEventListener('devicemotion', checkDevicemotionEvent);
        }
    }
    // function(event){
    //     if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
    //         gyroPresent = true;
    // }
    // Кострыль определения гироскопа на устройстве

    return {
        isDeviseHasGyro,
        isNeedReqGyroPermission,
        resGyroPermission
    }
})
