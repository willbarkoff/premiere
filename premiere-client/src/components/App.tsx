import * as React from "react";

import * as api from "../api";

import "./App.sass";
import LoadingIndicator from "./LoadingIndicator";
import List from "./screens/List/List";
import SignInScreen from "./screens/SignIn/SignIn";

// FIXME: should have default value
//@ts-expect-error see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
export const ContextData = React.createContext<{ context: api.ContextData, fetchContext() }>();

export default function App(): JSX.Element {
	const [isLoading, setIsLoading] = React.useState(true);
	const [context, setContext] = React.useState(null as null | any);

	const fetchContext = async () => {
		try {
			const context = await api.GET("auth/context");
			setContext(context);
			setIsLoading(false);
		} catch (e) {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		fetchContext();
	}, []);

	if (isLoading) {
		return <LoadingIndicator />;
	}

	if (!context) {
		return <SignInScreen reload={fetchContext} />;
	}

	return <ContextData.Provider value={{ context, fetchContext }}>
		<List />
	</ContextData.Provider>;
}