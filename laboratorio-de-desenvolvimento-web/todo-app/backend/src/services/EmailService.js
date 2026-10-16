import nodemailer from "nodemailer";

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587", 10);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // porta 587 usa STARTTLS
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

export async function sendPasswordResetEmail(toEmail, token) {
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

  // Modo de desenvolvimento: sem credenciais, apenas imprime o link no terminal
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log(`[DEV] Link de redefinição de senha para ${toEmail}: ${resetLink}`);
    return;
  }

  await transporter.sendMail({
    from: `"ToDo App" <${EMAIL_USER}>`,
    to: toEmail,
    subject: "Redefinição de senha",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Redefinição de senha</h2>
        <p>Você solicitou a redefinição da senha para sua conta no <strong>ToDo App</strong>.</p>
        <p>Clique no botão abaixo para escolher uma nova senha. Este link expira em <strong>1 hora</strong>:</p>
        <p style="margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Redefinir senha
          </a>
        </p>
        <p>Se você não solicitou isso, pode ignorar este email com segurança.</p>
      </div>
    `,
  });
}