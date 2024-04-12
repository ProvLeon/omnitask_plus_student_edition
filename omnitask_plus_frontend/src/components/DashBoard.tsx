import  { useState, useEffect } from 'react';
// Importing necessary UI components from antd library
import { Layout, Menu, Breadcrumb, Card, message, Modal, Row, Col } from 'antd';
// Importing hooks for navigation and location from react-router-dom
import { useNavigate, useLocation } from 'react-router-dom';
// Importing icons from ant-design for menu items
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  LineChartOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
// Importing components from recharts for data visualization
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// Importing API functions to fetch data for charts
import { fetchActivitiesTrendsData, fetchProgressTrendsData, fetchPriorityTrendsData } from './apis/TaskApi';

// Destructuring Layout components for easier usage
const { Header, Content, Footer, Sider } = Layout;

// Main component for the Dashboard
const Main = () => {
  // State hooks for managing component state
  const [collapsed, setCollapsed] = useState(false);
  const [activitiesTrendsData, setActivitiesTrendsData] = useState([]);
  const [progressTrendsData, setProgressTrendsData] = useState([]);
  const [priorityTrendsData, setPriorityTrendsData] = useState([]);
  // State for checking if the intro modal has been seen
  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    const item = window.sessionStorage.getItem('hasSeenIntro');
    return item ? true : false;
  });

  // Hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle sidebar collapse
  const onCollapse = (collapsed: boolean): void => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  // Effect hook to fetch data and handle resize events
  useEffect(() => {
    // Async function to fetch data for charts
    const getTrendsData = async () => {
      const activitiesData = await fetchActivitiesTrendsData();
      const progressData = await fetchProgressTrendsData();
      const priorityData = await fetchPriorityTrendsData();
      // Mapping activities data for the bar chart
      if (activitiesData ) {
        setActivitiesTrendsData(activitiesData.map((data: { month: string; total_tasks: number; tasks_done: number }) => ({
          ...data,
          month: data.month,
          "Total Tasks": data.total_tasks,
          "Tasks Done": data.tasks_done
        })));
        console.log(activitiesData)
      } else {
        setActivitiesTrendsData([]);
      }
      // Setting state for progress and priority data
      if (progressData) {
        setProgressTrendsData(progressData);
      } else {
        setProgressTrendsData([]);
      }
      if (priorityData) {
        setPriorityTrendsData(priorityData);
      } else {
        setPriorityTrendsData([]);
      }
    };

    getTrendsData();

    // Function to log window resize events
    const handleResize = () => {
      console.log('Resized to: ', window.innerWidth, 'x', window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Displaying loading message and intro modal if not seen
    message.loading({ content: 'Loading dashboard...', duration: 2.5 })
      .then(() => message.success({ content: 'Welcome to Omnitask Plus!', duration: 2.5 }), () => {})
      .then(() => {
        if (!hasSeenIntro) {
          Modal.info({
            title: 'Getting Started with Omnitask Plus Dashboard',
            content: (
              <div>
                <p>Welcome to your dashboard! Here's a quick guide to get you started:</p>
                <ul>
                  <li>Use the <strong>Menu</strong> on the left to navigate between different sections.</li>
                  <li>View your <strong>Monthly Activities</strong>, <strong>Yearly Progress</strong>, and <strong>Task Priorities</strong> in the charts below.</li>
                  <li>Hover over the charts to see detailed statistics.</li>
                  <li>Click on any menu item to explore more features.</li>
                </ul>
                <p>Enjoy your journey with Omnitask Plus!</p>
              </div>
            ),
            icon: <InfoCircleOutlined />,
            onOk() {
              setHasSeenIntro(true);
              window.sessionStorage.setItem('hasSeenIntro', 'true');
            },
          });
        }
      });

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [hasSeenIntro]);

  // Define colors for priority categories in the pie chart
  const COLORS = ['#FF8042', '#FFBB28', '#00C49F'];

  // Function to handle navigation based on menu click
  const handleMenuClick = (e: any) => {
    const key = e.key;
    const routeMap = {
      '1': '/main',
      '2': '/main/boards',
      '3': '/main/tasks',
      '4': '/main/chat',
    };
    navigate(routeMap[key as keyof typeof routeMap]);
  };

  // Generating breadcrumb items from the current path
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const breadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return { breadcrumbName: snippet.charAt(0).toUpperCase() + snippet.slice(1), path: url };
  });

  // Main render method
  return (
    <Layout style={{ minHeight: 'auto' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo p-8" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={handleMenuClick}>
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Boards
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            Tasks
          </Menu.Item>
          <Menu.Item key="4" icon={<TeamOutlined />}>
            Chat
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbItems.map((item, index) => (
              <Breadcrumb.Item key={index} onClick={() => navigate(item.path)}>
                {item.breadcrumbName}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card title="Activity Overview" bordered={false} style={{ marginBottom: 24, width: '100%', overflow: 'hidden' }}>
                  <div>
                    <BarChartOutlined style={{ fontSize: '22px', marginRight: '10px' }} />
                    Monthly Activities
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activitiesTrendsData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Total Tasks" fill="#8884d8" />
                      <Bar dataKey="Tasks Done" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card title="Task Priority Overview" bordered={false} style={{ width: '100%', overflow: 'hidden' }}>
                  <div>
                    <PieChartOutlined style={{ fontSize: '22px', marginRight: '10px' }} />
                    Task Priorities
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={priorityTrendsData} dataKey="count" nameKey="priority" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                        {
                          priorityTrendsData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>)
                        }
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
            <Card title="Tasks Progress Overview" bordered={false} style={{ marginBottom: 24, width: '100%', overflow: 'hidden' }}>
              <div>
                <LineChartOutlined style={{ fontSize: '22px', marginRight: '10px' }} />
                Monthly Progress
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressTrendsData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="todo" stroke="#8884d8" />
                  <Line type="monotone" dataKey="in_progress" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="done" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Omnitask Plus ©{new Date().getFullYear()} Created by LeoTech-Digital</Footer>
      </Layout>
    </Layout>
  );
}

export default Main;
