import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  kakaoId: string
  nickname: string
  profileImage?: string
}

interface AuthContextType {
  user: User | null
  login: (kakaoUser: any) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드시 저장된 사용자 정보 확인
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (kakaoUser: any) => {
    const userData: User = {
      id: kakaoUser.id.toString(),
      kakaoId: kakaoUser.id.toString(),
      nickname: kakaoUser.properties?.nickname || '사용자',
      profileImage: kakaoUser.properties?.profile_image
    }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    // 카카오 로그아웃
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.logout()
    }
  }

  const value = {
    user,
    login,
    logout,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any
  }
}
