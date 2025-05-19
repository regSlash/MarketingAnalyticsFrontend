import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ErrorBoundary } from 'react-error-boundary';

const data = [
  { name: 'Jan', openRate: 0.25 },
  { name: 'Feb', openRate: 0.32 },
  { name: 'Mar', openRate: 0.28 },
  { name: 'Apr', openRate: 0.35 },
];

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{ color: 'red', padding: '20px' }}>
      Chart Error: {error.message}
    </div>
  );
}

export default function AnalyticsChart() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div style={{ width: '100%', height: 300 }}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="openRate"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </div>
    </ErrorBoundary>
  );
}