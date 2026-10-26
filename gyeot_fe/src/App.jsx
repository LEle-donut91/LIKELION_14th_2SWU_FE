import styles from "@/App.module.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import ErrorFallback from "@/shared/components/ErrorFallback";
import Test from "@/features/test/pages/Test";
import ModalTest from "@/features/test/pages/ModalTest";

// 나의 사람 및 보호자
import Start from "@/features/relation/pages/Start";
import Relation from "@/features/relation/pages/Relation";
import AcquaintanceInvite from "@/features/relation/pages/AcquaintanceInvite";
import AcquaintanceDetail from "@/features/relation/pages/AcquaintanceDetail";
import AcquaintanceShared from "@/features/relation/pages/AcquaintanceShared";
import ReceivedInvite from "@/features/relation/pages/ReceivedInvite";
import ReverseInvite from "@/features/relation/pages/ReverseInvite";
import GuardianRequest from "@/features/relation/pages/GuardianRequest";
import ReceivedGuardian from "@/features/relation/pages/ReceivedGuardian";
import RelationRelease from "@/features/relation/pages/RelationRelease";

// 홈
import Home from "@/features/home/pages/Home";

// 안심카드
import Card from "@/features/card/pages/Card";
import CardBasic from "@/features/card/pages/CardBasic";
import CardHealth from "@/features/card/pages/CardHealth";
import CardContact from "@/features/card/pages/CardContact";
import CardLife from "@/features/card/pages/CardLife";
import CardMessage from "@/features/card/pages/CardMessage";
import CardShare from "@/features/card/pages/CardShare";

// 상황
import Situation from "@/features/situation/pages/Situation";
import SituationCreate from "@/features/situation/pages/SituationCreate";
import SituationDetail from "@/features/situation/pages/SituationDetail";
import SituationManage from "@/features/situation/pages/SituationManage";
import SituationLeave from "@/features/situation/pages/SituationLeave";
import PastSituation from "@/features/situation/pages/PastSituation";
import PastSituationDetail from "@/features/situation/pages/PastSituationDetail";

// 요청
import Request from "@/features/request/pages/Request";
import InfoPreview from "@/features/request/pages/InfoPreview";
import RequestSend from "@/features/request/pages/RequestSend";
import RequestAssignee from "@/features/request/pages/RequestAssignee";
import RequestRequester from "@/features/request/pages/RequestRequester";
import RequestTarget from "@/features/request/pages/RequestTarget";
import ReceivedInfo from "@/features/request/pages/ReceivedInfo";
import RequestEditForm from "@/features/request/pages/RequestEditForm";
import RequestEditCheck from "@/features/request/pages/RequestEditCheck";
import AssigneeReconfirm from "@/features/request/pages/AssigneeReconfirm";
import AskAgain from "@/features/request/pages/AskAgain";

function App() {
  return (
    // 모바일 프레임
    <div className={styles.frame}>
      {/* 모바일 프레임 내부 app (실제 content) */}
      <div className={styles.app}>
        <ErrorBoundary
          fallback={(error, reset) => (
            <ErrorFallback error={error} reset={reset} />
          )}
        >
          <BrowserRouter>
            <Routes>
              {/* CSS 변수 테스트, M-01 모달 테스트 */}
              <Route path="/test" element={<Test />} />
              <Route path="/modal-test" element={<ModalTest/>}/>

              {/* 나의 사람 및 보호자 */}
              <Route path="/" element={<Start />} />  {/* A-01 */}
              <Route path="/relation" element={<Relation />} />  {/* R-00 */}
              <Route path="/relation/acquaintance-invite" element={<AcquaintanceInvite />} />  {/* R-01 */}
              <Route path="/relation/acquaintance-detail" element={<AcquaintanceDetail />} />  {/* R-02 */}
              <Route path="/relation/acquaintance-shared" element={<AcquaintanceShared />} />  {/* R-02-01 */}
              <Route path="/relation/received-invite" element={<ReceivedInvite />} />  {/* R-03 */}
              <Route path="/relation/reverse-invite" element={<ReverseInvite />} />  {/* N-01 */}
              <Route path="/relation/guardian-request" element={<GuardianRequest />} />  {/* N-02 */}
              <Route path="/relation/received-guardian" element={<ReceivedGuardian />} />  {/* N-03 */}
              <Route path="/relation/release" element={<RelationRelease />} />  {/* N-08 */}

              {/* 홈 */}
              <Route path="/home" element={<Home />} />  {/* H-00 */}

              {/* 안심카드 */}
              <Route path="/card" element={<Card />} />  {/* C-00 */}
              <Route path="/card/basic" element={<CardBasic />} />  {/* C-01 */}
              <Route path="/card/health" element={<CardHealth />} />  {/* C-02 */}
              <Route path="/card/contact" element={<CardContact />} />  {/* C-03 */}
              <Route path="/card/life" element={<CardLife />} />  {/* C-04 */}
              <Route path="/card/message" element={<CardMessage />} />  {/* C-05 */}
              <Route path="/card/share" element={<CardShare />} />  {/* C-06 */}

              {/* 상황 */}
              <Route path="/situation" element={<Situation />} />  {/* S-00 */}
              <Route path="/situation/create" element={<SituationCreate />} />  {/* H-01 */}
              <Route path="/situation/detail" element={<SituationDetail />} />  {/* H-03 */}
              <Route path="/situation/manage" element={<SituationManage />} />  {/* H-03-05 */}
              <Route path="/situation/leave" element={<SituationLeave />} />  {/* N-09 */}
              <Route path="/situation/past" element={<PastSituation />} />  {/* H-04 */}
              <Route path="/situation/past/detail" element={<PastSituationDetail />} />  {/* N-04 */}

              {/* 요청 */}
              {/* N-07은 features/request/Modal/DefaultModal.jsx로 구현 */}
              <Route path="/request" element={<Request />} />  {/* H-03-02 */}
              <Route path="/request/:id" element={<Request />} />  {/* H-03-02 */}
              <Route path="/request/info-preview/:id" element={<InfoPreview />} />  {/* H-03-02-01 */}
              <Route path="/request/send/:id" element={<RequestSend />} />  {/* H-03-02-01 */}
              <Route path="/request/assignee/:id" element={<RequestAssignee />} />  {/* H-03-01 */}
              <Route path="/request/requester/:id" element={<RequestRequester />} />  {/* H-03-01-A */}
              <Route path="/request/target/:id" element={<RequestTarget />} />  {/* H-03-01-B */}
              <Route path="/request/received-info/:id" element={<ReceivedInfo />} />  {/* H-03-01-01 */}
              <Route path="/request/edit-form/:id" element={<RequestEditForm />} />  {/* H-03-01-02 */}
              <Route path="/request/edit-check/:id" element={<RequestEditCheck />} />  {/* H-03-01-02 */}
              <Route path="/request/assignee-reconfirm/:id" element={<AssigneeReconfirm />} />  {/* N-05 */}
              <Route path="/request/ask-again/:id" element={<AskAgain />} />  {/* N-06 */}
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
