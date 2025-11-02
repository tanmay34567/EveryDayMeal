import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services";


export const Appcontext = createContext();

export const Appcontextprovider = ({ children }) => {
  const navigate = useNavigate();

  const [Student, setStudent] = useState(() => {
    const savedData = localStorage.getItem("currentStudent");
    return savedData ? JSON.parse(savedData) : null;
  });

  const [seller, setseller] = useState(() => {
    const savedData = localStorage.getItem("currentVendor");
    return savedData ? JSON.parse(savedData) : null;
  });

  const [isseller, setisseller] = useState(!!seller);
  const [ShowStudentLogin, setShowStudentLogin] = useState(false);
  const [ShowVendorLogin, setShowVendorLogin] = useState(false);
  const [MenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (Student) {
      localStorage.setItem("currentStudent", JSON.stringify(Student));
    } else {
      localStorage.removeItem("currentStudent");
    }
  }, [Student]);

  useEffect(() => {
    if (seller) {
      localStorage.setItem("currentVendor", JSON.stringify(seller));
      setisseller(true);
    } else {
      localStorage.removeItem("currentVendor");
      setisseller(false);
    }
  }, [seller]);

  const clearStudent = () => {
    setStudent(null);
    navigate("/");
  };

  const clearSeller = () => {
    setseller(null);
    navigate("/");
  };

  const value = {
    navigate,
    Student,
    setStudent: (student) => {
      if (student && seller) clearSeller();
      setStudent(student);
    },
    seller,
    setseller: (vendor) => {
      if (vendor && Student) clearStudent();
      setseller(vendor);
    },
    setSeller: (vendor) => {
      if (vendor && Student) clearStudent();
      setseller(vendor);
    },
    isseller,
    setisseller,
    ShowStudentLogin,
    setShowStudentLogin,
    ShowVendorLogin,
    setShowVendorLogin,
    MenuOpen,
    setMenuOpen,
    axios: api,
    logout: () => {
      clearStudent();
      clearSeller();
    }
  };

  return (
    <Appcontext.Provider value={value}>
      {children}
    </Appcontext.Provider>
  );
};

export const useAppcontext = () => {
  return useContext(Appcontext);
};
