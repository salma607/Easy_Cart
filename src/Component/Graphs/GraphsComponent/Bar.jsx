import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function Bar() {
  const [barChartXAxis, setBarChartXAxis] = useState([]);
  const [barChartSeries, setBarChartSeries] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchBarChartData = async () => {
      let token;
      try {
        // Retrieve token from localStorage
        token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }
      } catch (err) {
        console.error("Error retrieving token", err);
        setError("Error retrieving token");
        return;
      }

      const apiUrl =
        "https://shehab123.pythonanywhere.com/product/statistics/bar_chart/";

      try {
        setLoading(true);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch data: ${response.statusText}`);
          setError("Failed to fetch data. Please try again later.");
          return;
        }

        const data = await response.json();

        // Update the state with the data from the server
        setDataset(data.dataset || []);
        setBarChartXAxis(data.xAxis || []);
        setBarChartSeries(
          (data.series || []).map((series, index) => ({
            ...series,
            color:
              index % 4 === 0
                ? "#4CAF50" // Medium Green
                : index % 4 === 1
                ? "#388E3C" // Dark Green
                : index % 4 === 2
                ? "#81C784" // Light Green
                : "#2E7D32", // Rich Green
          }))
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBarChartData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="m-5 p-4">
      <BarChart
        series={barChartSeries}
        xAxis={barChartXAxis}
        dataset={dataset}
        height={Math.min(window.innerWidth * 0.7, 300)} // Adjust height for mobile
        width={Math.min(window.innerWidth - 20, 500)} // Adjust width for mobile
        margin={{
          top: 20,
          bottom: 30,
          left: 20,
          right: 10,
        }} // Adjust margins for better spacing
      />
    </div>
  );
}