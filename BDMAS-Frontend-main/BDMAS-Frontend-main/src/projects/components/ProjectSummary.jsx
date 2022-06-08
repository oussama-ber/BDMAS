import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Button,
  CardMedia,
  CardActions,
} from "@mui/material";
import React from "react";

const ProjectSummary = (props) => {
  const { loading = false } = props;
  return (
    <Card>
      <CardHeader
        avatar={
          loading ? (
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          ) : (
            <Avatar
              alt="Ted talk"
              src="https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg"
            />
          )
        }
        // action={
        //   loading ? (
        //     <Skeleton
        //       sx={{ height: 100 }}
        //       animation="wave"
        //       variant="rectangular"
        //     />
        //   ) : (
        //     <Button aria-label="settings">blalba</Button>
        //   )
        // }
        title={
          loading ? (
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : (
            "Ted"
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" height={10} width="40%" />
          ) : (
            "5 hours ago"
          )
        }
      />
      {loading ? (
        <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      ) : (
        <CardMedia
          component="img"
          height="140"
          image="https://pi.tedcdn.com/r/talkstar-photos.s3.amazonaws.com/uploads/72bda89f-9bbf-4685-910a-2f151c4f3a8a/NicolaSturgeon_2019T-embed.jpg?w=512"
          alt="Nicola Sturgeon on a TED talk stage"
        />
      )}
      <CardActions>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={89}
            height={36}
          />
        ) : (
          <Button aria-label="settings">blalba</Button>
        )}
      </CardActions>
    </Card>
  );
};
export default ProjectSummary;
