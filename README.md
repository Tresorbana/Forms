# React Native Form Exercises

**Student:** BANA Emmy Tresor  
**Class:** Y3A

An Expo app with seven form exercises and 53 input fields. Choose a form from the home screen and use **Back to forms** to return. Required fields are marked with an asterisk, and validation messages appear below the fields.

## Exercise 1: User Registration Form

Fields: Full Name, Email, Password, Confirm Password, Phone Number, Accept Terms.

- Full name requires at least 3 characters.
- Email and phone number must have valid formats.
- Password requires at least 8 characters, and confirmation must match.
- Terms must be accepted before submitting.

## Exercise 2: Student Admission Form

Fields: Student Name, Date of Birth, Gender, Nationality, Email, Phone, Previous School, Program, Academic Score.

- All fields are required. Dates use `YYYY-MM-DD`.
- Gender options: Male, Female.
- Program options: Science, Software Development, Networking, Other.
- Academic score must be between 50 and 100.

## Exercise 3: Online Banking Transfer

Fields: Account Name, Account Number, Amount, Currency, Transfer Description, PIN.

- Account number accepts digits only, and amount must be greater than zero.
- Currency options: RWF, USD, EUR.
- Transfer description is optional, with a maximum of 100 characters.
- PIN requires exactly 4 digits.
- Review and confirm the transfer before the success message appears.

## Exercise 4: Hospital Appointment Form

Fields: Patient Name, Phone Number, Email, Department, Doctor, Appointment Date, Appointment Time, Reason for Visit.

- Email is optional; all other fields are required.
- Department options: General, Dental, Maternity, Emergency.
- Appointment date uses `YYYY-MM-DD` and cannot be in the past.
- Appointment time is entered as text, for example `09:30`.
- Reason for visit requires at least 10 characters.

## Exercise 5: Job Application Form

Fields: Full Name, Email, Phone, Position, Education Level, Years of Experience, Cover Letter, CV Selected.

- All fields are required.
- Education options: Secondary, Diploma, Bachelor, Master.
- Years of experience must be zero or greater.
- Cover letter requires at least 50 characters.
- Choose a CV using the file picker. The selected filename is displayed, and tapping it lets you choose another file.

## Exercise 6: E-Commerce Checkout Form

Fields: Customer Name, Phone, Email, Delivery Address, City, Product Quantity, Payment Method, Delivery Option.

- All fields are required.
- Product quantity must be a whole number greater than zero.
- Payment options: Mobile Money, Card, Cash on Delivery.
- Delivery options: Standard, Express.

## Exercise 7: Event Registration Form

Fields: Full Name, Email, Phone, Organization, Job Title, Attendance Type, Number of Days, Dietary Requirement.

- Dietary requirement is optional; all other fields are required.
- Attendance options: Physical, Virtual.
- Number of days must be a whole number from 1 to 3.

## Run the app

Install dependencies:

```sh
npm install
```

Start Expo and scan the QR code with Expo Go:

```sh
npm start
```

To open the web version:

```sh
npm run web
```

## Implementation

The app uses React Native, Expo, and `expo-document-picker`. Form definitions, validation, and shared field rendering are in `App.js`. It uses system fonts and a simple form menu, without Previous / Next buttons or bottom page numbers.

This is a local practice app. Form values are kept in memory while the app runs and reset on reload. Selecting a CV does not upload it. Submissions display a success message; transfers, payments, appointments, and applications are not sent to a server.
