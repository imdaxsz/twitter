import { FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {

  const navigate = useNavigate();

  const onClick = () => {
    navigate(-1);
  }

  return (
    <div className="init flex">
      <div className="flex-col ac">
        <FaTwitter className="lg-logo" />
        <p style={{ margin: "15px" }}>존재하지 않는 페이지 입니다.</p>
        <button className="btn small" onClick={onClick}>
          뒤로 가기
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
