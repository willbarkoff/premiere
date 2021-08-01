import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

import * as api from "../../../api";
import AddAction from "./AddAction";
import CollapseableSection from "./CollapseableSection";
import Navbar from "./Navbar";

export default function List(): JSX.Element {
	return <>
		<Navbar />
		<section className="section">
			<div className="container">
				<h1 className="title">
					<FontAwesomeIcon className="has-text-primary" icon={faPlus} />&nbsp;
					Add a movie
				</h1>
				<AddAction />

			</div>
		</section>
		<section className="section">
			<div className="container">
				<h1 className="title">
					<FontAwesomeIcon className="has-text-primary" icon={faList} />&nbsp;
					Vote on movies
				</h1>
			</div>
		</section>
	</>;
}