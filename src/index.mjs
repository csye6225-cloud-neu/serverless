import mail from "@sendgrid/mail";

mail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler = async (event) => {
	for (const record of event.Records) {
		const message = JSON.parse(record.Sns.Message);
		const { email, token } = message;
		const verificationLink = `${process.env.DOMAIN}/verify?token=${token}`;

		// Send the email
		await sendVerificationEmail(email, verificationLink);
	}
};

async function sendVerificationEmail(to, link) {
	const msg = {
		to,
		from: process.env.EMAIL_FROM,
		subject: "Verify your account",
		text: `Please verify your email by clicking this link: ${link}. The link expires in 2 minutes.`,
		html: `<strong>Please verify your email by clicking <a href="${link}">this link</a>. The link expires in 2 minutes.</strong>`,
	};

	try {
		await mail.send(msg);
		return "success";
	} catch (error) {
		console.error("Error sending email:", error);
		return "bad request";
	}
}