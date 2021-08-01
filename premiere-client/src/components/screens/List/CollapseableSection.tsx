import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./CollapseableSection.sass";

export interface CollapseableSectionProps {
	children: React.ReactChild[] | React.ReactChild
	active: boolean
	icon: IconProp
	title: string
	onTitleClick?: () => void
}


export default function CollapseableSection(props: CollapseableSectionProps): JSX.Element {
	return <section className="collapseable py-5">
		<div className="container">
			<h1 className="title clickable" onClick={props?.onTitleClick}>
				<FontAwesomeIcon className="has-text-primary" icon={props.icon} />&nbsp; {props.title}
			</h1>
			<div className={`collapseable-interior ${props.active ? "" : "is-collapsed"}`}>
				{props.children}
			</div>
		</div>
	</section>;
}