import { Typography, Box, Link } from "@mui/material";

const VoteResultsBox = (props) => {
  const { caption, data, url } = props;
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        width: caption === "Creator" ? 700 : 300,
        height: 100,
        borderRadius: 2,
        margin: "auto",
      }}
    >
      <Typography
        sx={{
          position: "relative",
          padding: "5px",
          fontSize: "0.9rem",
          fontWeight: "200",
        }}
      >
        {caption}
      </Typography>
      {url ? (
        <Link
          sx={{
            position: "relative",
            top: "15%",
            color: "#55ade8",
          }}
          href={url}
          target="_blank"
          underline="hover"
        >
          {data}
        </Link>
      ) : (
        <Typography
          sx={{
            position: "relative",
            top: "15%",
          }}
        >
          {data}
        </Typography>
      )}
    </Box>
  );
};

export default VoteResultsBox;
