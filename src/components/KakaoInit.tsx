import { useEffect } from 'react'

const KakaoInit = () => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      // 환경변수에서 카카오 앱 키 가져오기
      const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY || 'demo_key'
      
      try {
        window.Kakao.init(KAKAO_APP_KEY)
        console.log('카카오 SDK 초기화 완료')
      } catch (error) {
        console.error('카카오 SDK 초기화 실패:', error)
      }
    }
  }, [])

  return null
}

export default KakaoInit
