import * as React from "react";
import * as api from "../../../api";

import { signInScreenProps } from "./SignIn";

export default function RegisterForm(props: signInScreenProps): JSX.Element {
	const [fname, setFname] = React.useState("");
	const [lname, setLname] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [secretCode, setSecretCode] = React.useState("");
	const [error, setError] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (password != confirmPassword) {
			setError("The passwords you entered didn't match");
			return;
		}

		try {
			await api.POST("auth/register", {
				name: fname + " " + lname,
				email,
				password,
				secretCode
			});
			await api.POST("auth/login", {
				email, password
			});
			props.reload();
		} catch (e) {
			setError(e);
		}
	};

	return <div className="columns">
		<form className="form column" onSubmit={handleSubmit}>
			{error && <div className="notification is-warning is-light">{error}</div>}
			<div className="field">
				<div className="field-body">
					<div className="field">
						<label className="label">Preferred first name</label>
						<div className="control">
							<input className="input" type="text" value={fname} onChange={(e) => setFname(e.target.value)} required />
						</div>
					</div>
					<div className="field">
						<label className="label">Last name</label>
						<div className="control">
							<input className="input" type="text" value={lname} onChange={(e) => setLname(e.target.value)} required />
						</div>
					</div>
				</div>
			</div>

			<div className="field">
				<label className="label">Email address</label>
				<div className="control">
					<input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<p className="help">Make sure you have access to this email. You'll use it to sign in.</p>
			</div>

			<div className="field">
				<div className="field-body">
					<div className="field">
						<label className="label">Password</label>
						<div className="control">
							<input className="input" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
						</div>
					</div>
					<div className="field">
						<label className="label">Confirm Password</label>
						<div className="control">
							<input className="input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
						</div>
					</div>
				</div>
				<p className="help">Your password must contain at least one letter, one number, and must be at least 8 characters long.</p>
			</div>

			<div className="field">
				<label className="label">Secret Code</label>
				<div className="control">
					<input className="input" type="text" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} required />
				</div>
				<p className="help">This should have been provided by the organizer of movie list. If you don't have it, reach out to them.</p>
			</div>

			<input type="submit" className="button is-primary" value="Register!" />
		</form>
		<div className="column">
			<p className="block">
				Sign up for Premiere using the form on the left. If you forgot your username or password, contact the organizer of your movie list.
			</p>
			<p className="block">
				The organizer of your movie list can access all of this information, with the exception of your password, which is kept secret.
				Other people in your movie list can see your name. Apart from that, none of your information is shared.
			</p>
		</div>
	</div>;
}