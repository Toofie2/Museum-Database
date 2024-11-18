import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useAuth } from "../../components/authentication";
import AddTaskModal from "../../components/AddTaskModal";

// Define TaskCard as a separate component with PropTypes
const TaskCard = ({ taskData, onStatusUpdate, onDelete, isAdmin }) => {
  TaskCard.propTypes = {
    taskData: PropTypes.shape({
      employee_task_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      is_completed: PropTypes.bool.isRequired,
      due_date: PropTypes.string.isRequired,
      employee_name: PropTypes.string,
    }).isRequired,
    onStatusUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  const formatDueDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-800">
              {taskData.name}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                taskData.is_completed
                  ? "bg-green-100 text-green-800"
                  : new Date(taskData.due_date) < new Date()
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {taskData.is_completed ? "Completed" : "Pending"}
            </span>
          </div>

          <p className="text-gray-600 mb-3">{taskData.description}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-gray-500">Due:</span>{" "}
                <span
                  className={`font-medium ${
                    !taskData.is_completed &&
                    new Date(taskData.due_date) < new Date()
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {formatDueDate(taskData.due_date)}
                </span>
              </div>
              {isAdmin && (
                <div>
                  <span className="text-gray-500">Assigned to:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {taskData.employee_name || "Unassigned"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={taskData.is_completed ? "completed" : "pending"}
                onChange={(e) =>
                  onStatusUpdate(taskData.employee_task_id, e.target.value)
                }
                className="text-sm border rounded-md px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              {isAdmin && (
                <button
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(taskData.employee_task_id);
                  }}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, role } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      let endpoint = `${import.meta.env.VITE_BACKEND_URL}/employee_task`;

      if (role !== "admin") {
        endpoint += `?employee_id=${userId}`;
      }

      console.log("Fetching from endpoint:", endpoint);
      console.log("Current user ID:", userId);
      console.log("Current role:", role);

      const response = await axios.get(endpoint);
      console.log("Raw response:", response);
      console.log("Tasks data:", response.data);
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [userId, role]);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId, role, fetchTasks]);

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/employee_task/${taskId}`,
        {
          is_completed: newStatus === "completed",
        }
      );
      fetchTasks(); // Refresh tasks after update
    } catch (err) {
      setError("Failed to update task status");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/employee_task/${taskId}`
        );
        setTasks(tasks.filter((task) => task.employee_task_id !== taskId));
      } catch (err) {
        setError("Failed to delete task");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Tasks</h1>
          <p className="text-gray-600 mt-1">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} assigned
          </p>
        </div>

        {role === "admin" && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            <span className="material-symbols-outlined mr-2">add</span>
            Assign Task
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.employee_task_id}
              taskData={task}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDeleteTask}
              isAdmin={role === "admin"}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">
              task
            </span>
            <p className="text-gray-500">No tasks assigned yet</p>
          </div>
        )}
      </div>

      {/* We'll implement this AddTaskModal component next */}
      {isAddModalOpen && (
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onTaskAdded={fetchTasks}
        />
      )}
    </div>
  );
};

export default Tasks;
