import { useAuth } from "../../components/authentication";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const MetricCard = ({ title, value, textColor = "text-gray-900", icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
      {icon && (
        <span className="material-symbols-outlined text-3xl text-gray-400">
          {icon}
        </span>
      )}
    </div>
  </div>
);

const ExhibitionCard = ({ exhibition }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-lg text-gray-800 mb-2">
        {exhibition.name}
      </h3>
      <p className="text-gray-600 mb-4">{exhibition.description}</p>
      <div className="flex flex-col space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Location:</span>
          <span className="font-medium">{exhibition.room_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Dates:</span>
          <span className="font-medium">
            {formatDate(exhibition.start_date)} -{" "}
            {formatDate(exhibition.end_date)}
          </span>
        </div>
      </div>
    </div>
  );
};

const TaskPreviewCard = ({ task, isAdmin }) => {
  const formatDueDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{task.name}</h3>
          <p className="text-gray-600 mt-1">{task.description}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            task.is_completed
              ? "bg-green-100 text-green-800"
              : new Date(task.due_date) < new Date()
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {task.is_completed ? "Completed" : "Pending"}
        </span>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Due: {formatDueDate(task.due_date)}
        {isAdmin && (
          <div>
            <span className="text-gray-500">Assigned to:</span>{" "}
            <span className="font-medium text-gray-900">
              {task.employee_name || "Unassigned"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [error, setError] = useState(null);
  const { userId, role } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      let endpoint = `${import.meta.env.VITE_BACKEND_URL}/employee_task`;
      if (role !== "admin") {
        endpoint += `?employee_id=${userId}`;
      }
      const response = await axios.get(endpoint);
      console.log(response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(error.message);
    }
  }, [userId, role]);

  // Fetch exhibitions
  const fetchExhibitions = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/exhibition`
      );
      setExhibitions(response.data);
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
      setError(error.message);
    }
  }, []);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!userId) return;
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/employee/${userId}`
        );
        setUserInfo(response.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError(err.message);
      }
    };
    fetchUserInfo();
  }, [userId]);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchExhibitions()]);
      setLoading(false);
    };

    if (userId) {
      fetchAllData();
    }
  }, [userId, fetchTasks, fetchExhibitions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Calculate metrics
  const activeExhibitions = exhibitions.filter((ex) => ex.is_active).length;
  const pendingTasks = tasks.filter((task) => !task.is_completed).length;
  const overdueTask = tasks.filter(
    (task) => !task.is_completed && new Date(task.due_date) < new Date()
  ).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          {userInfo && (
            <p className="text-gray-600">Welcome, {userInfo.first_name}</p>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Active Exhibitions"
          value={activeExhibitions}
          icon="museum"
        />
        <MetricCard
          title="Pending Tasks"
          value={pendingTasks}
          textColor="text-yellow-600"
          icon="task"
        />
        <MetricCard
          title="Overdue Tasks"
          value={overdueTask}
          textColor="text-red-600"
          icon="warning"
        />
      </div>

      {/* Current Tasks */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {role === "admin" ? "Recent Task Overview" : "Your Recent Tasks"}
        </h2>
        <div className="grid gap-4">
          {tasks.length > 0 ? (
            tasks
              .slice(0, 3)
              .map((task) => (
                <TaskPreviewCard
                  key={task.employee_task_id}
                  task={task}
                  isAdmin={role === "admin"}
                />
              ))
          ) : (
            <p className="text-gray-500 text-center py-4">No tasks assigned</p>
          )}
        </div>
      </div>

      {/* Current Exhibitions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Newest Exhibitions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {exhibitions
            .filter((ex) => ex.is_active)
            .slice(0, 4)
            .map((exhibition) => (
              <ExhibitionCard
                key={exhibition.exhibit_id}
                exhibition={exhibition}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
