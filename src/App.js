import {
  Pane,
  Text,
  TextInputField,
  Button,
  UnorderedList,
  ListItem,
  Tablist,
  Tab,
} from "evergreen-ui";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [repos, setRepos] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Followers");

  const fetchUserData = async (username) => {
    const response = await axios.get(
      `https://api.github.com/search/users?q=${username}`
    );
    if (response.data.items.length > 0) {
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

  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Pane width="60%" marginBottom={16}>
        <h1 className="header">Search Github Users</h1>
        <TextInputField
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Github Username"
          className="input"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Pane>

      {userData && (
        <Pane width="80%">
          <Text size={600}>{userData.login}</Text>
          <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
            <Tab
              isSelected={selectedTab === "Followers"}
              onSelect={() => setSelectedTab("Followers")}
            >
              Followers
            </Tab>
            <Tab
              isSelected={selectedTab === "Following"}
              onSelect={() => setSelectedTab("Following")}
            >
              Following
            </Tab>
            <Tab
              isSelected={selectedTab === "Repos"}
              onSelect={() => setSelectedTab("Repos")}
            >
              Repos
            </Tab>
          </Tablist>
          {selectedTab === "Followers" && (
            <UnorderedList>
              {followers.map((follower, index) => (
                <ListItem key={index}>{follower}</ListItem>
              ))}
            </UnorderedList>
          )}
          {selectedTab === "Following" && (
            <UnorderedList>
              {following.map((followee, index) => (
                <ListItem key={index}>{followee}</ListItem>
              ))}
            </UnorderedList>
          )}
          {selectedTab === "Repos" && (
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
