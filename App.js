import React, { useMemo, useState } from "react";
import {
  SafeAreaView, ScrollView, View, Text, StyleSheet, Pressable,
  StatusBar, Platform
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

const ORIGINAL_EMPLOYEES = [
  { id: 0, name: "Arlene", experience: 4, city: "Rubavu", department: "IT", salary: 3000 },
  { id: 1, name: "Darius", experience: 11, city: "Musanze", department: "Finance", salary: 2500 },
  { id: 2, name: "Happy", experience: 3, city: "Kigali", department: "HR", salary: 2500 },
  { id: 3, name: "Jordan", experience: 13, city: "Nyamata", department: "IT", salary: 3200 },
  { id: 4, name: "Clare", experience: 8, city: "Kamonyi", department: "HR", salary: 2700 },
  { id: 5, name: "Bonnette", experience: 15, city: "Muhanga", department: "IT", salary: 4000 },
  { id: 6, name: "Kennedy", experience: 16, city: "Huye", department: "IT", salary: 2800 }
];

const GREEN = "#247A4B";
const money = (value) => Number(value).toLocaleString("en-US");

const QUESTIONS = [
  { id: 35, title: "Experience Level", subtitle: "Create an Experience Level column using apply()." },
  { id: 36, title: "Replace Department", subtitle: "Replace IT with Information Technology." },
  { id: 37, title: "Uppercase City Names", subtitle: "Change all city names to uppercase." },
  { id: 38, title: "Update Kennedy's Salary", subtitle: "Change Kennedy's salary to 3,500 using at[]." },
  { id: 39, title: "Total Compensation", subtitle: "Create a Total Compensation column combining Salary and Bonus." },
  { id: 40, title: "Rename Column", subtitle: "Rename Experience to Years of Experience." },
  { id: 41, title: "Average Salary by Department", subtitle: "Calculate the average salary for each department." },
  { id: 42, title: "Maximum Salary by Department", subtitle: "Calculate the maximum salary for each department." }
];

function DataTable({ rows, columns }) {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        {columns.map((column) => (
          <Text key={column.key} style={[styles.cell, styles.headerCell, { flex: column.flex || 1 }]}>
            {column.label}
          </Text>
        ))}
      </View>
      {rows.map((row, index) => (
        <View key={row.id ?? index} style={[styles.tableRow, index % 2 === 1 && styles.altRow]}>
          {columns.map((column) => (
            <Text key={column.key} style={[styles.cell, { flex: column.flex || 1 }]} numberOfLines={2}>
              {column.render ? column.render(row) : String(row[column.key] ?? "")}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function Explanation({ children }) {
  return <Text style={styles.explanation}>{children}</Text>;
}

export default function App() {
  const [employees, setEmployees] = useState(ORIGINAL_EMPLOYEES);
  const [page, setPage] = useState("home");

  const reset = () => {
    setEmployees(ORIGINAL_EMPLOYEES);
    setPage("home");
  };

  const currentQuestionIndex = QUESTIONS.findIndex((q) => q.id === Number(page));
  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const experienceRows = useMemo(() => employees.map((employee) => {
    let level = "Senior";
    if (employee.experience < 5) level = "Junior";
    else if (employee.experience <= 10) level = "Intermediate";
    return { ...employee, level };
  }), [employees]);

  const departmentRows = useMemo(() => employees.map((employee) => ({
    ...employee,
    department: employee.department === "IT" ? "Information Technology" : employee.department
  })), [employees]);

  const cityRows = useMemo(() => employees.map((employee) => ({
    ...employee, city: employee.city.toUpperCase()
  })), [employees]);

  const compensationRows = useMemo(() => employees.map((employee) => {
    // Exercise 33 creates the bonus: 1,000 for employees with more than 10 years.
    const bonus = employee.experience > 10 ? 1000 : 0;
    return { ...employee, bonus, total: employee.salary + bonus };
  }), [employees]);

  const averageRows = useMemo(() => {
    const groups = {};
    employees.forEach((employee) => {
      if (!groups[employee.department]) groups[employee.department] = { department: employee.department, total: 0, count: 0 };
      groups[employee.department].total += employee.salary;
      groups[employee.department].count += 1;
    });
    return Object.values(groups).map((group) => ({
      department: group.department,
      average: group.total / group.count
    }));
  }, [employees]);

  const maximumRows = useMemo(() => {
    const groups = {};
    employees.forEach((employee) => {
      groups[employee.department] = Math.max(groups[employee.department] ?? 0, employee.salary);
    });
    return Object.entries(groups).map(([department, maximum]) => ({ department, maximum }));
  }, [employees]);

  const renderExercise = () => {
    switch (Number(page)) {
      case 35:
        return <>
          <Explanation>Use a simple function with if and elif conditions. Employees with less than 5 years are Junior, 5 to 10 years are Intermediate, and more than 10 years are Senior.</Explanation>
          <DataTable rows={experienceRows} columns={[
            { key: "name", label: "Name", flex: 1.1 },
            { key: "experience", label: "Years", flex: 0.7 },
            { key: "level", label: "Experience level", flex: 1.5 }
          ]} />
        </>;
      case 36:
        return <>
          <Explanation>Replace the department value IT with Information Technology. The other department values remain unchanged.</Explanation>
          <DataTable rows={departmentRows} columns={[
            { key: "name", label: "Name", flex: 1 },
            { key: "department", label: "Department", flex: 2 }
          ]} />
        </>;
      case 37:
        return <>
          <Explanation>Convert every city name to uppercase letters using a simple string method.</Explanation>
          <DataTable rows={cityRows} columns={[
            { key: "name", label: "Name", flex: 1 },
            { key: "city", label: "City", flex: 1.4 }
          ]} />
        </>;
      case 38:
        return <>
          <Explanation>Use at[] to update Kennedy's Salary value to 3,500. Tap the button to apply the update to the employee data.</Explanation>
          <View style={styles.changeBox}>
            <View><Text style={styles.smallLabel}>Current salary</Text><Text style={styles.oldSalary}>{money(employees.find((e) => e.name === "Kennedy").salary)}</Text></View>
            <Text style={styles.arrow}>→</Text>
            <View><Text style={styles.smallLabel}>Target salary</Text><Text style={styles.newSalary}>3,500</Text></View>
          </View>
          <DataTable rows={employees.filter((e) => e.name === "Kennedy")} columns={[
            { key: "name", label: "Name", flex: 1 },
            { key: "salary", label: "Salary", flex: 1, render: (row) => money(row.salary) }
          ]} />
          <Pressable style={styles.actionButton} onPress={() => setEmployees((old) => old.map((e) => e.name === "Kennedy" ? { ...e, salary: 3500 } : e))}>
            <Text style={styles.actionButtonText}>Apply salary update</Text>
          </Pressable>
        </>;
      case 39:
        return <>
          <Explanation>Use the Bonus created in Exercise 33: employees with more than 10 years of experience receive 1,000. Total Compensation = Salary + Bonus.</Explanation>
          <DataTable rows={compensationRows} columns={[
            { key: "name", label: "Name", flex: 1 },
            { key: "salary", label: "Salary", flex: 1, render: (row) => money(row.salary) },
            { key: "bonus", label: "Bonus", flex: 0.8, render: (row) => money(row.bonus) },
            { key: "total", label: "Total", flex: 1, render: (row) => money(row.total) }
          ]} />
        </>;
      case 40:
        return <>
          <Explanation>Rename the Experience column heading to Years of Experience. The employee values do not change.</Explanation>
          <DataTable rows={employees} columns={[
            { key: "name", label: "Name", flex: 1 },
            { key: "experience", label: "Years of Experience", flex: 1.7 }
          ]} />
        </>;
      case 41:
        return <>
          <Explanation>Group the employees by Department. Add the salaries in each group and divide by the number of employees to get the average.</Explanation>
          <DataTable rows={averageRows} columns={[
            { key: "department", label: "Department", flex: 1.4 },
            { key: "average", label: "Average salary", flex: 1.2, render: (row) => money(Math.round(row.average * 100) / 100) }
          ]} />
        </>;
      case 42:
        return <>
          <Explanation>Group employees by Department and show the highest salary found in each group.</Explanation>
          <DataTable rows={maximumRows} columns={[
            { key: "department", label: "Department", flex: 1.4 },
            { key: "maximum", label: "Maximum salary", flex: 1.2, render: (row) => money(row.maximum) }
          ]} />
        </>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <View style={styles.topBar}>
        <Pressable onPress={() => setPage("home")} style={styles.brandArea}>
          <Text style={styles.brand}>PANDAS PRACTICE</Text>
          <Text style={styles.brandSub}>React Native learning app</Text>
        </Pressable>
        <Pressable onPress={reset} style={styles.resetButton}><Text style={styles.resetText}>Reset</Text></Pressable>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>BT</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.studentName}>BANA Emmy Tresor</Text>
          <Text style={styles.studentClass}>CLASS Y3A · QUESTIONS 35–42</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {page === "home" ? (
          <>
            <Text style={styles.pageTitle}>Exercises</Text>
            <Text style={styles.pageIntro}>Choose a question. Each exercise opens on its own page, and use the navigation buttons to move between questions.</Text>
            <View style={styles.progressCard}>
              <Text style={styles.progressNumber}>8</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.progressTitle}>Separate exercise pages</Text>
                <Text style={styles.progressText}>Questions 35 through 42</Text>
              </View>
            </View>
            {QUESTIONS.map((question, index) => (
              <Pressable key={question.id} onPress={() => setPage(String(question.id))} style={styles.questionCard}>
                <View style={styles.questionNumber}><Text style={styles.questionNumberText}>{question.id}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.questionTitle}>{question.title}</Text>
                  <Text style={styles.questionSubtitle}>{question.subtitle}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setPage("employees")} style={styles.datasetButton}>
              <Text style={styles.datasetButtonText}>View employee dataset</Text>
            </Pressable>
          </>
        ) : page === "employees" ? (
          <>
            <Pressable onPress={() => setPage("home")} style={styles.backLink}><Text style={styles.backLinkText}>‹  All exercises</Text></Pressable>
            <Text style={styles.pageTitle}>Employee dataset</Text>
            <Text style={styles.pageIntro}>The seven employees from the original Pandas notebook.</Text>
            <DataTable rows={employees} columns={[
              { key: "name", label: "Name", flex: 1 },
              { key: "experience", label: "Years", flex: 0.65 },
              { key: "department", label: "Department", flex: 1.1 },
              { key: "salary", label: "Salary", flex: 0.9, render: (row) => money(row.salary) }
            ]} />
          </>
        ) : (
          <>
            <Pressable onPress={() => setPage("home")} style={styles.backLink}><Text style={styles.backLinkText}>‹  All exercises</Text></Pressable>
            <View style={styles.detailTop}>
              <Text style={styles.detailEyebrow}>QUESTION {currentQuestion.id} OF 50</Text>
              <Text style={styles.pageTitle}>{currentQuestion.title}</Text>
              <Text style={styles.pageIntro}>{currentQuestion.subtitle}</Text>
            </View>
            <View style={styles.answerCard}>
              <Text style={styles.answerLabel}>ANSWER / RESULT</Text>
              {renderExercise()}
            </View>
            <View style={styles.navigation}>
              <Pressable
                disabled={currentQuestionIndex === 0}
                onPress={() => setPage(String(QUESTIONS[currentQuestionIndex - 1].id))}
                style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}>
                <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.disabledText]}>‹ Previous</Text>
              </Pressable>
              <Text style={styles.pageCount}>{currentQuestionIndex + 1} / {QUESTIONS.length}</Text>
              <Pressable
                disabled={currentQuestionIndex === QUESTIONS.length - 1}
                onPress={() => setPage(String(QUESTIONS[currentQuestionIndex + 1].id))}
                style={[styles.navButton, styles.nextButton, currentQuestionIndex === QUESTIONS.length - 1 && styles.disabledButton]}>
                <Text style={[styles.navButtonText, styles.nextButtonText, currentQuestionIndex === QUESTIONS.length - 1 && styles.disabledText]}>Next ›</Text>
              </Pressable>
            </View>
          </>
        )}
        <Text style={styles.footer}>BANA Emmy Tresor · Y3A</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F5", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  topBar: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brandArea: { flex: 1 },
  brand: { color: GREEN, fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  brandSub: { color: "#75827A", fontSize: 11, marginTop: 3 },
  resetButton: { backgroundColor: "#E4EEE8", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  resetText: { color: GREEN, fontWeight: "700", fontSize: 12 },
  profileCard: { marginHorizontal: 18, padding: 15, backgroundColor: "#FFFFFF", borderRadius: 17, flexDirection: "row", alignItems: "center", gap: 12, elevation: 2, shadowColor: "#1C3325", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  avatar: { width: 43, height: 43, borderRadius: 14, backgroundColor: "#DDEFE4", alignItems: "center", justifyContent: "center" },
  avatarText: { color: GREEN, fontWeight: "900", fontSize: 15 },
  studentName: { color: "#1E2B23", fontSize: 15, fontWeight: "800" },
  studentClass: { color: "#829087", fontSize: 10, fontWeight: "700", marginTop: 4, letterSpacing: 0.7 },
  scrollContent: { padding: 18, paddingBottom: 42 },
  pageTitle: { fontSize: 23, fontWeight: "900", color: "#1C2B21", marginTop: 5 },
  pageIntro: { color: "#718078", lineHeight: 20, fontSize: 13, marginTop: 7, marginBottom: 17 },
  progressCard: { backgroundColor: "#E6F1E9", padding: 15, borderRadius: 15, flexDirection: "row", alignItems: "center", gap: 13, marginBottom: 13 },
  progressNumber: { fontSize: 27, fontWeight: "900", color: GREEN },
  progressTitle: { color: "#28583A", fontSize: 13, fontWeight: "800" },
  progressText: { color: "#6E8475", fontSize: 11, marginTop: 3 },
  questionCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E9EFEB" },
  questionNumber: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#E6F2EA", alignItems: "center", justifyContent: "center" },
  questionNumberText: { color: GREEN, fontSize: 13, fontWeight: "900" },
  questionTitle: { color: "#26352B", fontSize: 14, fontWeight: "800" },
  questionSubtitle: { color: "#7B887F", fontSize: 11, lineHeight: 16, marginTop: 4 },
  chevron: { color: GREEN, fontSize: 25, paddingHorizontal: 3 },
  datasetButton: { padding: 14, backgroundColor: GREEN, borderRadius: 12, alignItems: "center", marginTop: 4 },
  datasetButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
  backLink: { alignSelf: "flex-start", paddingVertical: 6, paddingRight: 12, marginBottom: 9 },
  backLinkText: { color: GREEN, fontSize: 13, fontWeight: "800" },
  detailTop: { marginBottom: 2 },
  detailEyebrow: { color: GREEN, fontWeight: "900", fontSize: 10, letterSpacing: 1.2 },
  answerCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#E8EFEB" },
  answerLabel: { color: "#8A978E", fontSize: 10, fontWeight: "900", letterSpacing: 1, marginBottom: 13 },
  explanation: { color: "#64736A", fontSize: 12, lineHeight: 19, marginBottom: 13 },
  table: { borderWidth: 1, borderColor: "#E8EEE9", borderRadius: 9, overflow: "hidden" },
  tableRow: { flexDirection: "row", backgroundColor: "#FFFFFF", minHeight: 38, alignItems: "center" },
  tableHeader: { backgroundColor: "#EAF2EC" },
  altRow: { backgroundColor: "#FAFCFA" },
  cell: { color: "#425148", fontSize: 10, paddingVertical: 10, paddingHorizontal: 6 },
  headerCell: { color: "#355D43", fontWeight: "800", fontSize: 10 },
  changeBox: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 25, paddingVertical: 14, marginBottom: 12, backgroundColor: "#F5F9F6", borderRadius: 10 },
  smallLabel: { color: "#859188", fontSize: 10, marginBottom: 4 },
  oldSalary: { color: "#9A5B51", fontSize: 18, fontWeight: "800" },
  newSalary: { color: GREEN, fontSize: 18, fontWeight: "900" },
  arrow: { color: "#8A978E", fontSize: 20 },
  actionButton: { alignSelf: "flex-start", backgroundColor: GREEN, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 9, marginTop: 12 },
  actionButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
  navigation: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, gap: 8 },
  navButton: { backgroundColor: "#E5EEE8", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15, minWidth: 105, alignItems: "center" },
  nextButton: { backgroundColor: GREEN },
  navButtonText: { color: GREEN, fontWeight: "800", fontSize: 12 },
  nextButtonText: { color: "#FFFFFF" },
  disabledButton: { backgroundColor: "#EDF0EE" },
  disabledText: { color: "#AAB3AD" },
  pageCount: { color: "#87948B", fontSize: 11, fontWeight: "700" },
  footer: { color: "#A0AAA3", textAlign: "center", fontSize: 10, marginTop: 22 }
});
