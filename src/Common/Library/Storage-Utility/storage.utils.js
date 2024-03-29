
/********************************************************
 * Provides Methods for Storing data which is persistent
 * Currently supports two engines
 * (localStorage, React-Native's AsyncStorge)
 * 
 * to use this package for AsyncStorage one has to initialize 
 * configuration 
 * 
 * Ex - InitializeStorageUtils({
 *      AsyncStorage, storeName, engine
 * })
 *******************************************************/

let STORAGE_ENGINE_NAME;

let AsyncStorage;
let volatile = {};
let nonVolatile = {};
const ENGINES = ['AsyncStorage', 'localStorage']

let env = {
    STORE_NAME: '', STORAGE_ENGINE_NAME: ''
}

export function InitializeStorageUtils({ engine, storeName, engineName }) {
    env = {
        STORE_NAME: storeName || 'STORAGE_UTILITY',
        STORAGE_ENGINE_NAME: engineName || 'localStorage',
        ENGINE: engine || ((window && window.localStorage) ? window.localStorage : 1 && console.warn('Could not find Storage Engine. Cant use storage apis'))
    }
    setDefault();
}

async function setDefault() {
    let vol, nonVol;
    switch (env.STORAGE_ENGINE_NAME) {
        case 'AsyncStorage':
            Promise.all([storageUtils({ method: 'getItem', key: 'volatile' }), storageUtils({ method: 'getItem', key: 'nonVolatile' })])
                .then(res => {
                    [vol, nonVol] = [res[0], res[1]];
                    assingValuesToRespectiveStore(vol, nonVol);
                });
            break;

        case 'localStorage':
            [vol, nonVol] = [localStorage.volatile, localStorage.nonVolatile];
            assingValuesToRespectiveStore(vol, nonVol);
            break;
    }
}

function assingValuesToRespectiveStore(vol, nonVol) {
    try {
        vol = vol ? JSON.parse(vol) : {};
        nonVol = nonVol ? JSON.parse(nonVol) : {};
        volatile = { ...volatile, ...vol };
        nonVolatile = { ...nonVolatile, ...nonVol };
    } catch (e) { console.error(e); }
}

/**
 * Sets item in localStorage under 'volatile' keyword
 * @param  {string} key
 * @param  {any} payload 
 */
export function SetItem(key, payload, isNonVolatile = false) {
    const store = isNonVolatile ? nonVolatile : volatile;
    if (IsUndefined(payload)) {
        delete store[key];
    }
    else {
        store[key] = payload;
    }

    storageUtils({ method: 'setItem', key: isNonVolatile ? 'nonVolatile' : 'volatile', payload: JSON.stringify(store) });
}

/**
 * Returns data for particular key
 * @param  {string} key 
 * @param  {boolean} nonVolatile - (optional)
 */
export function GetItem(key, isNonVolatile = false) {
    if (!key) {
        return null;
    }

    if (isNonVolatile) {
        return nonVolatile[key];
    }
    return volatile[key];

}

/**
 * Same as SetItem, only difference is nonVolatile item is not wiped off even after logout
 * @param  {string} key
 * @param  {any} payload
 */
export function SetNonVolatileItem(key, payload) {
    if (IsUndefined(payload))
        delete nonVolatile[key];
    else
        nonVolatile[key] = payload;

    storageUtils({ method: 'setItem', key: 'nonVolatile', payload: JSON.stringify(nonVolatile) }, true);
}

/**
 * Removes localstorage value
 * based on parameter, can remove particular key or whole volatile or nonVolatile storage from localStorage
 * @param  {boolean} clearLocalStorage - (optional)
 * @param  {boolean} clearNonVolatileStorage} - (optional)
 */
export function RemoveItem({ key, clearVolatileStorage = true, clearNonVolatileStorage = false }) {
    if (clearVolatileStorage) {
        volatile = {};
        key = 'volatile';
    }
    if (clearNonVolatileStorage) {
        nonVolatile = {};
        key = 'nonVolatile';
    }
    storageUtils({ method: 'removeItem', key });
}

function storageUtils({ method, key, payload }, shouldParse) {
    try {
        payload = shouldParse ? JSON.parse(payload) : payload;
        return env.ENGINE[method](resolveKey(key), payload);
    } catch (e) {
        console.warn('Something went wrong with storage utils');
        console.error(e);
    }
}


export function resolveKey(key) {
    if (IsUndefined(key)) {
        return key;
    }
    return env.STORAGE_ENGINE_NAME == 'AsyncStorage' ? `${env.STORE_NAME}:${key}` : key;
}

function IsUndefined(value) {
    return typeof value == 'undefined';
    // return value === '';
}
