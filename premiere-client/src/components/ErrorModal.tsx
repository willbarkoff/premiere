import * as React from "react";
import ModalCard from "./ModalCard";

export interface ErrorModalProps {
	children: React.ReactChild[] | React.ReactChild
	active: boolean
	dismiss(): void
}

export default function ErrorModal(props: ErrorModalProps): JSX.Element {
	return <ModalCard
		active={props.active}
		buttons={[
			<button onClick={props.dismiss} className="button">Close</button>
		]}
		title="Uh oh..."
		onClose={props.dismiss}
	>
		{props.children}
	</ModalCard>;
}