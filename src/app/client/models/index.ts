export enum SignupResponse {
  OK = 'Ok',
  EMAIL_ALREADY_IN_USE = 'Email sa už používa!',
  UNKNOWN_ERROR = 'Niečo sa pokazilo, skúste znova.'
}

export enum LoginResponse {
  OK = 'Ok',
  EMAIL_NOT_VERIFIED = 'Táto emailová adresa nieje aktivovaná.',
  INVALID_CREDENTIAL = 'Nesprávne prihlasovacie údaje.'
}
