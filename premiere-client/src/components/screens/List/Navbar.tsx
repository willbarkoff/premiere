import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

import * as api from "../../../api";

export default function Navbar(): JSX.Element {
	const logout = async () => {
		await api.POST("auth/logout", {});
		document.location.reload();
	};

	return <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
		<div className="navbar-brand">
			<a className="navbar-item" href="https://bulma.io">
				<strong><FontAwesomeIcon icon={faTicketAlt} />&nbsp;Premiere</strong>
			</a>
		</div>

		<div className="navbar-end">
			<div className="navbar-item">
				<div className="buttons">
					<a className="button is-light" onClick={logout}>
						Log out
					</a>
				</div>
			</div>
		</div>
	</nav>;
}