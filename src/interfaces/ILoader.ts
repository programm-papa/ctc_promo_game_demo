export default interface ILoader {
    loaderType: string;
    required: boolean;
    controll: boolean;
    class: string;
    lottieUrl: any;
    speed: number;
    color: string | null;
}