import React, { Component } from "react";
import App from "../components/App";
import * as API from "../utilities/api";

class AppContainer extends Component {
  constructor() {
    super();

    this.state = {
      filterText: "",
      addText: "",
      isLoading: false,
      hasError: false,
      todos: []
    };
  }

  // helper methods

  setError = () => this.setState({ hasError: true });

  processRequest = async ({ apiCall, onSuccess, onFail }) => {
    this.setState({ isLoading: true });
    try {
      let resp = await apiCall();
      onSuccess(resp);
    } catch (err) {
      onFail(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  // methods used to update the state on the client (no communication with the server)

  updateList = todos =>
    this.setState({
      todos: todos
    });

  addToList = todo => {
    this.setState({
      addText: "",
      filterText: "",
      todos: [
        ...this.state.todos,
        { id: todo.id, text: todo.text, isDone: false }
      ]
    });
  };

  removeFromList = todoId =>
    this.setState({
      todos: this.state.todos.filter(t => t.id !== todoId)
    });

  updateTodoStatus = (todoId, isDone) => {
    this.setState({
      todos: this.state.todos.map(
        todo => (todo.id === todoId ? { ...todo, isDone: isDone } : todo)
      )
    });
  };

  filter = (todos, filter) => {
    if (filter && filter.trim().length > 0) {
      return todos.filter(t => t.text.indexOf(filter) > -1);
    }
    return todos;
  };

  onFilterTextChanged = text => {
    this.setState({
      filterText: text
    });
  };

  onAddTextChanged = text => {
    this.setState({
      addText: text
    });
  };

  // methods which communicate with the server

  async componentDidMount() {
    await this.processRequest({
      apiCall: API.getTodos,
      onSuccess: resp => this.updateList(resp.data),
      onFail: this.setError
    });
  }

  handleAddButtonClick = async () => {
    const text = this.state.addText.trim();

    if (!text.length) {
      return;
    }

    await this.processRequest({
      apiCall: () => API.addTodo(text),
      onSuccess: resp => this.addToList(resp.data),
      onFail: this.setError
    });
  };

  handleIsDoneToggle = async (todoId, isDone) => {
    await this.processRequest({
      apiCall: () => API.toggleTodoStatus(todoId, isDone),
      onSuccess: () => this.updateTodoStatus(todoId, isDone),
      onFail: this.setError
    });
  };

  handleTrashClicked = async todoId => {
    await this.processRequest({
      apiCall: () => API.deleteTodo(todoId),
      onSuccess: () => this.removeFromList(todoId),
      onFail: this.setError
    });
  };

  render() {
    return (
      <App
        filterText={this.state.filterText}
        addText={this.state.addText}
        isLoading={this.state.isLoading}
        hasError={this.state.hasError}
        todos={this.filter(this.state.todos, this.state.filterText)}
        handleIsDoneToggle={this.handleIsDoneToggle}
        handleTrashClicked={this.handleTrashClicked}
        onFilterTextChanged={this.onFilterTextChanged}
        onAddTextChanged={this.onAddTextChanged}
        handleAddButtonClick={this.handleAddButtonClick}
      />
    );
  }
}

export default AppContainer;
