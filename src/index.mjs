import mail from "@sendgrid/mail";
import { SecretsManager, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secretsManager = new SecretsManager({ region: "us-east-1" });

export const handler = async (event) => {
	const secret_name = "sendgrid_api_key";

	// Fetch the sendgrid API key from Secrets Manager
	const apiKey = (await getSecretValue(secret_name)).apikey;
	mail.setApiKey(apiKey);

	for (const record of event.Records) {
		const message = JSON.parse(record.Sns.Message);
		const { email, token } = message;
		const verificationLink = `https://${process.env.DOMAIN}/verify?token=${token}`;

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

async function getSecretValue(secret_name) {
	try {
		const data = await secretsManager.send(new GetSecretValueCommand({ SecretId: secret_name, VersionStage: "AWSCURRENT" }));
		return JSON.parse(data.SecretString);
	} catch (err) {
		console.error("Error retrieving secret:", err);
		throw new Error("Could not retrieve secret");
	}
}
