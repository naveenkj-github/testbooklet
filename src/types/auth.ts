export interface StudentCredentials {
  name: string
  passcode: string
}

export interface AuthSession {
  name: string
  passcode: string
  testId: string
  testTitle: string
  loggedInAt: string
}

export interface LoginFormValues {
  name: string
  passcode: string
}
