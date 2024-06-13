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
	Avatar,
} from "evergreen-ui";
import React, { useState } from "react";
import axios from "axios";
import Repo from "./components/Repo";

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
			/* PRINT USER DATA */
			//		console.log("User Data: ");
			//		console.log(response.data);
			/* PRINT USER DATA */

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

		/* PRINT USER REPOS */
		//		console.log("User Repos: ");
		//		console.log(response.data);
		/* PRINT USER REPOS */

		setRepos(response.data);
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
					label={"Github Username"}
					className="input"
					width={"100%"}
				/>
				<Button onClick={handleSubmit}>Submit</Button>
			</Pane>

			{userData && (
				<Pane width="100vw" left={0} marginX={0}>
					{/* User basic display */}
					<Pane
						display={"flex"}
						alignItems={"center"}
						gap={"1rem"}
						marginBottom={"1rem"}
						width={"80vw"}
						marginLeft={"10vw"}
					>
						<Avatar src={userData.avatar_url} name="" size={60} />

						<Text fontSize={"1.5rem"}>{userData.login}</Text>
					</Pane>

					{/* Tabs */}
					<Group width={"80vw"} marginLeft={"10vw"}>
						{options.map(({ label, value }) => (
							<Button
								key={label}
								isActive={selectedValue === value}
								onClick={() => {
									setSelectedValue(value);
									setSelectedTab(value);
								}}
								fontSize={"1.15rem"}
								paddingY={"1.25rem"}
								paddingX={"1.75rem"}
								borderRadius={"1rem"}
							>
								{label}
							</Button>
						))}
					</Group>

					{/* Content */}
					{selectedTab === "followers" && (
						<UnorderedList>
							{followers.map((follower, index) => (
								<ListItem key={index} fontSize={"1rem"}>
									{follower}
								</ListItem>
							))}
						</UnorderedList>
					)}
					{selectedTab === "following" && (
						<UnorderedList>
							{following.map((followee, index) => (
								<ListItem fontSize={"1rem"} key={index}>
									{followee}
								</ListItem>
							))}
						</UnorderedList>
					)}
					{selectedTab === "repos" && (
						<Pane width={"80vw"} marginLeft={"10vw"}>
							{repos.map((repo, index) => (
								<div key={index}>
									{/* <ListItem fontSize={"1rem"} key={index}>
									{repo}
								</ListItem> */}
									<Repo repo={repo} />
								</div>
							))}
						</Pane>
					)}
				</Pane>
			)}
		</Pane>
	);
}

export default App;
