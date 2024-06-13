import {
	Pane,
	Text,
	TextInputField,
	Button,
	UnorderedList,
	ListItem,
	Tablist,
	Tab,
	Group,
} from "evergreen-ui";
import React, { useState } from "react";
import axios from "axios";

function App() {
	const [username, setUsername] = useState("");
	const [userData, setUserData] = useState(null);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [repos, setRepos] = useState([]);
	const [selectedTab, setSelectedTab] = useState("followers");

	const fetchUserData = async (username) => {
		const response = await axios.get(
			`https://api.github.com/search/users?q=${username}`
		);
		if (response.data.items.length > 0) {
			console.log(response.data);
			setUserData(response.data.items[0]);
			fetchFollowers(response.data.items[0].followers_url);
			fetchFollowing(
				response.data.items[0].following_url.replace("{/other_user}", "")
			);
			fetchRepos(response.data.items[0].repos_url);
		}
	};

	const fetchFollowers = async (url) => {
		const response = await axios.get(url);
		setFollowers(response.data.map((follower) => follower.login));
	};

	const fetchFollowing = async (url) => {
		const response = await axios.get(url);
		setFollowing(response.data.map((followee) => followee.login));
	};

	const fetchRepos = async (url) => {
		const response = await axios.get(url);
		setRepos(response.data.map((repo) => repo.name));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		fetchUserData(username);
	};

	const options = React.useMemo(
		() => [
			{ label: "Followers", value: "followers" },
			{ label: "Following", value: "following" },
			{ label: "Repos", value: "repos" },
		],
		[]
	);
	const [selectedValue, setSelectedValue] = React.useState("followers");

	return (
		<Pane
			display="flex"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
		>
			<h1 className="header">Search Github Users</h1>
			<Pane width="70vw" marginBottom={16} display={"flex"} gap={"1rem"}>
				<TextInputField
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Github Username"
					className="input"
					width={"100%"}
				/>
				<Button onClick={handleSubmit}>Submit</Button>
			</Pane>

			{userData && (
				<Pane width="80%">
					<img src={userData.avatar_url} />

					<Text size={600}>{userData.login}</Text>

					<Group>
						{options.map(({ label, value }) => (
							<Button
								key={label}
								isActive={selectedValue === value}
								onClick={() => {
									setSelectedValue(value);
									setSelectedTab(value);
								}}
							>
								{label}
							</Button>
						))}
					</Group>

					{selectedTab === "followers" && (
						<UnorderedList>
							{followers.map((follower, index) => (
								<ListItem key={index}>{follower}</ListItem>
							))}
						</UnorderedList>
					)}
					{selectedTab === "following" && (
						<UnorderedList>
							{following.map((followee, index) => (
								<ListItem key={index}>{followee}</ListItem>
							))}
						</UnorderedList>
					)}
					{selectedTab === "repos" && (
						<UnorderedList>
							{repos.map((repo, index) => (
								<ListItem key={index}>{repo}</ListItem>
							))}
						</UnorderedList>
					)}
				</Pane>
			)}
		</Pane>
	);
}

export default App;
