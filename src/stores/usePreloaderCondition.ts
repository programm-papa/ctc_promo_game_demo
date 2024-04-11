import { defineStore } from "pinia";
import { ref } from "vue";
// Очередь
import Queue from '@/classes/queue/Queue';
// Интерфейс объекта лоадера
import type ILoader from '@/interfaces/ILoader';
// Импорт видео для передачи url в очередь
// import FirstLoaderUrl from '@/assets/loaders/FirstLoader.mp4';
// import DogLoaderUrl from '@/assets/loaders/DogLoader.mp4';
// import TutorialLoaderUrl from '@/assets/loaders/TutorialLoader.mp4';

import FirstLoader from '@/assets/loaders/FirstLoader.json'
import SecondLoader from '@/assets/loaders/SecondLoader.json'
import TutorialLoader from '@/assets/loaders/TutorialLoader.json'

export const usePreloaderCondition = defineStore('usePreloaderCondition', () => {

    /*
       * СОСТОЯНИЕ ПРЕЛОАДЕРА
   */
    // Показывать прелоадер
    const isShowPreloader = ref(true);
    // Готов к закрытию
    const isFinishPreloader = ref(true);
    // Список доступных вариантов прелоадера
    const listLoaderTypes: ILoader[] = [
        {
            loaderType: 'FirstLoader',
            required: true,
            controll: false,
            class: 'loader-first',
            lottieUrl: FirstLoader,
            speed: 3,
            color: null,
        },
        // {
        //     loaderType: 'DogLoader',
        //     required: true,
        //     controll: true,
        //     class: 'loader-dog',
        //     lottieUrl: SecondLoader,
        //     speed: 2,
        //     color: 'black',
        // },
        // {
        //     loaderType: 'TutorialLoader',
        //     required: true,
        //     controll: true,
        //     class: 'loader-tutorial',
        //     lottieUrl: TutorialLoader,
        //     speed: 1,
        //     color: 'black',
        // }
    ];
    // Очередь лоадеров для последовательного запуска
    const queueLoadersTypes = new Queue(listLoaderTypes)
    // Текущий прелоадер
    const currentLoader = ref<ILoader | null>(getNextLoader())

    // Проверка наличия свойства "isTutorialCompleted"
    const isTutorialCompleted = ref(!!localStorage.getItem('isTutorialCompleted') || localStorage.setItem('isTutorialCompleted', "true") || false)
    // Получение следующего лоадера
    function getNextLoader(): ILoader | null {
        return queueLoadersTypes.next();
    }
    // Запуск следующего лоадера c проверкой на доступность завершения работы прелоадера
    function setNextLoader() {
        const newLoader = getNextLoader();
        // Проверка наличия следующего лоадера
        if (newLoader) {
            currentLoader.value = newLoader;
            if (isFinishPreloader.value && currentLoader.value.required && isTutorialCompleted.value) {
                currentLoader.value = newLoader;
            } else if (!isFinishPreloader.value || !isTutorialCompleted.value) {
                currentLoader.value = newLoader;
            } else {
                setNextLoader();
            }
        } else {
            // isTutorialCompleted.value = true;
            isShowPreloader.value = false
        }
    };
    // Установить прелоадеру статус "готов к закрытию" 
    // TODO: Данный метод будет вызван при загрузке страницы после получения ответа о уровнях с бека 
    function setFinishPreloader() {
        isFinishPreloader.value = true;
    }

    return {
        isShowPreloader,
        listLoaderTypes,
        currentLoader,
        isFinishPreloader,
        isTutorialCompleted,
        setNextLoader,
        setFinishPreloader,
    }
})