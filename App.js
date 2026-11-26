import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, Text as NativeText, TextInput, Pressable, Switch, Alert, Platform, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";

// Use the device's system font without downloading font files.
const fontFamily = Platform.select({ web: "Inter, system-ui, sans-serif", ios: "System", default: "sans-serif" });
const Text = ({ style, ...props }) => <NativeText {...props} style={[{ fontFamily }, style]} />;

const forms = [
  {
    title: "User Registration Form",
    fields: [
      ["Full Name", "text", true, 3], ["Email", "email", true], ["Password", "password", true, 8],
      ["Confirm Password", "confirm", true], ["Phone Number", "phone", true], ["Accept Terms", "check", true]
    ]
  },
  {
    title: "Student Admission Form",
    fields: [
      ["Student Name", "text", true], ["Date of Birth", "date", true], ["Gender", "select", true, ["Male", "Female"]],
      ["Nationality", "text", true], ["Email", "email", true], ["Phone", "phone", true],
      ["Previous School", "text", true], ["Program", "select", true, ["Science", "Software Development", "Networking", "Other"]],
      ["Academic Score", "number", true, 50]
    ]
  },
  {
    title: "Online Banking Transfer",
    fields: [
      ["Account Name", "text", true], ["Account Number", "digits", true], ["Amount", "positive", true],
      ["Currency", "select", true, ["RWF", "USD", "EUR"]], ["Transfer Description", "optional", false, 100],
      ["PIN", "pin", true]
    ]
  },
  {
    title: "Hospital Appointment Form",
    fields: [
      ["Patient Name", "text", true], ["Phone Number", "phone", true], ["Email", "emailOptional", false],
      ["Department", "select", true, ["General", "Dental", "Maternity", "Emergency"]],
      ["Doctor", "text", true], ["Appointment Date", "futureDate", true], ["Appointment Time", "text", true],
      ["Reason for Visit", "long", true, 10]
    ]
  },
  {
    title: "Job Application Form",
    fields: [
      ["Full Name", "text", true], ["Email", "email", true], ["Phone", "phone", true],
      ["Position", "text", true], ["Education Level", "select", true, ["Secondary", "Diploma", "Bachelor", "Master"]],
      ["Years of Experience", "nonnegative", true], ["Cover Letter", "long", true, 50], ["CV Selected", "file", true]
    ]
  },
  {
    title: "E-Commerce Checkout Form",
    fields: [
      ["Customer Name", "text", true], ["Phone", "phone", true], ["Email", "email", true],
      ["Delivery Address", "long", true], ["City", "text", true], ["Product Quantity", "positiveInteger", true],
      ["Payment Method", "select", true, ["Mobile Money", "Card", "Cash on Delivery"]],
      ["Delivery Option", "select", true, ["Standard", "Express"]]
    ]
  },
  {
    title: "Event Registration Form",
    fields: [
      ["Full Name", "text", true], ["Email", "email", true], ["Phone", "phone", true],
      ["Organization", "text", true], ["Job Title", "text", true],
      ["Attendance Type", "select", true, ["Physical", "Virtual"]],
      ["Number of Days", "days", true], ["Dietary Requirement", "text", false]
    ]
  }
];

const numericTypes = ["number", "positive", "positiveInteger", "nonnegative", "days", "digits", "pin"];

