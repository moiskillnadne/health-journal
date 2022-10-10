exports.handler = (event, context, callback) => {
  const generateEmailBody = (body, link) => `
      <html>
          <body>
              <p>${body}</p>
              <a href="${link}">${link}</a>
          </body>
      </html>
  `

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = 'Restore password'
    event.response.emailMessage = generateEmailBody(
      'This email contains the link to restore your VitalOp password. If you did not ask to change your password, please ignore this message. To restore your password click the link provided.',
      'http://localhost:3000/viom/public/restore-password-request?code={####}',
    )
  }

  console.log(event)

  return callback(null, event)
}
