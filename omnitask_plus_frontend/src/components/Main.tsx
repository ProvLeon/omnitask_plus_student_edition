import React from 'react';
import { Layout, Menu, Breadcrumb, Card, Col, Row } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Main extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              Dashboard
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              Activities
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Profile</Menu.Item>
              <Menu.Item key="4">Settings</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Projects">
              <Menu.Item key="5">Project 1</Menu.Item>
              <Menu.Item key="6">Project 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="7" icon={<FileOutlined />}>
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
              <Row gutter={16}>
                <Col span={8}>
                  <Card title="Project 1" bordered={false}>
                    Project 1 details...
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Project 2" bordered={false}>
                    Project 2 details...
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Activities" bordered={false}>
                    Recent activities...
                  </Card>
                </Col>
              </Row>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Omnitask Plus ©2023 Created by YourName</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Main
