type Method = 'POST' | 'GET';



export default async function fetchData(path: string, method: Method, fingerprint: string, dataObj?: Record<string, any>, levelNumber?:number, count?:number) {
    let fullPatch = import.meta.env.VITE_API_URL + path;
    const requestOptions: Record<string, any> = {
        'method': method,
        'headers': {
            // Добавляем необходимые заголовки
            'Content-type': 'application/json',
            'Accept': 'application/json',
        },
    }
    if (method === "POST") {
        requestOptions['body'] = JSON.stringify(dataObj)
    } else {
        const params = '?fingerprint=' + fingerprint;
        fullPatch = fullPatch + params;
        if(levelNumber) {
            fullPatch = fullPatch + '&level_number=' + levelNumber;
        }
        if(count) {
            fullPatch = fullPatch + '&count=' + count;
        }
    }

    return fetch(fullPatch, requestOptions);
}


