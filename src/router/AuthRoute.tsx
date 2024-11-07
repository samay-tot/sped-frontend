import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../Redux";

export const AuthRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { LoginDetails } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (LoginDetails?.email !== "") {
      navigate("/profile", { replace: true });
    }
  }, [LoginDetails, navigate]);

  return <>{children}</>;
};

export default AuthRoute;
