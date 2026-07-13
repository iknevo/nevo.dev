type Props = {
  resetUrl: string;
};

export default function PasswordResetEmail({ resetUrl }: Props) {
  return (
    <div style={body}>
      <div style={container}>
        <p style={logo}>NEVO.dev</p>
        <h1 style={heading}>Password Reset</h1>
        <p style={text}>
          You requested a password reset for your account. Click the button below to set a new
          password. This link expires in 10 minutes.
        </p>
        <a href={resetUrl} style={button}>
          Reset Password
        </a>
        <hr style={divider} />
        <p style={footer}>If you didn&apos;t request this, you can safely ignore this email.</p>
      </div>
    </div>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#0a0a0a",
  margin: "0",
  padding: "0",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container: React.CSSProperties = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "48px 24px",
};

const logo: React.CSSProperties = {
  color: "#d84e2c",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  margin: "0 0 32px",
};

const heading: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const text: React.CSSProperties = {
  color: "#a0a0a0",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 32px",
};

const button: React.CSSProperties = {
  backgroundColor: "#d84e2c",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "12px 24px",
  borderRadius: "6px",
  display: "inline-block",
};

const divider: React.CSSProperties = {
  borderColor: "#222222",
  margin: "32px 0",
};

const footer: React.CSSProperties = {
  color: "#666666",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
};
