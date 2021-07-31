import * as React from "react";
import * as api from "../../../api";

import { signInScreenProps } from "./SignIn";

export default function SignInForm(props: signInScreenProps): JSX.Element {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [error, setError] = React.useState("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
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
				<label className="label">Email</label>
				<div className="control">
					<input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>
			</div>

			<div className="field">
				<label className="label">Password</label>
				<div className="control">
					<input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>
			</div>

			<input type="submit" className="button is-primary" value="Log in!" />
		</form>
		<div className="column">
			<p className="block">
				Sign into Premiere using the form on the left. If you forgot your username or password, contact the organizer of your movie list.
			</p>
			<p className="block">
				Premiere is open source software, available on GitHub! <a href="https://willbarkoff.dev/premiere" target="_blank" rel="noopener noreferrer">Learn more about Premiere</a>.
			</p>
		</div>
	</div>;
}