import { Pane, Pill, Text } from "evergreen-ui";
import { FaRegStar } from "react-icons/fa";
import { GoRepoForked } from "react-icons/go";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Repo = ({ repo }) => {
	const [contributors, setContributors] = useState();

	return (
		<Pane
			marginY={"0.5rem"}
			padding={"0.75rem"}
			borderRadius={"1rem"}
			border={"1px solid gainsboro"}
		>
			<Text color={"black"}>{repo.name}</Text>
			<Pane display={"flex"} gap={"1rem"} marginTop={"0.25rem"}>
				<Pane display={"flex"} alignItems={"center"} gap={"0.25rem"}>
					<FaRegStar size={16} color="gray" />
					<Text fontSize={"0.8rem"} color={"gray"}>
						{repo.stargazers_count}
					</Text>
				</Pane>
				<Pane display={"flex"} alignItems={"center"} gap={"0.25rem"}>
					<GoRepoForked size={16} color="gray" />
					<Text fontSize={"0.8rem"} color={"gray"}>
						{repo.forks_count}
					</Text>
				</Pane>
			</Pane>
			<Pane display={"flex"} gap={"0.25rem"} marginTop={"0.5rem"}>
				{repo.topics.map((topic, i) => (
					<Pill textTransform={"capitalize"} key={i}>
						{topic}
					</Pill>
				))}
			</Pane>
		</Pane>
	);
};

export default Repo;
