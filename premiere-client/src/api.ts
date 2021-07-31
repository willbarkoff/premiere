export const baseurl = process.env.API_BASEURL || "http://localhost:8675";

const formURLEncode = (body: Record<string, string>): string => {
	if (!body) {
		return "";
	}

	let paramStr = "";

	let first = true;
	for (const key in body) {
		const value = body[key];
		if (first) {
			first = false;
		} else {
			paramStr += "&";
		}
		paramStr += key;
		paramStr += "=";
		paramStr += encodeURIComponent(value);
	}

	return paramStr;
};

export const GET = async function <T>(endpoint: string, parameters?: Record<string, string>): Promise<T> {
	const queryString = parameters ? "?" + formURLEncode(parameters) : "";
	const response = await fetch(baseurl + "/" + endpoint + queryString, { credentials: "include" });
	const json = await response.json() as PremiereApiResponse;

	if (json.status == "error") {
		throw json.error;
	}

	return json.data as T;
};

export const POST = async function <T>(endpoint: string, body: Record<string, string>): Promise<T> {
	const response = await fetch(baseurl + "/" + endpoint, {
		method: "POST",
		body: formURLEncode(body),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		credentials: "include"
	});
	const json = await response.json() as PremiereApiResponse;

	if (json.status == "error") {
		throw json.error;
	}

	return json.data as T;
};

export interface PremiereApiResponse {
	status: string
	error?: string
	data?: any
}

export interface Movie {
	adult: boolean;
	backdrop_path: string;
	id: number;
	original_title: string;
	genre_ids: number[];
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	overview: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}
