import axios from "axios";

const KEY = `sodic`;
const API = `https://react.axilis.com/${KEY}`;

export async function toggleTodoStatus(todoId, isDone) {
  await axios.put(`${API}/todo/`, {
    id: todoId,
    isDone: isDone
  });
}

export async function addTodo(text) {
  return await axios.post(`${API}/todo`, { text: text });
}

export async function deleteTodo(todoId) {
  return await axios.delete(`${API}/todo/${todoId}`);
}

export async function getTodos() {
  return await axios.get(`${API}/todos`);
}
