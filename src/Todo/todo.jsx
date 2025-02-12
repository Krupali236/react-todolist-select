import { useState, useEffect } from "react";
import "./styles.css";
const TodoList = () => {
  const [inputValue, setInputValue] = useState({}); // State for input
  const [todoArray, setTodoArray] = useState([]); // State for the list of todos
  const [edited, setEdited] = useState(false); //State for the edit
  const [editIndex, setEditIndex] = useState(); //State for the edit
  const [isDeleteAll, setIsDeleteAll] = useState(false); //State for delete all
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("TodoData")) || [];
    setTodoArray(storedTodos);
    setFilteredTodos(storedTodos);
  }, []);

  const renderArray = (item) => {
    localStorage.setItem("TodoData", JSON.stringify(item));
  };

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setInputValue((inputValue) => ({
      ...inputValue,
      [name]: value,
    }));
    console.log(inputValue, "inputValue");
    console.log(todoArray, "todoArray");
  };

  const handleValidation = (values) => {
    const error = {};
    console.log(values.input.trim(" "), "values");
    if (!values?.input || !values.input.trim(" ")) {
      error.input = "Please enter your value";
      setErrors(error);
      return false;
    }
    setErrors(error);
    return true;
  };

  const handleOnClick = () => {
    const isValid = handleValidation(inputValue);
    if (isValid) {
      console.log(inputValue, "inputValueeee");
      const matchValues = todoArray.some(
        (val) => val?.input === inputValue.input
      );
      if (matchValues) {
        setErrors({ ...errors, input: "Value already exist" });
        return;
      }
      if (edited) {
        const EditedValue = inputValue.input;
        const updateData = todoArray.map((v, idx) => {
          console.log(todoArray[idx].input, "todoArray[idx].input");
          console.log(EditedValue, "EditedValue");
          if (editIndex === idx) {
            todoArray[idx].input = EditedValue;
            return { ...v, input: EditedValue };
          } else {
            return v;
          }
        });
        console.log(updateData, "updateData");
        renderArray(updateData);
        setTodoArray(updateData);
        setFilteredTodos(updateData);
        setInputValue({});
        setEdited(false);
      } else {
        const storeValue = inputValue.input;
        const addData = [
          ...todoArray,
          { input: storeValue, isCompleted: false },
        ];
        setTodoArray(addData);
        setFilteredTodos(addData);
        console.log(todoArray, "todoArray");
        setInputValue({});
        renderArray(addData);
      }
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setInputValue({ ...inputValue, input: todoArray[index].input });
    setEdited(true);
  };

  const handleCompleted = (value, index) => {
    const updateArray = todoArray.map((v, ind) => {
      if (ind === index) {
        return { ...v, isCompleted: !value };
      } else {
        return v;
      }
    });
    console.log(updateArray, "updateArray");
    renderArray(updateArray);
    setTodoArray(updateArray);
    setFilteredTodos(updateArray);
  };

  const handleDelete = (index) => {
    if (edited) {
      setErrors({ ...errors, input: "Complete your edit task first" });
      return;
    }
    const update = todoArray.filter((_, idx) => idx !== index);
    console.log("updateArray", update);
    setTodoArray(update);
    setFilteredTodos(update);
    renderArray(update);
  };

  useEffect(() => {
    if (isDeleteAll) {
      setIsDeleteAll(false);
    }
  }, [isDeleteAll]);

  const HandleDeleteAll = (e) => {
    if (edited) {
      setErrors({ ...errors, input: "Complete your edit task first" });
      return;
    }
    if (isSelectedAll == true) {
      e.preventDefault();
      setTodoArray([]);
      setFilteredTodos([]);
      setInputValue({});
      setIsDeleteAll(true);
      renderArray([]);
      isSelectedAll(false);
    }
  };

  const handleDisplay = (status) => {
    console.log("display", status);
    let task;
    if (status === "all") {
      task = todoArray;
    } else if (status === "done") {
      task = todoArray.filter((v) => v.isCompleted);
    } else if (status === "todo") {
      task = todoArray.filter((v) => !v.isCompleted);
    }
    console.log(task, "task");
    setFilteredTodos(task);
  };

  const handleDeleteDoneTask = () => {
    if (edited) {
      setErrors({ ...errors, input: "Complete your edit task first" });
      return;
    }
    const deleteDone = todoArray.filter((v) => v?.isCompleted !== true);
    console.log(deleteDone, "Delete");
    setTodoArray(deleteDone);
    setFilteredTodos(deleteDone);
    renderArray(deleteDone);
  };

  const handleSelected = (value, index) => {
    const selectedTask = todoArray.map((v, ind) =>
      ind === index ? { ...v, isSelected: !value } : v
    );

    // Check if all items are selected correctly
    const allSelected = selectedTask.every((v) => v.isSelected);

    setIsSelectedAll(allSelected); // Update state

    renderArray(selectedTask);
    setTodoArray(selectedTask);
    setFilteredTodos(selectedTask);

    console.log(allSelected, "isSelectedAll");
    console.log(selectedTask, "selectedTask");
  };

  const handleSelectedAll = () => {
    const newSelectedState = !isSelectedAll;
    setIsSelectedAll(newSelectedState);

    const selectedAll = todoArray.map((v) => ({
      ...v,
      isSelected: newSelectedState,
    }));

    renderArray(selectedAll);
    setTodoArray(selectedAll);
    setFilteredTodos(selectedAll);
  };
  const handleDeleteSelectedTask = () => {
    console.log("selected delete");
    if (isSelectedAll == true) {
      setTodoArray([]);
      setFilteredTodos([]);
      setInputValue({});
      setIsDeleteAll(true);
      renderArray([]);
    } else {
      const deleteTask = todoArray.filter((v, ind) => {        
        return v?.isSelected !== true;
      });
      setTodoArray(deleteTask);
      setFilteredTodos(deleteTask);
      renderArray(deleteTask);
      setIsSelectedAll(false);
      console.log(deleteTask, "deletetask");
    }
  };
  return (
    <>
      <div className="lg:container">
        <h1 className="text-3xl">TodoInput</h1>
        <div className="my-5 border-2 rounded-md">
          <div className="my-4">
            <input
              type="text"
              name="input"
              value={inputValue?.input || ""}
              placeholder="New Todo"
              className={
                !errors?.input
                  ? "p-4 w-96 rounded-md border-[1px] border-solid border-gray-300"
                  : "p-4 w-96 rounded-md border-[1px] border-solid border-red-600"
              }
              onChange={(e) => handleOnchange(e)}
            />
            {errors?.input && (
              <div className="text-red-600 font-semibold">{errors?.input}</div>
            )}
          </div>
          <div className="my-4">
            <button
              type="submit"
              className="p-3 rounded-md w-96 mx-5 bg-blue-800 text-white font-semibold text-lg"
              onClick={handleOnClick}
            >
              {edited ? "Update" : "Add"}
            </button>
          </div>
        </div>
        <h1 className=" text-3xl">TodoList</h1>
        <div className="my-4 flex justify-around items-center mx-5">
          <span>
            {isSelectedAll ? (
              <i
                className="fa-solid fa-square-check text-2xl mx-2 text-blue-800 cursor-pointer"
                onClick={handleSelectedAll}
              ></i>
            ) : (
              <i
                className="fa-regular fa-square-check text-2xl mx-2 text-blue-800 cursor-pointer"
                onClick={handleSelectedAll}
              ></i>
            )}
          </span>
          <button
            className="bg-blue-800 w-32 text-white rounded-md mx-4"
            onClick={() => {
              handleDisplay("all");
            }}
          >
            All
          </button>
          <button
            className="bg-blue-800 w-32 text-white rounded-md mx-4"
            onClick={() => {
              handleDisplay("done");
            }}
          >
            Done
          </button>
          <button
            className="bg-blue-800 w-32 text-white rounded-md mx-4"
            onClick={() => {
              handleDisplay("todo");
            }}
          >
            Todo
          </button>
        </div>
        <div className="ListItem" key={todoArray.input}>
          {filteredTodos.length > 0 ? (
            filteredTodos?.map((val, ind) => {
              return (
                <div className="flex items-center" key={ind}>
                  <span>
                    {!val.isSelected ? (
                      <i
                        className="fa-regular fa-square-check text-2xl mx-2 text-blue-800 cursor-pointer"
                        onClick={() => handleSelected(val.isSelected, ind)}
                      ></i>
                    ) : (
                      <i
                        className="fa-solid fa-square-check text-2xl mx-2 text-blue-800 cursor-pointer"
                        onClick={() => handleSelected(val.isSelected, ind)}
                      ></i>
                    )}
                  </span>
                  <div
                    key={ind}
                    className="w-full border-2 bg-transparent rounded-md text-start font-semibold font-sans flex justify-between p-3 my-2"
                  >
                    {val.input}

                    <span className="flex flex-row items-center">
                      {val.isCompleted ? (
                        <i
                          className="fa-solid fa-square-check text-2xl mx-2 text-green-600 cursor-pointer"
                          onClick={() => handleCompleted(val.isCompleted, ind)}
                        ></i>
                      ) : (
                        <i
                          className="fa-regular fa-square-check text-2xl mx-2 text-green-600 cursor-pointer"
                          onClick={() => handleCompleted(val.isCompleted, ind)}
                        ></i>
                      )}

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="orange"
                        className="size-6 mx-1 cursor-pointer"
                        onClick={() => {
                          handleEdit(ind);
                        }}
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                      </svg>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#b91c1c"
                        className="size-6 mx-1 cursor-pointer"
                        onClick={() => handleDelete(ind)}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No Data Found</div>
          )}
        </div>
        <div className="my-4 flex justify-around">
          <button
            className="bg-red-700 text-white p-3 w-40 rounded-md"
            onClick={(e) => handleDeleteSelectedTask(e)}
          >
            Delete
          </button>
          <button
            className="bg-red-700 text-white p-3 w-40 rounded-md"
            onClick={(e) => handleDeleteDoneTask(e)}
          >
            Delete Done Task
          </button>
          <button
            className="bg-red-700 text-white p-3 w-40 rounded-md"
            onClick={(e) => HandleDeleteAll(e)}
          >
            Delete All Task
          </button>
        </div>
      </div>
    </>
  );
};
export default TodoList;
