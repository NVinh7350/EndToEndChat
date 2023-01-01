import AsyncStorage from "@react-native-async-storage/async-storage";

export const keys = {
    uuid: 'uuid',
    currentKey: 'currentKey'
};

// const setAsyncStorage = async (key, item) => {
//     try {
//         await AsyncStorage.setItem(key, item);
//     } catch (error) {
//         console.log(error);
//     }
// };

// const getAsyncStorage = async (key) => {
//     try {
//         const value = await AsyncStorage.getItem(key);
//         if(value) {
//             return value;
//         } else {
//             return null;
//         }

//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// };

const clearAsyncStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log(error)
    }
};
const getAsyncStorage = async (key) =>
{
    console.log('what')
  try
  {
    let store = "";
    let numberOfParts = await AsyncStorage.getItem(key);
    if(typeof(numberOfParts) === 'undefined' || numberOfParts === null)
      return null;
    else
      numberOfParts = parseInt(numberOfParts);
    for (let i = 0; i < numberOfParts; i++) { store += await AsyncStorage.getItem(key + i); }
    if(store === "")
      return null;
    return JSON.parse(store);
  }
  catch (error)
  {
    console.log("Could not get [" + key + "] from store.");
    console.log(error);
    return null;
  }
};

const setAsyncStorage = async (key, data) =>
{
    console.log('what')
  try
  {
    const store = JSON.stringify(data).match(/.{1,1000000}/g);
    store.forEach((part, index) => { AsyncStorage.setItem((key + index), part); });
    AsyncStorage.setItem(key, ("" + store.length));
  }
  catch (error)
  {
    console.log("Could not save store : ");
    console.log(error.message);
  }
};

// const clearAsyncStorage = async (key) =>
// {
//   try
//   {
//     console.log("Clearing store for [" + key + "]");
//     let numberOfParts = await AsyncStorage.getItem(key);
//     if(typeof(numberOfParts) !== 'undefined' && numberOfParts !== null)
//     {
//       numberOfParts = parseInt(numberOfParts);
//       for (let i = 0; i < numberOfParts; i++) { AsyncStorage.removeItem(key + i); }
//       AsyncStorage.removeItem(key);
//     }
//   }
//   catch (error)
//   {
//     console.log("Could not clear store : ");
//     console.log(error.message);
//   }
// };

const getStore = async (key) =>
{
  try
  {
    let store = "";
    let numberOfParts = await AsyncStorage.getItem(key);
    if(typeof(numberOfParts) === 'undefined' || numberOfParts === null)
      return null;
    else
      numberOfParts = parseInt(numberOfParts);
    for (let i = 0; i < numberOfParts; i++) { store += await AsyncStorage.getItem(key + i); }
    if(store === "")
      return null;
    return JSON.parse(store);
  }
  catch (error)
  {
    console.log("Could not get [" + key + "] from store.");
    console.log(error);
    return null;
  }
};

const saveStore = async (key, data) =>
{
  try
  {
    const store = JSON.stringify(data).match(/.{1,1000000}/g);
    store.forEach((part, index) => { AsyncStorage.setItem((key + index), part); });
    AsyncStorage.setItem(key, ("" + store.length));
  }
  catch (error)
  {
    console.log("Could not save store : ");
    console.log(error.message);
  }
};

const clearStore = async (key) =>
{
  try
  {
    console.log("Clearing store for [" + key + "]");
    let numberOfParts = await AsyncStorage.getItem(key);
    if(typeof(numberOfParts) !== 'undefined' && numberOfParts !== null)
    {
      numberOfParts = parseInt(numberOfParts);
      for (let i = 0; i < numberOfParts; i++) { AsyncStorage.removeItem(key + i); }
      AsyncStorage.removeItem(key);
    }
  }
  catch (error)
  {
    console.log("Could not clear store : ");
    console.log(error.message);
  }
};

export {setAsyncStorage, getAsyncStorage, clearAsyncStorage, getStore, saveStore, clearStore}