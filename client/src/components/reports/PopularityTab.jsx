import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const PopularityTab = ({
  popularityData,
  dateRange,
  handleDateChange,
}) => {
  const [sortBy, setSortBy] = useState('date');
  const [selectedGraph, setSelectedGraph] = useState('total');

  const filteredData = useMemo(() => {
    return popularityData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [popularityData, dateRange]);

  const exhibitionTotals = useMemo(() => {
    return filteredData.reduce((acc, day) => {
      day.exhibitions.forEach((exhibition) => {
        if (!acc[exhibition.name]) {
          acc[exhibition.name] = {
            name: exhibition.name,
            totalVisitors: 0,
            averageRating: 0,
            daysWithValidRating: 0,
            daysWithVisitors: 0,
            startDate: exhibition.start_date,
            endDate: exhibition.end_date,
          };
        }
        acc[exhibition.name].totalVisitors += exhibition.visitors || 0;
        acc[exhibition.name].daysWithVisitors += 1;
  
        if (exhibition.average_rating !== null && !isNaN(exhibition.average_rating)) {
          acc[exhibition.name].averageRating =
            (acc[exhibition.name].averageRating * acc[exhibition.name].daysWithValidRating +
              exhibition.average_rating) /
            (acc[exhibition.name].daysWithValidRating + 1);
          acc[exhibition.name].daysWithValidRating += 1;
        }
      });
      return acc;
    }, {});
  }, [filteredData]);

  const sortedDailyData = useMemo(() => {
    return filteredData.map((day) => ({
      date: new Date(day.date).toLocaleDateString(),
      totalVisitors: day.total_visitors,
      exhibitions: day.exhibitions.map((exhibition) => ({
        name: exhibition.name,
        visitors: exhibition.visitors || 0,
        rating: exhibition.average_rating ? Number(exhibition.average_rating.toFixed(1)) : null,
      })),
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredData]);

  const sortedExhibitionTotals = useMemo(() => {
    return Object.values(exhibitionTotals)
      .sort((a, b) => b.totalVisitors - a.totalVisitors)
      .map((exhibition) => ({
        ...exhibition,
        averageRating: exhibition.averageRating !== null 
          ? Number(exhibition.averageRating.toFixed(1)) 
          : 'N/A',
      }));
  }, [exhibitionTotals]);

  const chartData = useMemo(() => {
    if (selectedGraph === 'total') {
      return sortedDailyData.map(day => ({
        date: day.date,
        visitors: day.totalVisitors
      })).reverse();
    } else {
      return sortedDailyData.map(day => {
        const exhibition = day.exhibitions.find(ex => ex.name === selectedGraph);
        return {
          date: day.date,
          visitors: exhibition ? exhibition.visitors : 0
        };
      }).reverse();
    }
  }, [sortedDailyData, selectedGraph]);

  const exhibitionNames = useMemo(() => {
    const names = new Set();
    sortedDailyData.forEach(day => {
      day.exhibitions.forEach(exhibition => {
        names.add(exhibition.name);
      });
    });
    return Array.from(names);
  }, [sortedDailyData]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Exhibition Popularity</h2>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                View By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Daily Breakdown</option>
                <option value="exhibition">Exhibition Summary</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleDateChange(e, "startDate")}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-600">to</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleDateChange(e, "endDate")}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Popularity Trend</h3>
          <div className="w-64">
            <select
              value={selectedGraph}
              onChange={(e) => setSelectedGraph(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="total">Total Visitors</option>
              {exhibitionNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="visitors" 
                stroke="#8884d8" 
                name={selectedGraph === 'total' ? 'Total Visitors' : selectedGraph} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {sortBy === 'date' ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Daily Visits</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visitors</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exhibition</th>
                  <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
                  <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedDailyData.flatMap((day, index) => 
                  day.exhibitions.map((exhibition, exhibitionIndex) => (
                    <tr key={`${index}-${exhibitionIndex}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                      {exhibitionIndex === 0 && (
                        <>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900" rowSpan={day.exhibitions.length}>
                            {day.date}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900" rowSpan={day.exhibitions.length}>
                            {day.totalVisitors.toLocaleString()}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                        {exhibition.name}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        {exhibition.visitors.toLocaleString()}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                        {exhibition.rating ? `${exhibition.rating} ` : 'No rating'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Exhibition Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exhibition Name</th>
                  <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visitors</th>
                  <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Average Rating</th>
                  <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedExhibitionTotals.map((exhibition, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{exhibition.name}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{exhibition.totalVisitors.toLocaleString()}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{exhibition.averageRating}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{new Date(exhibition.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{new Date(exhibition.endDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};