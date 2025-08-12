import React, { useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginButton from './components/LoginButton'
import KakaoInit from './components/KakaoInit'

interface UsageEntry {
  id: string
  power: number
  temperature: number
  windLevel: string
  hours: number
  cost: number
  kwh: number
}

function AppContent() {
  const { user } = useAuth()
  const [power, setPower] = useState<number>(1000)
  const [temperature, setTemperature] = useState<number>(24)
  const [windLevel, setWindLevel] = useState<string>('mid')
  const [hours, setHours] = useState<number>(1)
  const [usageList, setUsageList] = useState<UsageEntry[]>([])

  // 전기요금 계산 (kWh당 약 300원으로 가정)
  const calculateCost = (powerW: number, hoursUsed: number): { cost: number, kwh: number } => {
    const kwh = (powerW * hoursUsed) / 1000
    const cost = Math.round(kwh * 300)
    return { cost, kwh }
  }

  const currentCalculation = calculateCost(power, hours)

  const addUsage = () => {
    const newEntry: UsageEntry = {
      id: Date.now().toString(),
      power,
      temperature,
      windLevel,
      hours,
      cost: currentCalculation.cost,
      kwh: currentCalculation.kwh
    }
    setUsageList([...usageList, newEntry])
  }

  const clearUsage = () => {
    setUsageList([])
  }

  const removeUsage = (id: string) => {
    setUsageList(usageList.filter(entry => entry.id !== id))
  }

  const totalCost = usageList.reduce((sum, entry) => sum + entry.cost, 0)
  const totalKwh = usageList.reduce((sum, entry) => sum + entry.kwh, 0)
  const totalHours = usageList.reduce((sum, entry) => sum + entry.hours, 0)
  const avgCostPerHour = totalHours > 0 ? Math.round(totalCost / totalHours) : 0

  const getWindLevelText = (level: string) => {
    const levels: { [key: string]: string } = {
      'low': '약풍',
      'mid': '중풍', 
      'high': '강풍',
      'turbo': '터보'
    }
    return levels[level] || level
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-content">
          <div className="header-text">
            <h1>❄️ 에어컨 전기요금 계산기</h1>
            <p>에어컨 사용 조건을 입력하고 전기요금을 계산해보세요</p>
          </div>
          <div className="header-auth">
            <LoginButton />
          </div>
        </div>
      </div>

      <div className="content">
        {/* 입력 섹션 */}
        <div className="input-section">
          {!user && (
            <div className="login-notice">
              <p>💡 로그인하시면 사용 내역을 저장하고 통계를 확인할 수 있습니다!</p>
            </div>
          )}
          <h2>에어컨 사용 조건 입력</h2>
          
          <div className="input-group">
            <div className="form-group">
              <label htmlFor="power">에어컨 전력 (W)</label>
              <input
                id="power"
                type="number"
                value={power}
                onChange={(e) => setPower(Number(e.target.value))}
                min="500"
                max="3000"
                step="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="temperature">설정 온도 (°C)</label>
              <input
                id="temperature"
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                min="18"
                max="28"
              />
            </div>

            <div className="form-group">
              <label htmlFor="windLevel">바람 세기</label>
              <select
                id="windLevel"
                value={windLevel}
                onChange={(e) => setWindLevel(e.target.value)}
              >
                <option value="low">약풍</option>
                <option value="mid">중풍</option>
                <option value="high">강풍</option>
                <option value="turbo">터보</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hours">사용 시간</label>
              <input
                id="hours"
                type="number"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                min="0.5"
                max="24"
                step="0.5"
              />
            </div>
          </div>

          <div className="cost-display">
            <h3>예상 전기요금</h3>
            <div className="amount">{currentCalculation.cost.toLocaleString()}원</div>
            <small>({currentCalculation.kwh.toFixed(3)} kWh)</small>
          </div>

          <button className="btn" onClick={addUsage}>
            사용내역 추가하기
          </button>
        </div>

        {/* 사용 내역 섹션 */}
        {usageList.length > 0 && (
          <div className="usage-list">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>오늘의 사용 내역</h2>
              <button className="btn btn-danger" onClick={clearUsage}>
                전체 초기화
              </button>
            </div>

            {usageList.map((entry) => (
              <div key={entry.id} className="usage-item">
                <div>
                  <strong>{entry.power}W</strong> | {entry.temperature}°C | {getWindLevelText(entry.windLevel)} | {entry.hours}시간
                  <br />
                  <small>{entry.kwh.toFixed(3)} kWh</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <strong>{entry.cost.toLocaleString()}원</strong>
                  <button 
                    onClick={() => removeUsage(entry.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#ef4444', 
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <div className="usage-summary">
              <h3>오늘 총 사용량</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <h4>총 사용시간</h4>
                  <div className="value">{totalHours}시간</div>
                </div>
                <div className="summary-item">
                  <h4>총 전력사용량</h4>
                  <div className="value">{totalKwh.toFixed(3)} kWh</div>
                </div>
                <div className="summary-item">
                  <h4>총 전기요금</h4>
                  <div className="value">{totalCost.toLocaleString()}원</div>
                </div>
                <div className="summary-item">
                  <h4>시간당 평균요금</h4>
                  <div className="value">{avgCostPerHour.toLocaleString()}원</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <KakaoInit />
      <AppContent />
    </AuthProvider>
  )
}

export default App
