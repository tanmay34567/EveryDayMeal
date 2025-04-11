import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Appcontext = createContext();

export const Appcontextprovider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize state from localStorage if available
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

  // Update localStorage when user state changes
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

  // Custom setters that clear the session
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
      if (student && seller) clearSeller(); // Ensure only one role is active
      setStudent(student);
    },
    seller,
    setseller: (vendor) => {
      if (vendor && Student) clearStudent(); // Ensure only one role is active
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
    // Helper methods
    logout: () => {
      clearStudent();
      clearSeller();
    }
  };

  return <Appcontext.Provider value={value}>{children}</Appcontext.Provider>;
};

export const useAppcontext = () => {
  return useContext(Appcontext);
};