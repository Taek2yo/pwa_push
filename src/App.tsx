import { useState, useEffect } from "react";
import "./App.css";

// BeforeInstallPromptEvent 타입 정의 (Web API에 명시적으로 포함되지 않은 타입)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  useEffect(() => {
    // beforeinstallprompt 이벤트를 수신하여 설치 프롬프트를 저장
    const handleBeforeInstallPrompt = (e: Event) => {
      // 타입 확인 및 변환
      const promptEvent = e as BeforeInstallPromptEvent;

      // 브라우저 기본 설치 미니 인포바를 방지
      e.preventDefault();

      // 나중에 사용하기 위해 이벤트 저장
      setDeferredPrompt(promptEvent);

      // 설치 가능 상태로 변경
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 이미 설치되었는지 확인
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async (): Promise<void> => {
    if (!deferredPrompt) return;

    // 설치 프롬프트 표시
    await deferredPrompt.prompt();

    // 사용자의 선택 결과 대기
    const { outcome } = await deferredPrompt.userChoice;

    // 사용자가 수락했는지 확인
    if (outcome === "accepted") {
      console.log("사용자가 홈 화면에 추가를 승인했습니다.");
      setIsInstallable(false);
    } else {
      console.log("사용자가 홈 화면에 추가를 거부했습니다.");
    }

    // deferredPrompt 초기화 (한 번만 사용 가능)
    setDeferredPrompt(null);
  };

  // 버튼 스타일 객체에 타입 적용
  const buttonStyle: React.CSSProperties = {
    padding: "10px 20px",
    margin: "20px 0",
    backgroundColor: "#4285f4",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div>
      <span>PWA 푸쉬알림 테스트 앱</span>

      {isInstallable && (
        <button onClick={handleInstallClick} style={buttonStyle}>
          홈 화면에 추가하기
        </button>
      )}
    </div>
  );
}

export default App;
