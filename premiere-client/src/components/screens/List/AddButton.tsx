import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import * as api from "../../../api";
import { ContextData } from "../../App";
import ErrorModal from "../../ErrorModal";

export default function AddButton(props: { id: number }): JSX.Element {
	const [isLoading, setLoading] = React.useState(false);
	const [isAdded, setIsAdded] = React.useState(false);
	const [error, setError] = React.useState("");

	return <>
		<ErrorModal active={!!error} dismiss={() => setError("")}>
			{error && api.decodeError(error)}
		</ErrorModal>

		<ContextData.Consumer children={(contextData) => {
			const addMovie = async () => {
				try {
					await api.POST("movies/add", { "id": "" + props.id });
					contextData.fetchContext();
					setIsAdded(true);
				} catch (e) {
					setError(e);
				} finally {
					setLoading(false);
				}
			};

			if (isAdded) {
				return <button
					className="button is-success is-small mt-1 is-disabled"
				>
					<FontAwesomeIcon icon={faCheck} />
				</button>;
			}

			return <button
				className={`button is-primary is-small mt-1 ${isLoading ? "is-disabled is-loading" : ""}`}
				onClick={addMovie}
			>
				Add to list
			</button>;
		}} />
	</>;
}