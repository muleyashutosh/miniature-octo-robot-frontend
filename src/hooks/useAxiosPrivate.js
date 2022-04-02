import {axiosPrivate} from '../api/axios'
import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import useAuth from './useAuth'

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const {auth} = useAuth();

  useEffect(() => {

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response, 
      async(err) => {
        const prevRequest = err?.config;
        if ((err?.respose.status === 403 || err?.respose.status === 401) && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          localStorage.setItem("app_access_token", newAccessToken)
          return axiosPrivate(prevRequest)
        }
        return Promise.reject(err) 
      }
      
    )

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
    }
    
  }, [auth, refresh])

  return axiosPrivate;
}

export default useAxiosPrivate