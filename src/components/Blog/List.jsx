import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getAllBlogs } from "../../services/api.js"; // Assuming you have your API call in a separate file
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

export const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        if (Array.isArray(data.content)) {
          setBlogs(data.content);
        } else {
          console.error("API response is not an array");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * blogsPerPage;
  const selectedBlogs = blogs.slice(startIndex, startIndex + blogsPerPage);

  return (
    <Box
      sx={{
        position: "relative",
        width: 1181,
        marginLeft: "100px",
      }}
    >
      {selectedBlogs.map((blog) => (
        <Box
          key={blog.id}
          sx={{
            display: "flex",
            marginTop: 8,
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box
            component="img"
            sx={{
              width: 250,
              height: 160,
              flexShrink: 0,
            }}
            alt="Thumbnail"
            src={blog.thumbnail}
          />
          <Box>
            <Link to={`/blog/${blog.id}`} style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "#171a1f",
                  fontSize: 23,
                  lineHeight: "25px",
                }}
              >
                {blog.title}
              </Typography>
            </Link>
            <Typography
              sx={{
                color: "#171a1f",
                fontSize: "16px",
                marginTop: 1,
              }}
            >
              {blog.content.slice(0, 300)}
            </Typography>
            <Typography
              sx={{
                color: "#9095a0",
                fontSize: 13,
                marginTop: 1,
              }}
            >
              {new Date(blog.creationDate).toLocaleDateString()} |{" "}
              {new Date(blog.creationDate).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      ))}
      <Divider sx={{ marginY: 2 }} />
      <Stack spacing={2} alignItems="center" marginBottom={2}>
        <Pagination
          count={Math.ceil(blogs.length / blogsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Stack>
    </Box>
  );
};

export default BlogList;
