import React from 'react';

export const EmployeeTab = ({
  employeeData,
  searchQuery,
  setSearchQuery,
  selectedDepartment,
  setSelectedDepartment
}) => {
  const departmentGroups = employeeData.reduce((acc, employee) => {
    if (!acc[employee.department]) {
      acc[employee.department] = [];
    }
    acc[employee.department].push(employee);
    return acc;
  }, {});

  const departments = ["All", ...Object.keys(departmentGroups)];

  const filteredDepartmentGroups = Object.entries(departmentGroups).reduce(
    (acc, [department, employees]) => {
      const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (
        filteredEmployees.length > 0 &&
        (selectedDepartment === "All" || selectedDepartment === department)
      ) {
        acc[department] = filteredEmployees;
      }
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employees..."
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {Object.entries(filteredDepartmentGroups).map(([department, employees]) => (
        <div key={department} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {department} Department
            </h3>
            <span className="text-sm text-gray-500">
              {employees.length} {employees.length === 1 ? "Employee" : "Employees"}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasks
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {employee.tasks.length > 0 ? (
                        <ul className="list-none space-y-2">
                          {employee.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex flex-col">
                              <span className="font-medium text-gray-900">
                                {task.name}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {task.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic">
                          No tasks assigned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};