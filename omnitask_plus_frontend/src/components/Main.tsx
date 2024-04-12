import  { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Card, message, Modal } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  LineChartOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer } from 'recharts';
// import 'antd/dist/antd.css'; // Import Ant Design styles

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    // Check local storage to see if the user has already seen the intro
    const item = window.sessionStorage.getItem('hasSeenIntro');
    // Return true if the item exists, thus not showing the intro again
    return item ? true : false;
  });

  // Sample data for the charts
  const data = [
    { name: 'Jan', uv: 4000, pv: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398 },
    { name: 'Mar', uv: 2000, pv: 9800 },
    { name: 'Apr', uv: 2780, pv: 3908 },
    { name: 'May', uv: 1890, pv: 4800 },
    { name: 'Jun', uv: 2390, pv: 3800 },
    { name: 'Jul', uv: 3490, pv: 4300 },
  ];

  const onCollapse = (collapsed: boolean): void => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      console.log('Resized to: ', window.innerWidth, 'x', window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Welcome message animation
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
                  <li>View your <strong>Monthly Activities</strong> and <strong>Yearly Progress</strong> in the charts below.</li>
                  <li>Hover over the charts to see detailed statistics.</li>
                  <li>Click on any menu item to explore more features.</li>
                </ul>
                <p>Enjoy your journey with Omnitask Plus!</p>
              </div>
            ),
            icon: <InfoCircleOutlined />,
            onOk() {
              setHasSeenIntro(true); // Update state to indicate the intro has been seen
              window.sessionStorage.setItem('hasSeenIntro', 'true'); // Store this information in local storage to persist across sessions
            },
          });
        }
      });

    return () => window.removeEventListener('resize', handleResize);
  }, [hasSeenIntro]); // Add hasSeenIntro to the dependency array

  return (
    <Layout style={{ minHeight: 'auto' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo p-8" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />} onClick={() => console.log('Navigating to Dashboard')}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />} onClick={() => console.log('Navigating to Activities')}>
            Activities
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3" onClick={() => console.log('Navigating to Profile')}>Profile</Menu.Item>
            <Menu.Item key="4" onClick={() => console.log('Navigating to Settings')}>Settings</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6" onClick={() => console.log('Navigating to Team 1')}>Team 1</Menu.Item>
            <Menu.Item key="8" onClick={() => console.log('Navigating to Team 2')}>Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />} onClick={() => console.log('Navigating to Files')}>
            Files
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Card title="Activity Overview" bordered={false} style={{ marginBottom: 24, width: '100%', overflow: 'hidden' }}>
              <div>
                <BarChartOutlined style={{ fontSize: '22px', marginRight: '10px' }} />
                Monthly Activities
              </div>
              {/* Placeholder for actual bar chart component */}
              {/* Example Bar Chart Component */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pv" fill="#8884d8" />
                  <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Project Progress" bordered={false} style={{ width: '100%', overflow: 'hidden' }}>
              <div>
                <LineChartOutlined style={{ fontSize: '22px', marginRight: '10px' }} />
                Yearly Progress
              </div>
              {/* Placeholder for actual line chart component */}
              {/* Example Line Chart Component */}
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
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
// }

// export default Main;


