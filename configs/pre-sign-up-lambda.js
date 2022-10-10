exports.handler = (event, context, callback) => {
  const env = process.env.ENV_URL

  const imageUrl = process.env.IMAGE_URL

  const generateEmailBody = (body, link, extraBody = '') => `
      <html>
          <body>
              <p>${body}<span style="font-weight: bold; text-decoration: underline;">${extraBody}</span></p>
              
              <a href="${link}">${link}</a>

              <br />
              <img width="249px" height="139px" style="margin-top: 20px;" alt="logo" src="${imageUrl}" />
          </body>
      </html>
  `

  if (event.triggerSource === 'CustomMessage_SignUp') {
    event.response.emailSubject = 'Welcome to the VitalOp'
    event.response.emailMessage = generateEmailBody(
      `VitalOp is so excited to welcome you! To finalize your registration please click the link provided,`,
      `${env}/viom/public/email-confirm-request?code={####}&username=${event.request.userAttributes.nickname}`,
      ` USING THE DEVICE THE APP IS DOWNLOADED ON.`,
    )
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = 'Restore password'
    event.response.emailMessage = generateEmailBody(
      'This email contains the link to restore your VitalOp password. If you did not ask to change your password, please ignore this message. To restore your password click the link provided.',
      `${env}/viom/public/create-new-password?code={####}&email=${event.request.userAttributes.email}`,
    )
  }

  if (event.triggerSource === 'CustomMessage_ResendCode') {
    event.response.emailSubject = 'Resend Confirmation Code'
    event.response.emailMessage = generateEmailBody(
      'VitalOp is so excited to welcome you! To finalize your registration please click the link provided.',
      `${env}/viom/public/email-confirm-request?code={####}&username=${event.request.userAttributes.nickname}`,
    )
  }

  if (
    event.triggerSource === 'CustomMessage_UpdateUserAttribute' ||
    event.triggerSource === 'CustomMessage_VerifyUserAttribute'
  ) {
    event.response.emailSubject = 'Confirm email change'
    event.response.emailMessage = generateEmailBody(
      'You have changed your email for the VitalOp application. To confirm the changes kindly click the provided link.',
      `${env}/viom/public/confirm-email-change?code={####}`,
    )
  }

  console.log(event)

  return callback(null, event)
}
