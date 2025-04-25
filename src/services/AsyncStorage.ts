import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeNumCompte = async (course: any) => {
  try {
    //console.log('course', course);
    await AsyncStorage.setItem("numero", JSON.stringify(course));
  } catch (error) {
    console.log("[storeNumCompte] error", error);
  }
};

export const storeUserDatas = async (course: any) => {
  try {
    //console.log('course', course);
    await AsyncStorage.setItem("user", JSON.stringify(course));
  } catch (error) {
    console.log("[storeUserDatas] error", error);
  }
};

export const getUserDatas = async () => {
  try {
    let userData = await AsyncStorage.getItem("user");
    const data = JSON.parse(userData as string);
    return data;
  } catch (error) {}
};

export const getNumCompte = async () => {
  try {
    let userData = await AsyncStorage.getItem("numero");
    const data = JSON.parse(userData as string);
    return data;
  } catch (error) {}
};

export const storeData = async (data:any) => {
  try {
      await AsyncStorage.setItem("data", JSON.stringify(data))
  } catch (error) {
      console.log('[storeReseau] error', error);
  }
}

export const getData = async () => {
  try {

      let contact:any = await AsyncStorage.getItem('data');
      const data = JSON.parse(contact);
      return data;

  } catch (error) {
      console.log('[storeReseau] error', error);
  }
}

export const storeContact = async (value:any) => {
  try {
      await AsyncStorage.setItem("contact", JSON.stringify(value))
  } catch (error) {
      console.log('[storeContact] error', error);
  }
}

export const getContact = async () => {
  try {
      let contact:any = await AsyncStorage.getItem('contact');
      const data = JSON.parse(contact);
      return data;
  } catch (error) {}
}

// export const getUser = async (isConnected:boolean) => {
//   try {
//     let userData:any
//     if (isConnected) {
//       userData = db.select().from(utilisateur)
//     } else {
//       return null;
//     }
//     // let userData = await AsyncStorage.getItem("user");
//     const data = JSON.parse(userData as string);
//     return data;
//   } catch (error) {}
// };
