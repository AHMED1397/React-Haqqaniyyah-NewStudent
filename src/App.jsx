import React, { useState, useEffect } from "react";
import { db } from "./services/firebaseConfig.js";
import { ref, get, set } from "firebase/database";
import { School } from "lucide-react";

export default function AddStudent() {
  const [student, setStudent] = useState({
    indexNo: "",
    name: "",
    fatherName: "",
    dateOfBirth: "",
    admissionDate: "",
    phone: "",
    email: "",
    emergencyContact: "",
    address: "",
    section: "kithab",
    photo: "",
    isPresent: "true",
    lateDays: "0",
    totalLeaveDays: "0",
    floorOrGrade: "",
  });

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [existingIndexNos, setExistingIndexNos] = useState(new Set());

  useEffect(() => {
    const fetchIndexNos = async () => {
      try {
        const snapshot = await get(ref(db, "StudentDetails"));
        const indexSet = new Set();
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.Dhaura) data.Dhaura.forEach((s) => indexSet.add(s.indexNo));
          if (data.Hifz)
            Object.values(data.Hifz).forEach((floor) =>
              floor.forEach((s) => indexSet.add(s.indexNo))
            );
          if (data.ShareeaGrades)
            Object.values(data.ShareeaGrades).forEach((grade) =>
              grade.forEach((s) => indexSet.add(s.indexNo))
            );
        }
        setExistingIndexNos(indexSet);
      } catch (error) {
        console.error("Error fetching index numbers:", error);
      }
    };
    fetchIndexNos();
  }, []);

  const validate = () => {
    const errs = {};
    if (!student.indexNo) errs.indexNo = "Index No required.";
    else if (existingIndexNos.has(parseInt(student.indexNo)))
      errs.indexNo = "Index No already exists.";
    if (!student.name.trim()) errs.name = "Name required.";
    if (!student.section.trim()) errs.section = "Section required.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setStatusMessage("");
    if (Object.keys(validationErrors).length > 0) return;

    const newStudent = {
      indexNo: parseInt(student.indexNo),
      name: student.name,
      fatherName: student.fatherName,
      dateOfBirth: student.dateOfBirth,
      admissionDate: student.admissionDate,
      phone: student.phone,
      email: student.email,
      emergencyContact: student.emergencyContact,
      address: student.address,
      section: student.section,
      photo: student.photo,
      isPresent: student.isPresent === "true",
      lateDays: parseInt(student.lateDays),
      totalLeaveDays: parseInt(student.totalLeaveDays),
    };

    let dbPath = "StudentDetails/";
    if (student.section === "Dhaura") {
      dbPath += "Dhaura";
    } else if (student.section === "Hifz") {
      dbPath += `Hifz/${student.floorOrGrade}`;
    } else if (student.section === "ShareeaGrades") {
      dbPath += `ShareeaGrades/${student.floorOrGrade}`;
      newStudent.grade =
        parseInt(student.floorOrGrade.replace("Grade", "")) || 1;
    }

    try {
      const studentsRef = ref(db, dbPath);
      const snapshot = await get(studentsRef);
      const currentList = snapshot.exists() ? snapshot.val() : [];
      const updatedList = [...currentList, newStudent];
      await set(studentsRef, updatedList);

      setStatusMessage("✅ Student added successfully!");
      setStudent({
        indexNo: "",
        name: "",
        fatherName: "",
        dateOfBirth: "",
        admissionDate: "",
        phone: "",
        email: "",
        emergencyContact: "",
        address: "",
        section: "kithab",
        photo: "",
        isPresent: "true",
        lateDays: "0",
        totalLeaveDays: "0",
        floorOrGrade: "",
      });
      setExistingIndexNos((prev) => new Set(prev).add(newStudent.indexNo));
    } catch (err) {
      console.error("Firebase error:", err);
      setStatusMessage("❌ Failed to add student.");
    }
  };

  const hifzFloors = [
    "0floor",
    "1floor",
    "2floor",
    "3floor",
    "4floor",
    "5floor",
  ];
  const shareeaGrades = [
    "Grade1",
    "Grade2",
    "Grade3",
    "Grade4",
    "Grade5",
    "Grade6",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        padding: "2rem",
        fontFamily: "monospace",
        color: "#fff",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <School size={40} style={{ marginRight: "1rem", color: "#00ffcc" }} />
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Al-Haqqaniyyah Arabic College
          </h1>
        </div>
        <p style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>
          Student Register
        </p>
      </div>

      <div
        style={{
          width: "100%",
          backgroundColor: "#1f1f1f",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 0 10px rgba(0,255,204,0.5)",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "1rem",
            borderBottom: "1px solid #00ffcc",
            paddingBottom: "0.5rem",
          }}
        >
          Add Student
        </h2>

        {statusMessage && (
          <div
            style={{
              backgroundColor: statusMessage.includes("✅")
                ? "#004d40"
                : "#4a0000",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            {statusMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <label>
            Index No:
            <input
              name="indexNo"
              type="text"
              value={student.indexNo}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            Name:
            <input
              name="name"
              type="text"
              value={student.name}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            Father Name:
            <input
              name="fatherName"
              type="text"
              value={student.fatherName}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            Date of Birth:
            <input
              name="dateOfBirth"
              type="date"
              value={student.dateOfBirth}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            Admission Date:
            <input
              name="admissionDate"
              type="date"
              value={student.admissionDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            Phone:
            <input
              name="phone"
              type="text"
              value={student.phone}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            Email:
            <input
              name="email"
              type="email"
              value={student.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            Emergency Contact:
            <input
              name="emergencyContact"
              type="text"
              value={student.emergencyContact}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            Address:
            <input
              name="address"
              type="text"
              value={student.address}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            Photo URL:
            <input
              name="photo"
              type="text"
              value={student.photo}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <label>
            Section:
            <select
              name="section"
              value={student.section}
              onChange={(e) =>
                setStudent((prev) => ({
                  ...prev,
                  section: e.target.value,
                  floorOrGrade: "",
                }))
              }
              style={inputStyle}
            >
              <option value="">Select Section</option>
              <option value="Dhaura">Dhaura</option>
              <option value="Hifz">Hifz</option>
              <option value="ShareeaGrades">Shareea</option>
            </select>
          </label>

          {(student.section === "Hifz" ||
            student.section === "ShareeaGrades") && (
            <label>
              {student.section === "Hifz" ? "Floor:" : "Grade:"}
              <select
                name="floorOrGrade"
                value={student.floorOrGrade}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    floorOrGrade: e.target.value,
                  }))
                }
                style={inputStyle}
              >
                <option value="">
                  Select {student.section === "Hifz" ? "Floor" : "Grade"}
                </option>
                {(student.section === "Hifz" ? hifzFloors : shareeaGrades).map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                )}
              </select>
            </label>
          )}

          <label>
            Present:
            <select
              name="isPresent"
              value={student.isPresent}
              onChange={(e) =>
                setStudent((prev) => ({ ...prev, isPresent: e.target.value }))
              }
              style={inputStyle}
            >
              <option value="true">Present</option>
              <option value="false">Absent</option>
            </select>
          </label>

          <label>
            Late Days:
            <input
              name="lateDays"
              type="number"
              value={student.lateDays}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            Total Leave Days:
            <input
              name="totalLeaveDays"
              type="number"
              value={student.totalLeaveDays}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            style={{
              gridColumn: "span 2",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              backgroundColor: "#00ffcc",
              color: "#000",
              fontWeight: "bold",
              border: "none",
            }}
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "0.25rem",
  border: "1px solid #00ffcc",
  backgroundColor: "#000",
  color: "#fff",
};
