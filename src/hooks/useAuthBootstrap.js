import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentUser } from '../features/auth/authSlice'

export function useAuthBootstrap() {
  const dispatch = useDispatch()
  const { token, initialized, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token && !initialized && !user) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, initialized, token, user])
}
