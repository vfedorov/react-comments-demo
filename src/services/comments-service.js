import axios from "axios";

interface IGetComments {
  page: number;
  limit?: number;
}

const readCommentsApiURL = 'https://jsonplaceholder.typicode.com/comments'
const addCommentsApiURL = 'https://test.steps.me/test/testAssignComment'

//load comments from api based on page and limit count
const loadComments = ({ page, limit = 20 }: IGetComments) =>
  axios
    .get(
      `${readCommentsApiURL}?_page=${page}&_limit=${limit}`
    )

//save new comment
const addComment = (newCommment) =>
  axios
    .post(
      `${addCommentsApiURL}`,
      {newCommment}
    )

export const commentsService = {
  loadComments,
  addComment,
}