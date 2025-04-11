import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Appcontext = createContext();

export const Appcontextprovider = ({ children }) => {
  const navigate = useNavigate();

  const [Student, setStudent] = useState(null);
  const [seller, setseller] = useState(null);
  const [isseller, setisseller] = useState(false);
  const [ShowStudentLogin, setShowStudentLogin] = useState(false);
  const [ShowVendorLogin, setShowVendorLogin] = useState(false);
  const [MenuOpen, setMenuOpen] = useState(false);

  const value = {
    navigate,
    Student,
    setStudent,
    seller,
    setseller,
    isseller,
    setisseller,
    ShowStudentLogin,
    setShowStudentLogin,
    ShowVendorLogin,
    setShowVendorLogin,
    MenuOpen,
    setMenuOpen,
  };

  return <Appcontext.Provider value={value}>{children}</Appcontext.Provider>;
};

export const useAppcontext = () => {
  return useContext(Appcontext);
};
