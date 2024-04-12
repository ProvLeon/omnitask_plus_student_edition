import { Spin } from 'antd'; // Importing Spin component from antd for loading indicator

// Loading component to display a loading spinner
const Loading = () => {
  // Render a div that centers the spinner and displays a tip
  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <Spin size="large" tip="Loading..." /> {/* Large sized spinner with a 'Loading...' tip */}
    </div>
  );
};

export default Loading; // Exporting Loading component for use in other parts of the application
