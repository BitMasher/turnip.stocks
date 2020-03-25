import React from "react";
import Card from "@material-ui/core/Card";
import {Avatar, CardHeader, List, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import FaceIcon from "@material-ui/icons/Face"
import PhotoIcon from '@material-ui/icons/Photo';

function Credits() {
	return (
		<Card elevation={4}>
			<CardHeader title="Credits"/>
			<CardContent>
				<List>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<FaceIcon/>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Created by bitmasher.dev"
							secondary="https://twitch.tv/bitmasher"
						/>
					</ListItem>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<PhotoIcon/>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Cover Photo by philippe collard on Unsplash"
						/>
					</ListItem>
					<ListItem>
						<ListItemAvatar>
							<Avatar>
								<PhotoIcon/>
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Turnip Icon by Smalllike from the Noun Project"
						/>
					</ListItem>
				</List>
			</CardContent>
		</Card>
	)
}

export default Credits;
