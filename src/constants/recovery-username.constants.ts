export const recoveryUsernameMailOptions = (username: string) => ({
  subject: 'Recover Username',
  body: `This email contains your Username. If you did not ask to recover your Username, please ignore this message. Please use the provided Username to login.

Your username: ${username}`,
})
