import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services";


export const Appcontext = createContext();

export const Appcontextprovider = ({ children }) => {
  const navigate = useNavigate();

  const [Student, setStudent] = useState(() => {
    try {
      const savedData = localStorage.getItem("currentStudent");
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error parsing student data from localStorage:', error);
      return null;
    }
  });

  const [seller, setseller] = useState(() => {
    try {
      const savedData = localStorage.getItem("currentVendor");
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Error parsing vendor data from localStorage:', error);
      return null;
    }
  });

  const [isseller, setisseller] = useState(() => {
    try {
      const savedData = localStorage.getItem("currentVendor");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return parsed && parsed.token ? true : false;
      }
      return false;
    } catch (error) {
      return false;
    }
  });
  const [ShowStudentLogin, setShowStudentLogin] = useState(false);
  const [ShowVendorLogin, setShowVendorLogin] = useState(false);
  const [MenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Sync Student state to localStorage
    try {
      if (Student && Student.token) {
        localStorage.setItem("currentStudent", JSON.stringify(Student));
      } else if (Student === null) {
        // Only remove if explicitly set to null (not just undefined/missing token)
        localStorage.removeItem("currentStudent");
      }
    } catch (error) {
      console.error('Error syncing student to localStorage:', error);
    }
  }, [Student]);

  useEffect(() => {
    // Sync seller state to localStorage
    try {
      if (seller && seller.token) {
        localStorage.setItem("currentVendor", JSON.stringify(seller));
        setisseller(true);
      } else if (seller === null) {
        // Only remove if explicitly set to null (not just undefined/missing token)
        localStorage.removeItem("currentVendor");
        setisseller(false);
      }
    } catch (error) {
      console.error('Error syncing vendor to localStorage:', error);
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

  // Memoize the value object to prevent unnecessary re-renders
  // and ensure function references remain stable
  const value = {
    navigate: navigate || (() => {}),
    Student: Student || null,
    setStudent: (student) => {
      try {
        if (student && seller) {
          clearSeller();
        }
        setStudent(student);
      } catch (error) {
        console.error('Error in setStudent:', error);
      }
    },
    seller: seller || null,
    setseller: (vendor) => {
      try {
        if (vendor && Student) {
          clearStudent();
        }
        setseller(vendor);
      } catch (error) {
        console.error('Error in setseller:', error);
      }
    },
    setSeller: (vendor) => {
      try {
        if (vendor && Student) {
          clearStudent();
        }
        setseller(vendor);
      } catch (error) {
        console.error('Error in setSeller:', error);
      }
    },
    isseller: isseller || false,
    setisseller: setisseller || (() => {}),
    ShowStudentLogin: ShowStudentLogin || false,
    setShowStudentLogin: setShowStudentLogin || (() => {}),
    ShowVendorLogin: ShowVendorLogin || false,
    setShowVendorLogin: setShowVendorLogin || (() => {}),
    MenuOpen: MenuOpen || false,
    setMenuOpen: setMenuOpen || (() => {}),
    axios: api,
    logout: () => {
      try {
        clearStudent();
        clearSeller();
      } catch (error) {
        console.error('Error in logout:', error);
      }
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
