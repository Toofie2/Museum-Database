import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const Dashboard = () => {
  // Sample data for charts
  const salesData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5500 },
  ];

  // Summary cards data
  const summaryData = [
    {
      title: "Total Revenue",
      value: "$54,239",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Active Users",
      value: "2,435",
      change: "+18.2%",
      isPositive: true,
      icon: Users,
    },
    {
      title: "Total Orders",
      value: "1,258",
      change: "-3.1%",
      isPositive: false,
      icon: ShoppingCart,
    },
    {
      title: "Growth Rate",
      value: "23.5%",
      change: "+4.3%",
      isPositive: true,
      icon: TrendingUp,
    },
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      action: "New order placed",
      user: "John Doe",
      time: "2 minutes ago",
    },
    {
      id: 2,
      action: "Payment received",
      user: "Jane Smith",
      time: "15 minutes ago",
    },
    {
      id: 3,
      action: "New user registered",
      user: "Mike Johnson",
      time: "1 hour ago",
    },
    {
      id: 4,
      action: "Support ticket resolved",
      user: "Sarah Wilson",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 p-2 rounded-lg">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div
                className={`flex items-center ${
                  item.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.isPositive ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span className="text-sm ml-1">{item.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
