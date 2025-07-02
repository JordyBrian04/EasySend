import axios from "axios";
import { deleteConstante, getConstante, saveContante } from "./AsyncStorage";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token:any) => {
  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000; // convert to milliseconds
  } catch (e) {
    return true; // si le token est corrompu
  }
};

// const BASE_URL = "http://localhost:3000/"
// const BASE_URL = "http://192.168.1.8:3000/"
const BASE_URL = "https://easysend-api-30uy.onrender.com/"

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

let isRefreshing = false;
let failedQueue:any = [];

const processQueue = (error:any, token = null) => {
  failedQueue.forEach((prom:any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
    async config => {
      let token = await getConstante('token');
      // let refreshToken = await getConstante("refresh_token");
      console.log('token--------', token);

      // if (token && isTokenExpired(token)) {
      //   // Token expiré → demander un nouveau token
      //   try {
      //     const res = await axios.post(`api/auth/refresh-token`, {
      //       refreshToken: refreshToken,
      //     });
  
      //     const newToken = res.data.accessToken;
      //     await saveContante("token", JSON.stringify(newToken));
      //     token = newToken;
      //   } catch (err) {
      //     console.error("Erreur lors du refresh token", err);
      //     // tu peux rediriger vers la page de login ici si besoin
      //   }
      // }


      if (token) {
        // config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Si c'est une erreur 401 ET qu'on n'a pas déjà tenté un refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getConstante('refreshToken');
        if (!refreshToken) throw new Error('Refresh token manquant');

        const response = await axios.post(`${BASE_URL}api/auth/refresh-token`, {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        });

        const newToken = response.data.token;
        await saveContante('token', newToken);

        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        processQueue(null, newToken);

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await deleteConstante('token');
        await deleteConstante('refreshToken');
        // → tu peux rediriger vers la page de login ici
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const login = async (data: any) => {
  // console.log(data)
  return axiosInstance.post('api/auth/login', data);
}

export const inscription = async (data:any) => {
  // console.log(data)
  return axiosInstance.post('api/auth/createUser', data);
}

export const verifyCode = async (data:any) => {
  // console.log('data', data)
  return axiosInstance.post('api/auth/verificationOTP', data);
}

export const resendCode = async (data:any) => {
  return axiosInstance.post('api/auth/generateOTP', data);
}

export const getUser = async (data:any) => {
  return axiosInstance.post('api/auth/profile', data);
}

export const getPub = async () => {
  return axiosInstance.get('api/auth/pub');
}

export const InsertTransaction = async (data:any) => {
  return axiosInstance.post('api/auth/insertTransaction', data);
}

export const getUserTransaction = async () => {
  const user = await getConstante("user")
  // console.log(user)
  const response = await axiosInstance.get(`api/auth/userTransaction`, {
    headers: {
      'x-user-id': `${user.id}`,
    },
  });
  return response;
}

export const updateTransaction = async (data:any) => {
  return axiosInstance.post('api/auth/updateTransaction', data);
}