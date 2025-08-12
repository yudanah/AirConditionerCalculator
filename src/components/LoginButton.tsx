import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const LoginButton: React.FC = () => {
  const { user, login, logout } = useAuth()

  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      alert('카카오 SDK가 로드되지 않았습니다.')
      return
    }

    window.Kakao.Auth.login({
      success: (authObj: any) => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res: any) => {
            login(res)
          },
          fail: (error: any) => {
            console.error('카카오 사용자 정보 요청 실패:', error)
          }
        })
      },
      fail: (error: any) => {
        console.error('카카오 로그인 실패:', error)
      }
    })
  }

  if (user) {
    return (
      <div className="user-info">
        <div className="user-profile">
          {user.profileImage && (
            <img 
              src={user.profileImage} 
              alt="프로필" 
              className="profile-image"
            />
          )}
          <span className="nickname">{user.nickname}님</span>
        </div>
        <button className="btn btn-outline" onClick={logout}>
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <button className="btn btn-kakao" onClick={handleKakaoLogin}>
      <span className="kakao-icon">💬</span>
      카카오 로그인
    </button>
  )
}

export default LoginButton