function fieldError([name, type, required, rule], value, data) {
  if (required && !value) return "This field is required.";
  if (!value) return "";
  const number = Number(value);
  if (["email", "emailOptional"].includes(type) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  if (type === "phone" && !/^[+0-9][0-9\s-]{7,14}$/.test(value)) return "Enter a valid phone number.";
  if (["text", "long", "password"].includes(type) && rule && value.length < rule) return "Enter at least " + rule + " characters.";
  if (type === "confirm" && value !== data.Password) return "Passwords do not match.";
  if (numericTypes.includes(type) && !Number.isFinite(number)) return "Enter a valid number.";
  if (type === "digits" && !/^\d+$/.test(value)) return "Use numbers only.";
  if (type === "pin" && !/^\d{4}$/.test(value)) return "Enter exactly 4 digits.";
  if (type === "positive" && number <= 0) return "Enter an amount greater than 0.";
  if (type === "positiveInteger" && (!Number.isInteger(number) || number <= 0)) return "Enter a whole number greater than 0.";
  if (type === "number" && (number < rule || number > 100)) return "Score must be between " + rule + " and 100.";
  if (type === "nonnegative" && number < 0) return "Experience cannot be negative.";
  if (type === "days" && (!Number.isInteger(number) || number < 1 || number > 3)) return "Enter a number from 1 to 3.";
  if (type === "optional" && value.length > rule) return "Maximum " + rule + " characters.";
  if (["date", "futureDate"].includes(type)) {
    const date = new Date(value + "T00:00:00");
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(date.getTime()) && date.getFullYear() === Number(value.slice(0, 4)) && date.getMonth() + 1 === Number(value.slice(5, 7)) && date.getDate() === Number(value.slice(8, 10));
    if (!valid) return "Enter a valid date (YYYY-MM-DD).";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (type === "futureDate" && date < today) return "Appointment date cannot be in the past.";
  }
  return "";
}

export default function App() {
  const [page, setPage] = useState(-1);
  const [values, setValues] = useState(() => forms.map(() => ({})));
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const form = forms[page];
  const data = values[page] || {};

  function open(index) {
    setPage(index);
    setErrors({});
    setSuccess(false);
  }

  function update(name, value) {
    setValues(old => old.map((item, index) => index === page ? { ...item, [name]: value } : item));
    setErrors(old => ({ ...old, [name]: "" }));
  }

  async function pickFile(name) {
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
      if (!result.canceled) update(name, result.assets[0]);
    } catch {
      setErrors(old => ({ ...old, [name]: "Could not open the file picker. Please try again." }));
    }
  }

  function submit() {
    const result = {};
    form.fields.forEach(field => {
      const value = data[field[0]];
      const message = fieldError(field, typeof value === "string" ? value.trim() : value, data);
      if (message) result[field[0]] = message;
    });
    setErrors(result);
    if (Object.keys(result).length) return;
    if (page === 2) {
      if (Platform.OS === "web") {
        if (window.confirm("Confirm transfer of " + data.Amount + " " + data.Currency + " to " + data["Account Name"] + "?")) setSuccess(true);
      } else {
        Alert.alert("Confirm Transfer", "Transfer " + data.Amount + " " + data.Currency + " to " + data["Account Name"] + "?", [
          { text: "Cancel", style: "cancel" },
          { text: "Confirm", onPress: () => setSuccess(true) }
        ]);
      }
    } else setSuccess(true);
  }

  function renderField([name, type, required, options]) {
    const value = data[name] || "";
    return <View key={name} style={s.field}>
      <Text style={s.label}>{name}{required ? " *" : ""}</Text>
      {type === "check" ? <Switch accessibilityLabel={name} value={!!value} onValueChange={v => update(name, v)} />
        : type === "file" ? <Pressable style={s.input} onPress={() => pickFile(name)} accessibilityRole="button">
          <Text>{value ? value.name + " (change file)" : "Choose CV file"}</Text>
        </Pressable>
        : type === "select" ? <View style={s.options}>
          {options.map(option => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ checked: value === option }} onPress={() => update(name, option)} style={[s.option, value === option && s.selected]}>
            <Text style={value === option && s.selectedText}>{option}</Text>
          </Pressable>)}
        </View>
        : <TextInput accessibilityLabel={name} value={value} onChangeText={text => update(name, text)}
          placeholder={["date", "futureDate"].includes(type) ? "YYYY-MM-DD" : name === "Appointment Time" ? "e.g. 09:30" : name}
          secureTextEntry={["password", "confirm", "pin"].includes(type)}
          autoCapitalize={["email", "emailOptional", "password", "confirm"].includes(type) ? "none" : "sentences"}
          keyboardType={numericTypes.includes(type) ? "numeric" : type === "phone" ? "phone-pad" : type.startsWith("email") ? "email-address" : "default"}
          multiline={type === "long"} style={[s.input, type === "long" && s.multiline, errors[name] && s.invalid]} />}
      {!!errors[name] && <Text style={s.error}>{errors[name]}</Text>}
    </View>;
  }

  return <SafeAreaView style={s.safe}>
    <StatusBar style="dark" />
    <ScrollView key={page} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.brand}>FORM PRACTICE</Text>
      <Text style={s.muted}>BANA Emmy Tresor ? Y3A</Text>
      {page === -1 ? <>
        <Text style={s.heading}>Choose a form</Text>
        {forms.map((item, index) => <Pressable key={item.title} style={s.row} onPress={() => open(index)}>
          <Text style={s.label}>{item.title}</Text><Text style={s.link}>Open</Text>
        </Pressable>)}
      </> : <>
        <Pressable onPress={() => open(-1)}><Text style={s.back}>Back to forms</Text></Pressable>
        <Text style={s.heading}>{form.title}</Text>
        {success ? <>
          <Text style={s.notice}>Form submitted successfully.</Text>
          <Pressable style={s.button} onPress={() => open(-1)}><Text style={s.selectedText}>Back to forms</Text></Pressable>
        </> : <>
          <Text style={s.muted}>* Required fields</Text>
          {form.fields.map(renderField)}
          <Pressable style={s.button} onPress={submit}><Text style={s.selectedText}>{page === 2 ? "Review transfer" : "Submit"}</Text></Pressable>
        </>}
      </>}
    </ScrollView>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FAFBFA" },
  content: { width: "100%", maxWidth: 600, alignSelf: "center", padding: 24, paddingBottom: 48 },
  brand: { color: "#247A4B", fontSize: 14, fontWeight: "700", marginBottom: 4 },
  muted: { color: "#667168", fontSize: 14, marginBottom: 16 },
  heading: { fontSize: 25, fontWeight: "700", color: "#202A23", marginVertical: 20 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16, paddingVertical: 18, borderBottomWidth: 1, borderColor: "#DFE5DF" },
  link: { color: "#247A4B" },
  back: { color: "#247A4B", marginTop: 20, paddingVertical: 8 },
  field: { marginBottom: 18 },
  label: { fontSize: 15, fontWeight: "600", color: "#27332B", marginBottom: 8, flexShrink: 1 },
  input: { fontFamily, fontSize: 16, color: "#27332B", backgroundColor: "white", borderWidth: 1, borderColor: "#C9D3CB", borderRadius: 6, padding: 12 },
  multiline: { minHeight: 100, textAlignVertical: "top" },
  invalid: { borderColor: "#B42318" },
  error: { color: "#B42318", fontSize: 13, marginTop: 6 },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { padding: 12, borderWidth: 1, borderColor: "#C9D3CB", borderRadius: 6 },
  selected: { backgroundColor: "#247A4B", borderColor: "#247A4B" },
  selectedText: { color: "white", fontSize: 16, fontWeight: "600" },
  button: { backgroundColor: "#247A4B", padding: 14, borderRadius: 6, alignItems: "center", marginTop: 8 },
  notice: { color: "#247A4B", fontSize: 16, marginBottom: 20 }
});
